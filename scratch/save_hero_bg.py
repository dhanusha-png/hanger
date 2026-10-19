from PIL import Image
import os

src_path = r'C:/Users/adhan/.gemini/antigravity-ide/brain/9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0/.user_uploaded/media_1792317190694.jpg'
targets = [
    r'client/src/assets/installations/installations-hero-bg.jpg',
    r'client/src/assets/installations/installations-hero-bg.webp',
    r'client/public/installations/installations-hero-bg.jpg',
    r'client/public/installations/installations-hero-bg.webp'
]

with Image.open(src_path) as im:
    print(f"Original size: {im.size}")
    # Target size: 2560 wide, maintaining 16:9 ratio -> 2560 x 1440
    upscaled = im.resize((2560, 1440), Image.Resampling.LANCZOS)
    for target in targets:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        if target.endswith('.webp'):
            upscaled.save(target, 'WEBP', quality=94)
        else:
            upscaled.save(target, 'JPEG', quality=95)
        print(f"Saved: {target} ({os.path.getsize(target)} bytes)")

print("Hero background upscaling complete!")
