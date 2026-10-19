import json, base64

msg_file = r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.system_generated\messages\ed26e52c-4b1b-4cb9-a9be-b2aa54e1bc1e.json'

with open(msg_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

raw = base64.b64decode(data['stepPayload'])
print("Raw bytes length:", len(raw))

import re
# find all strings in raw bytes
strings = re.findall(rb'[\x20-\x7e]{4,}', raw)
for s in strings:
    s_str = s.decode('latin1')
    if any(k in s_str.lower() for k in ['.jpg', '.png', '.webp', 'media_', 'image', 'user_uploaded', 'tempmedia']):
        print("MATCH:", s_str)
