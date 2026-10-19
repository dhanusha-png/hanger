import os

for root, dirs, files in os.walk('client/src'):
    if 'services' in root:
        continue
    for f in files:
        if f.endswith(('.jsx', '.js')):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8', errors='ignore') as file:
                c = file.read()
                if 'services/' in c or 'ServicesPage' in c:
                    print(fp)
