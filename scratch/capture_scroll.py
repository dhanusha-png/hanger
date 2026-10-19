import os, subprocess, time

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Let's take full page or scrolled screenshots
# We can create an html wrapper or run a node puppeteer script if available, or use Edge with different window height
for h, name in [(2400, 'install_page_scroll.png'), (3800, 'install_page_full.png')]:
    out_path = os.path.abspath(f'scratch/{name}')
    cmd = [
        edge_path,
        '--headless=new',
        '--disable-gpu',
        '--window-size=1920,' + str(h),
        '--virtual-time-budget=3000',
        f'--screenshot={out_path}',
        'http://localhost:5173/installations'
    ]
    subprocess.run(cmd, check=True)
    print(f'Captured: {name} ({os.path.getsize(out_path)} bytes)')
