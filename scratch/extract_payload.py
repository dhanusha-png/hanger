import json, base64, re

msg_file = r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.system_generated\messages\ed26e52c-4b1b-4cb9-a9be-b2aa54e1bc1e.json'

with open(msg_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

payload = data.get('stepPayload', '')
print("Payload length:", len(payload))

# Let's inspect references to files or images in payload or message
matches = re.findall(r'[A-Za-z0-9_\\/\:\.-]+\.(?:png|jpg|jpeg|webp)', payload)
print("File matches in payload:", matches)
