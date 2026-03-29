import os
import requests
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GROQ_API_KEY")
print(f"Key exists: {bool(key)}")
if key:
    print(f"Key starts with: {key[:10]}...")

model = "meta-llama/llama-4-scout-17b-16e-instruct"
headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}
payload = {
    "model": model,
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 10
}

try:
    print("Testing Groq API connection...")
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
