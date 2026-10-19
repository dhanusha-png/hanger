import os, subprocess, time

# We can write a tiny node script using puppeteer or playwright if installed, or use Edge with a simple wrapper
# Let's check if puppeteer or playwright is in client node_modules:
print("Checking node modules...")
has_puppeteer = os.path.exists('client/node_modules/puppeteer')
print("Has puppeteer:", has_puppeteer)
