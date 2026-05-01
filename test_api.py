
import json
from app import app

def test_analyze():
    print("Starting AI Analysis Test...")
    client = app.test_client()
    payload = {
        "prompt": "You are an expert AI Medical Triage Assistant. Analyze the following patient data for Test Patient. Format your response strictly in JSON with the following keys: 1. \"riskScore\", 2. \"analysis\", 3. \"possibleDiseases\", 4. \"preventionSteps\". Patient Data: Age: 25, Symptoms: fever"
    }
    
    try:
        response = client.post('/api/analyze', 
                               json=payload, 
                               headers={"X-User-ID": "test-user-id"})
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.get_data(as_text=True))
    except Exception as e:
        print(f"Test crashed: {e}")

if __name__ == "__main__":
    test_analyze()
