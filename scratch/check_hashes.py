import hashlib, os

files = [
    r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.tempmediaStorage\media_1792323879656.jpg',
    r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.tempmediaStorage\media_1792322636982.jpg',
    r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.tempmediaStorage\media_1792322453782.jpg',
    r'C:\Users\adhan\.gemini\antigravity-ide\brain\9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0\.user_uploaded\media_1792319852821.jpg'
]

for f in files:
    if os.path.exists(f):
        h = hashlib.md5(open(f, 'rb').read()).hexdigest()
        print(os.path.basename(f), h)
