import os, re

pattern = re.compile(r'["\'](/services(?:[#?][^"\']*)?)["\']')
for root, dirs, files in os.walk('client/src'):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist']]
    for f in files:
        if f.endswith(('.jsx', '.js', '.tsx', '.ts')):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8', errors='ignore') as file:
                lines = file.readlines()
                for i, line in enumerate(lines, 1):
                    found = pattern.findall(line)
                    if found:
                        print(f"{fp}:{i} -> {found} :: {line.strip()[:100]}")
