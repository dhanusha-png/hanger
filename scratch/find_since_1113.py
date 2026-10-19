import os, datetime

t_min = 1792322000 # 2026-10-18 11:13:20 UTC

dirs_to_check = [
    r'C:\Users\adhan\.gemini\antigravity-ide',
    r'C:\Users\adhan\AppData\Roaming\Code',
    r'C:\Users\adhan\AppData\Roaming\antigravity',
    r'c:\Users\adhan\Downloads\HangerHome_Premium_FullStack_FULLY_UPDATED'
]

found = []
for base in dirs_to_check:
    if not os.path.exists(base):
        continue
    for root, dirs, files in os.walk(base):
        # avoid node_modules, .git
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]
        for f in files:
            fp = os.path.join(root, f)
            try:
                mtime = os.path.getmtime(fp)
                if mtime >= t_min:
                    sz = os.path.getsize(fp)
                    found.append((fp, mtime, sz))
            except:
                pass

found.sort(key=lambda x: x[1], reverse=True)
print(f"Found {len(found)} files modified since 11:13 UTC:")
for fp, mtime, sz in found[:50]:
    dt = datetime.datetime.fromtimestamp(mtime)
    print(f"  {dt} | {sz:>10} | {fp}")
