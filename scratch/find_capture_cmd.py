import json

with open(r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if 'gallery_1920.png' in line:
            data = json.loads(line)
            print("STEP:", data.get('step_index'))
            cmd = data.get('tool_calls', [{}])[0].get('args', {}).get('CommandLine', '')
            print("CMD:", cmd)
