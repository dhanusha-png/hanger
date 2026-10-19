const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

const outDir = path.resolve(__dirname, '..', 'theme-baseline');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const port = 9999;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-fullpage-'));

const browserProc = spawn(browserExe, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const timeout = setTimeout(() => {
      ws.removeEventListener('message', handler);
      reject(new Error(`CDP timeout for ${method}`));
    }, 20000);

    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        clearTimeout(timeout);
        ws.removeEventListener('message', handler);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const routes = [
  ['home', 'http://localhost:5173/'],
  ['products', 'http://localhost:5173/products'],
  ['product-details', 'http://localhost:5173/products/foldable-shoe-rack'],
  ['gallery', 'http://localhost:5173/gallery'],
  ['installation-service', 'http://localhost:5173/installations'],
  ['about', 'http://localhost:5173/about'],
  ['contact', 'http://localhost:5173/contact'],
  ['search', 'http://localhost:5173/search?q=hanger'],
  ['login', 'http://localhost:5173/login'],
  ['register', 'http://localhost:5173/register'],
  ['cart', 'http://localhost:5173/cart'],
  ['wishlist', 'http://localhost:5173/wishlist'],
  ['checkout', 'http://localhost:5173/checkout'],
  ['order-success', 'http://localhost:5173/order-success/demo123456'],
  ['404', 'http://localhost:5173/404']
];

const viewports = [
  ['390px', 390, true],
  ['1024px', 1024, false],
  ['1920px', 1920, false]
];

async function run() {
  await sleep(1500);
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === 'page');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    await sendCDP(ws, 'Page.enable');
    await sendCDP(ws, 'Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    let current = 0;
    const total = routes.length * viewports.length;

    for (const [routeName, url] of routes) {
      for (const [vpName, width, isMobile] of viewports) {
        current++;
        const filename = `${routeName}_${vpName}.png`;
        const filePath = path.join(outDir, filename);

        // Reset viewport for navigation
        await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
          width: width,
          height: 1080,
          deviceScaleFactor: 1,
          mobile: isMobile
        });

        await sendCDP(ws, 'Page.navigate', { url });

        // Wait for page to render and stabilize
        await sleep(1200);

        // Wait for fonts
        await sendCDP(ws, 'Runtime.evaluate', {
          expression: 'document.fonts ? document.fonts.ready.then(() => true) : true',
          awaitPromise: true
        }).catch(() => {});

        // If product details, ensure content is rendered
        if (routeName === 'product-details') {
          for (let i = 0; i < 20; i++) {
            const check = await sendCDP(ws, 'Runtime.evaluate', {
              expression: 'Boolean(document.querySelector(".catalog-detail") && !document.querySelector(".public-state"))'
            }).catch(() => ({}));
            if (check?.result?.value) break;
            await sleep(200);
          }
        }

        await sleep(500);

        // Get full layout metrics
        const metrics = await sendCDP(ws, 'Page.getLayoutMetrics');
        const content = metrics.contentSize || metrics.cssContentSize || { height: 1080 };
        const fullHeight = Math.max(800, Math.ceil(content.height));

        // Override height to full page height
        await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
          width: width,
          height: fullHeight,
          deviceScaleFactor: 1,
          mobile: isMobile
        });

        await sleep(400);

        const shot = await sendCDP(ws, 'Page.captureScreenshot', {
          fromSurface: true
        });

        const buf = Buffer.from(shot.data, 'base64');
        fs.writeFileSync(filePath, buf);
        console.log(`[${current}/${total}] Full-page ${filename} (${width}x${fullHeight}) -> ${buf.length} bytes`);
      }
    }

    ws.close();
    console.log('All 45 full-page baseline screenshots captured successfully!');
  } catch (err) {
    console.error('Error during full-page baseline capture:', err);
  } finally {
    browserProc.kill();
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  }
}

run();
