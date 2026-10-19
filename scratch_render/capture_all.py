import os
import subprocess
import time
from PIL import Image

products = [
    ("hanger_1", "hanger-premium-wall-mounted.jpg"),
    ("hanger_2", "hanger-multi-tier-folding.jpg"),
    ("hanger_3", "hanger-heavy-duty-garment.jpg"),
    ("hanger_4", "hanger-compact-balcony.jpg"),
    ("hanger_5", "hanger-adjustable-drying.jpg"),
    ("hanger_6", "hanger-foldable-space-saver.jpg"),
    ("hanger_7", "hanger-stainless-steel.jpg"),
    ("hanger_8", "hanger-multipurpose-stand.jpg"),
    ("hanger_9", "hanger-extendable-drying.jpg"),
    ("hanger_10", "hanger-deluxe-freestanding.jpg"),
    ("shoe_rack_1", "shoe-rack-compact-3-tier.jpg"),
    ("shoe_rack_2", "shoe-rack-premium-4-tier.jpg"),
    ("shoe_rack_3", "shoe-rack-slim-entryway.jpg"),
    ("shoe_rack_4", "shoe-rack-modern-5-tier.jpg"),
    ("shoe_rack_5", "shoe-rack-space-saving.jpg"),
    ("shoe_rack_6", "shoe-rack-heavy-duty.jpg"),
    ("shoe_rack_7", "shoe-rack-foldable.jpg"),
    ("shoe_rack_8", "shoe-rack-family-organizer.jpg"),
    ("shoe_rack_9", "shoe-rack-premium-metal.jpg"),
    ("shoe_rack_10", "shoe-rack-tall-multilevel.jpg"),
]

base_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(base_dir, "render.html").replace("\\", "/")
target_dir = os.path.abspath(os.path.join(base_dir, "..", "client", "public", "products"))
os.makedirs(target_dir, exist_ok=True)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

print(f"Using browser: {chrome_path}")
print(f"Target directory: {target_dir}")

for model_id, filename in products:
    url = f"file:///{html_path}?id={model_id}"
    temp_png = os.path.join(base_dir, f"temp_{model_id}.png")
    final_jpg = os.path.join(target_dir, filename)

    cmd = [
        chrome_path,
        "--headless=new",
        f"--screenshot={temp_png}",
        "--window-size=1000,1000",
        "--hide-scrollbars",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=2000",
        url
    ]

    print(f"Rendering {model_id} -> {filename}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(temp_png):
        with Image.open(temp_png) as img:
            rgb_img = img.convert("RGB")
            # crop to exact 1000x1000
            cropped = rgb_img.crop((0, 0, 1000, 1000))
            cropped.save(final_jpg, "JPEG", quality=95)
        os.remove(temp_png)
        size_kb = os.path.getsize(final_jpg) // 1024
        print(f"[OK] Saved {filename} ({size_kb} KB, 1000x1000)")
    else:
        print(f"[FAIL] Failed to capture {temp_png}")

print("\nAll 20 products processed.")
