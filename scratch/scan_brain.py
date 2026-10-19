import os
from PIL import Image

brain_dir = r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0'
results = []
for root, dirs, files in os.walk(brain_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            fp = os.path.join(root, f)
            try:
                with Image.open(fp) as im:
                    results.append((fp, im.size, os.path.getsize(fp), os.path.getmtime(fp)))
            except:
                pass

results.sort(key=lambda x: x[3], reverse=True)
print(f"Total images found in brain dir: {len(results)}")
for fp, sz, byte_sz, mtime in results:
    rel = os.path.relpath(fp, brain_dir)
    print(f"{rel} | size={sz} | bytes={byte_sz} | time={mtime}")
