import subprocess, tempfile

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
temp_dir = tempfile.mkdtemp()
cmd = [edge, '--headless=new', f'--user-data-dir={temp_dir}', '--disable-gpu', '--dump-dom', 'http://localhost:5173/products/foldable-shoe-rack']
res = subprocess.run(cmd, capture_output=True, text=True)
pos = res.stdout.find('<main>')
if pos != -1:
    print("Found main:")
    print(res.stdout[pos:pos+600])
