import os
from PIL import Image

dirs = [
    r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.tempmediaStorage',
    r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.user_uploaded'
]

for d in dirs:
    print("DIR:", d)
    if os.path.exists(d):
        for f in sorted(os.listdir(d), key=lambda x: os.path.getmtime(os.path.join(d, x)), reverse=True)[:10]:
            fp = os.path.join(d, f)
            try:
                with Image.open(fp) as im:
                    print(f"  {f} | {im.size} | {im.format} | {os.path.getsize(fp)} bytes")
            except Exception as e:
                print(f"  {f} | {e}")
