// 用 CDP 驱动 Chromium，验证页面在 http:// 与 file:// 下的真实渲染结果
const { spawn } = require('node:child_process');
const http = require('node:http');

const CHROMIUM = '/usr/bin/chromium';
const PORT = 9333;
const pages = process.argv.slice(2);

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

async function main() {
  const proc = spawn(CHROMIUM, [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=/tmp/cdp-profile-' + Date.now(),
    'about:blank'
  ], { stdio: 'ignore' });

  // 等待调试端口就绪
  let targets;
  for (let i = 0; i < 50; i++) {
    try { targets = await getJSON('http://127.0.0.1:' + PORT + '/json/list'); break; }
    catch (e) { await wait(200); }
  }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let seq = 0;
  const pending = new Map();
  const errors = [];
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push('EXCEPTION: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
    } else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      errors.push('LOG: ' + msg.params.entry.text);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  const MARKERS = `JSON.stringify({
    sidebar: document.querySelectorAll('#sidebar .side-chapters a').length,
    offcanvas: !!document.getElementById('sidebar-offcanvas'),
    topbar: !!document.querySelector('.mobile-topbar'),
    header: !!document.querySelector('.chapter-header'),
    codeblocks: document.querySelectorAll('.codeblock').length,
    toc: !!document.querySelector('.toc'),
    footer: (document.getElementById('site-footer')?.innerHTML || '').length,
    h1: (document.querySelector('#main h1') || {}).textContent || '',
    pager: document.querySelectorAll('.pager a').length
  })`;

  for (const url of pages) {
    errors.length = 0;
    await send('Page.navigate', { url });
    await wait(1200); // 等加载 + 脚本执行
    const r = await send('Runtime.evaluate', { expression: MARKERS, returnByValue: true });
    console.log('URL:', url);
    console.log('  ', r.result.value);
    if (errors.length) console.log('  错误:', errors.join(' | '));
    else console.log('  错误: 无');
  }

  ws.close();
  proc.kill('SIGKILL');
  process.exit(0);
}

main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
