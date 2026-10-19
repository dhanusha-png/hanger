import os, subprocess, time

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
if not os.path.exists(chrome):
    chrome = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'theme-baseline'))
os.makedirs(base_dir, exist_ok=True)

routes = [
    ('home', 'http://localhost:5173/'),
    ('products', 'http://localhost:5173/products'),
    ('product-details', 'http://localhost:5173/products/foldable-shoe-rack'),
    ('gallery', 'http://localhost:5173/gallery'),
    ('installation-service', 'http://localhost:5173/installations'),
    ('about', 'http://localhost:5173/about'),
    ('contact', 'http://localhost:5173/contact'),
    ('search', 'http://localhost:5173/search?q=hanger'),
    ('login', 'http://localhost:5173/login'),
    ('register', 'http://localhost:5173/register'),
    ('cart', 'http://localhost:5173/cart'),
    ('wishlist', 'http://localhost:5173/wishlist'),
    ('checkout', 'http://localhost:5173/checkout'),
    ('order-success', 'http://localhost:5173/order-success/demo123456'),
    ('404', 'http://localhost:5173/404')
]

viewports = [
    ('390px', 390, 844),
    ('1024px', 1024, 768),
    ('1920px', 1920, 1080)
]

total = len(routes) * len(viewports)
count = 0

print(f"Starting capture of {total} baseline screenshots into {base_dir}...")

for name, url in routes:
    for vp_name, w, h in viewports:
        count += 1
        filename = f"{name}_{vp_name}.png"
        out_file = os.path.join(base_dir, filename)
        cmd = [
            chrome,
            '--headless=new',
            '--disable-gpu',
            '--no-first-run',
            '--no-default-browser-check',
            f'--window-size={w},{h}',
            '--virtual-time-budget=3000',
            f'--screenshot={out_file}',
            url
        ]
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            size = os.path.getsize(out_file) if os.path.exists(out_file) else 0
            print(f"[{count}/{total}] {filename} ({w}x{h}) -> {size} bytes")
        except Exception as e:
            print(f"[{count}/{total}] FAILED {filename}: {e}")

print("Baseline capture finished.")
