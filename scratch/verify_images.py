import os
from PIL import Image

pA = r'C:/Users/adhan/.gemini/antigravity-ide/brain/9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0/.user_uploaded/media_1792317182056.png'
pB = r'C:/Users/adhan/.gemini/antigravity-ide/brain/9093cb07-8cba-4c8c-aeaa-c6c2d94d60f0/.user_uploaded/media_1792317190694.jpg'

imA = Image.open(pA)
imB = Image.open(pB)

print("Image A (Installations page screenshot):", imA.size, imA.format, os.path.getsize(pA))
print("Image B (New hero background photo):", imB.size, imB.format, os.path.getsize(pB))
