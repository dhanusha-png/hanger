const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

const port = 9777;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-fp-'));

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
    }, 15000);

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

    console.log('Navigating to http://localhost:5173/ ...');
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(2500);

    // Get full layout metrics
    const metrics = await sendCDP(ws, 'Page.getLayoutMetrics');
    console.log('Metrics:', metrics.contentSize || metrics.cssContentSize);
    const content = metrics.contentSize || metrics.cssContentSize;
    const w = 1920;
    const h = Math.ceil(content.height);

    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sleep(1000);

    const shot = await sendCDP(ws, 'Page.captureScreenshot', {
      fromSurface: true
    });

    const buf = Buffer.from(shot.data, 'base64');
    const outPath = path.resolve('scratch/test_full_home.png');
    fs.writeFileSync(outPath, buf);
    console.log(`Saved ${outPath} (${w}x${h}, ${buf.length} bytes)`);

    ws.close();
  } catch (err) {
    console.error('Error in run:', err);
  } finally {
    browserProc.kill();
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  }
}

run();
