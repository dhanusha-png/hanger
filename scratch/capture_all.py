import os, subprocess, time

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
if not os.path.exists(chrome):
    chrome = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

outDir = r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0'

tasks = [
    ('install_1920.png', 1920, 1080, 'http://localhost:5173/installations'),
    ('install_1440.png', 1440, 900,  'http://localhost:5173/installations'),
    ('install_1024.png', 1024, 768,  'http://localhost:5173/installations'),
    ('install_768.png',  768,  1024, 'http://localhost:5173/installations'),
    ('install_390.png',  390,  844,  'http://localhost:5173/installations'),
    ('install_categories_1920.png', 1920, 1080, 'http://localhost:5173/installations#installation-categories'),
    ('install_services_1920.png',   1920, 1080, 'http://localhost:5173/installations#service-solutions'),
    ('install_booking_1920.png',    1920, 1080, 'http://localhost:5173/installations#booking-section'),
]

for name, w, h, url in tasks:
    outFile = os.path.join(outDir, name)
    cmd = [
        chrome,
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        f'--window-size={w},{h}',
        '--virtual-time-budget=4000',
        f'--screenshot={outFile}',
        url
    ]
    subprocess.run(cmd, check=True)
    print(f"Captured {name}: {w}x{h} -> {os.path.getsize(outFile)} bytes")

print("All screenshots captured successfully!")
