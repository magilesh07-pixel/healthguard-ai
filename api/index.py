import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import sqlite3
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Use absolute path for DB in Vercel environment
# Note: SQLite on Vercel is read-only and ephemeral. 
# For persistent storage, a real database like Vercel Postgres or Supabase is required.
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "healthguard.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.execute('PRAGMA journal_mode=WAL')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            data TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Init error: {e}")

# Initialize DB (will fail on Vercel if read-only, but that's expected)
init_db()

@app.route('/api/history', methods=['GET', 'POST'])
def history():
    user_id = 1
    if request.method == 'POST':
        try:
            data = request.json
            record_type = data.get('type')
            record_data = json.dumps(data.get('data'))
            
            conn = get_db_connection()
            conn.execute("INSERT INTO history (user_id, type, data) VALUES (?, ?, ?)", (user_id, record_type, record_data))
            conn.commit()
            conn.close()
            return jsonify({"message": "History saved"})
        except Exception as e:
            return jsonify({"error": f"Storage error: {str(e)}. Note: Vercel SQLite is read-only."}), 500
    else:
        try:
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
        except Exception as e:
            return jsonify([])

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
                return jsonify({"error": "Missing prompt"}), 400
            
            user_content = [{"type": "text", "text": prompt}]
            if image:
                user_content.append({"type": "image_url", "image_url": {"url": image}})
            messages = [{"role": "user", "content": user_content}]

        headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": messages,
            "temperature": 0.1
        }
        if not historical_messages or len(historical_messages) == 0:
            payload["response_format"] = {"type": "json_object"}

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        if not response.ok:
            return jsonify({"error": "Groq API error"}), response.status_code

        content = response.json()["choices"][0]["message"]["content"]
        if not historical_messages or len(historical_messages) == 0:
            return jsonify(json.loads(content))
        return jsonify({"content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    if not messages:
        return jsonify({"error": "Missing messages"}), 400

    system_prompt = {"role": "system", "content": "You are Dr. M.B.Magilesh, an AI medical consultant."}
    try:
        headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": [system_prompt] + messages,
            "temperature": 0.7,
            "max_tokens": 600
        }
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        return jsonify({"content": response.json()["choices"][0]["message"]["content"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel needs the 'app' object
handler = app
