import urllib.request
import json

payload = {
    "sender_name": "Test User",
    "sender_email": "test@example.com",
    "subject": "Test Reference ID Visibility",
    "body": "This is a test body to verify if the reference ID is generated and returned by the API."
}

try:
    # 1. Test POST simulation
    req = urllib.request.Request(
        "http://localhost:8000/api/test-email",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as response:
        print("POST /api/test-email Status:", response.status)
        print("POST Response:", json.loads(response.read().decode()))

    # 2. Test GET complaints
    with urllib.request.urlopen("http://localhost:8000/api/complaints?limit=1") as response:
        print("\nGET /api/complaints Status:", response.status)
        data = json.loads(response.read().decode())
        if data:
            last_complaint = data[0]
            print("Last Complaint Reference ID:", last_complaint.get("reference_id"))
            print("Full last complaint keys:", last_complaint.keys())
        else:
            print("No complaints found.")

except Exception as e:
    print("Error:", e)
