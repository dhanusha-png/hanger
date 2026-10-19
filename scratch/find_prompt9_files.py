import os, time, datetime

target_dirs = [
    r'C:\Users\adhan\.gemini',
    r'C:\Users\adhan\Downloads',
    r'C:\Users\adhan\AppData\Local\Temp'
]

# 2026-10-18 11:18 to 11:22 UTC
# In local time (IST = UTC+5:30), 11:19 UTC is 16:49 IST.
# Let's search by timestamp:
t_start = datetime.datetime(2026, 10, 18, 16, 45, 0).timestamp()
t_end = datetime.datetime(2026, 10, 18, 16, 55, 0).timestamp()

found = []
for base in target_dirs:
    for root, dirs, files in os.walk(base):
        for f in files:
            fp = os.path.join(root, f)
            try:
                mtime = os.path.getmtime(fp)
                if t_start <= mtime <= t_end:
                    found.append((fp, mtime, os.path.getsize(fp)))
            except:
                pass

print(f"Found {len(found)} files modified between 16:45 and 16:55 IST:")
for fp, m, sz in sorted(found, key=lambda x: x[1]):
    if any(fp.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.webp']):
        print(f"  IMAGE: {fp} ({sz} bytes, mtime={datetime.datetime.fromtimestamp(m)})")
    else:
        print(f"  FILE: {fp} ({sz} bytes)")
