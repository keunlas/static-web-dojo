// 在无头 Chromium 中打开一个页面，逐条执行传入的表达式并打印结果。
// 用途：演示断言（读计算样式、查 DOM、点按钮后再读值），配合 skills/verify-offline 使用。
//
// 用法：
//   node tools/verify/cdp-eval.js "<url>" "<表达式1>" ["<表达式2>" ...]
//   例：node tools/verify/cdp-eval.js "http://127.0.0.1:8899/basics/02-html-text.html" \
//         "getComputedStyle(document.querySelector('#main mark')).backgroundColor"
//
// 说明：表达式在页面上下文求值，返回值一律 JSON 化后打印；
// 页面里抛出的异常与 console.error 也会打印出来（errors 字段）。
// 视口默认为 1280×900，可用环境变量 VIEWPORT=宽x高 覆盖（如 VIEWPORT=1600x900，
// 用于检查 ≥1600px 才出现的右侧目录）。
const { spawn } = require('node:child_process');
const http = require('node:http');

const CHROMIUM = '/usr/bin/chromium';
const PORT = 9334;
const [url, ...exprs] = process.argv.slice(2);

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
  if (!url) { console.error('用法：node tools/verify/cdp-eval.js <url> <表达式> [...]'); process.exit(2); }

  const proc = spawn(CHROMIUM, [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=/tmp/cdp-eval-' + Date.now(),
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

  const vp = (process.env.VIEWPORT || '1280x900').split('x').map(Number);
  await send('Emulation.setDeviceMetricsOverride', {
    width: vp[0] || 1280, height: vp[1] || 900, deviceScaleFactor: 1, mobile: false
  });
  // 无头浏览器默认“窗口没有焦点”：focus() / click() 不会派发聚焦事件、:focus 样式也不生效。
  // 打开焦点模拟后，页面里的聚焦行为才与真实用户一致（否则会误判成页面 bug）。
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await send('Page.navigate', { url });
  await wait(1500);

  console.log('URL:', url);
  for (const expr of exprs) {
    const r = await send('Runtime.evaluate', {
      expression: expr, returnByValue: true, awaitPromise: true
    });
    const v = r.exceptionDetails
      ? '✘ ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)
      : JSON.stringify(r.result.value);
    console.log('  ' + expr + '\n    → ' + v);
  }
  console.log('  errors:', errors.length ? errors.join(' | ') : '无');

  ws.close();
  proc.kill('SIGKILL');
  process.exit(0);
}

main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
