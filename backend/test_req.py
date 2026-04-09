import requests
import json

url = "http://localhost:5000/api/chat"
payload = {"message": "Test message from agent script", "user_id": "agent_test@example.com"}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
