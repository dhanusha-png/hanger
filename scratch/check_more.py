import json

with open(r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        idx = data.get('step_index')
        if idx in [1143, 1145, 1151, 1153, 1160, 1162, 1190, 1191, 1192, 1193, 1194]:
            t = data.get('thinking', '')
            c = str(data.get('content', ''))
            print(f"STEP {idx} [{data.get('type')}]:")
            if t:
                print("  THINKING:", t[:200])
            if c:
                print("  CONTENT:", c[:200])
