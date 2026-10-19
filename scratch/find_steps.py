import json

with open(r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        idx = data.get('step_index')
        if idx and 1140 <= idx <= 1196:
            if data.get('type') == 'PLANNER_RESPONSE':
                tc = data.get('tool_calls', [])
                if tc:
                    name = tc[0].get('name')
                    args = tc[0].get('args', {})
                    summary = args.get('toolSummary', '')
                    cmd = args.get('CommandLine', '') or args.get('AbsolutePath', '')
                    print(f"STEP {idx}: {name} | {summary} | {cmd[:80]}")
