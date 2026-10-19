import json

with open(r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        idx = data.get('step_index')
        if idx in [1142, 1143, 1144, 1150, 1151, 1152]:
            print(f"STEP {idx}: {data.get('type')}")
            print("thinking:", str(data.get('thinking', ''))[:300])
