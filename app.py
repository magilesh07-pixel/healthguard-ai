import os
import json
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__, static_folder='dist')
CORS(app)

import sqlite3
import hashlib
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = "healthguard.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.execute('PRAGMA journal_mode=WAL')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    # History table (for intake records and scans)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL, -- 'intake' or 'scan'
        data TEXT NOT NULL, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    conn.commit()
    conn.close()

# Initialize DB on start
init_db()

# Auth & History Endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Missing fields"}), 400

    hashed_pw = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", (email, hashed_pw, name))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "User registered", "user": {"id": user_id, "email": email, "name": name}})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        return jsonify({"user": {"id": user['id'], "email": user['email'], "name": user['name']}})
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/history', methods=['GET', 'POST'])
def history():
    user_id = request.headers.get('X-User-ID', 1) # Default to user 1 for global history

    if request.method == 'POST':
        data = request.json
        record_type = data.get('type') # 'intake' or 'scan'
        record_data = json.dumps(data.get('data'))
        
        conn = get_db_connection()
        conn.execute("INSERT INTO history (user_id, type, data) VALUES (?, ?, ?)", (user_id, record_type, record_data))
        conn.commit()
        conn.close()
        return jsonify({"message": "History saved"})
    else:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC", (user_id,)).fetchall()
        conn.close()
        
        result = []
        for row in rows:
            result.append({
                "id": row['id'],
                "type": row['type'],
                "data": json.loads(row['data']),
                "timestamp": row['timestamp']
            })
        return jsonify(result)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    prompt = data.get('prompt')
    image = data.get('image')
    historical_messages = data.get('messages', [])

    try:
        messages = []
        if historical_messages and len(historical_messages) > 0:
            messages = historical_messages
        else:
            if not prompt:
                return jsonify({"error": "Missing prompt in request body"}), 400
            
            user_content = [{"type": "text", "text": prompt}]
            if image:
                user_content.append({
                    "type": "image_url",
                    "image_url": {"url": image}
                })
            
            messages = [{"role": "user", "content": user_content}]

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": messages,
            "temperature": 0.1
        }
        
        # Enforce JSON only for the initial diagnostic
        if not historical_messages or len(historical_messages) == 0:
            payload["response_format"] = {"type": "json_object"}

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        if not response.ok:
            err = response.json()
            return jsonify({"error": err.get("error", {}).get("message", "Groq API error")}), response.status_code

        groq_data = response.json()
        content = groq_data["choices"][0]["message"]["content"]

        if not historical_messages or len(historical_messages) == 0:
            try:
                return jsonify(json.loads(content))
            except json.JSONDecodeError:
                return jsonify({
                    "findings": content, 
                    "status": "Requires Review", 
                    "protocols": ["Manual verification required"]
                })
        else:
            return jsonify({"content": content})

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Proxy error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])

    if not messages or not isinstance(messages, list) or len(messages) == 0:
        return jsonify({"error": "Missing messages array in request body"}), 400

    system_prompt = {
        "role": "system",
        "content": """You are Dr. M.B.Magilesh, a highly knowledgeable, empathetic, and professional AI medical consultant for the HealthGuard AI platform.

Your role:
- Answer health-related questions with clinical accuracy and compassion
- Provide personalized advice based on what the patient tells you (age, symptoms, risk scores, vitals, etc.)
- Use markdown formatting: **bold** for important terms, bullet points for lists
- Keep responses concise but complete — 3 to 6 paragraphs maximum
- If a patient mentions a specific value (like risk score 90, BP 130/80, BMI 28), acknowledge it specifically and give tailored advice
- Always end with a relevant follow-up question or next step to keep the consultation going
- Remind the patient that your advice is informational and they should see a real doctor for diagnosis

Restrictions:
- Stay strictly within medical and health topics
- Do not diagnose definitively — say "this may suggest" or "this could indicate"
- If someone mentions an emergency (chest pain, stroke, difficulty breathing), immediately tell them to call emergency services (112/911)
- Never provide specific drug dosages or prescriptions
- Be warm, professional, and use "sir" or appropriate address when the patient uses it"""
    }

    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": [system_prompt] + messages,
            "temperature": 0.7,
            "max_tokens": 600
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        if not response.ok:
            err = response.json()
            return jsonify({"error": err.get("error", {}).get("message", "Groq API error")}), response.status_code

        groq_data = response.json()
        content = groq_data["choices"][0]["message"]["content"]
        return jsonify({"content": content})

    except Exception as e:
        print(f"AI Doctor API error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Catch-all route to serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # During dev, we serve the frontend via Vite normally, 
    # but we can use this for the API.
    # In production, this hosts the entire thing.
    app.run(port=3001, debug=True)
