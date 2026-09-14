// 给页面拍一张整页截图（无头 Chromium），用于人工目检版式。
//
// 用法：node tools/verify/cdp-shot.js "<url>" "<输出.png>" [宽] [高]
//   例：node tools/verify/cdp-shot.js "file:///…/site/basics/03-html-lists-links.html" \
//         /tmp/basics03.png 1280 900
//   只想看某一小块时，用环境变量 CLIP="x,y,w,h" 截取该区域（配合 captureBeyondViewport）。
//   想拍「悬停态」时用环境变量 HOVER_SELECTOR="选择器"：截图前给命中的元素强制加上 :hover，
//   等过渡结束后再拍（用于验证悬停动效，真实鼠标不方便自动化）。
const { spawn } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');

const CHROMIUM = '/usr/bin/chromium';
const PORT = 9335;
const [url, out, wArg, hArg] = process.argv.slice(2);
const WIDTH = Number(wArg) || 1280;
const HEIGHT = Number(hArg) || 900;

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function getJSON(u) {
  return new Promise((resolve, reject) => {
    http.get(u, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

async function main() {
  if (!url || !out) { console.error('用法：node tools/verify/cdp-shot.js <url> <out.png> [宽] [高]'); process.exit(2); }

  const proc = spawn(CHROMIUM, [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=' + WIDTH + ',' + HEIGHT,
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=/tmp/cdp-shot-' + Date.now(),
    'about:blank'
  ], { stdio: 'ignore' });

  let targets;
  for (let i = 0; i < 50; i++) {
    try { targets = await getJSON('http://127.0.0.1:' + PORT + '/json/list'); break; }
    catch (e) { await wait(200); }
  }
  const page = targets && targets.find(t => t.type === 'page');
  if (!page) throw new Error('调试端口未就绪');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let seq = 0;
  const pending = new Map();
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false
  });
  await send('Page.navigate', { url });
  await wait(1800);

  if (process.env.HOVER_SELECTOR) {
    await send('DOM.enable');
    await send('CSS.enable');
    const doc = await send('DOM.getDocument', { depth: -1 });
    const found = await send('DOM.querySelectorAll', {
      nodeId: doc.root.nodeId, selector: process.env.HOVER_SELECTOR
    });
    for (const nodeId of found.nodeIds) {
      await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] });
    }
    await wait(600);   // 留出过渡动画的时间
  }

  const shot = await send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    ...(process.env.CLIP ? { clip: (() => {
      const [x, y, width, height] = process.env.CLIP.split(',').map(Number);
      return { x, y, width, height, scale: 1 };
    })() } : {})
  });
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log('已保存截图：' + out);

  ws.close();
  proc.kill('SIGKILL');
  process.exit(0);
}

main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
