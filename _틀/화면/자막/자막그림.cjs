// 자막/줄.json → 줄마다 투명 PNG(4K). 위치: 위 862(귀 높이) · 화면 정가운데(960) · 짧은 줄이라 얼굴 원(가로 342까지)에 안 닿음(362~1558 검사).
// 모양은 지난 영상과 같게(검은 반투명 띠 · 흰 굵은 글씨 · 숫자 노랑). 폭이 1440 넘으면 «넘침»으로 알림.
const fs = require('fs');
let _u = __dirname; while (!fs.existsSync(_u + '/_공용/경로.cjs') && require('path').dirname(_u) !== _u) _u = require('path').dirname(_u);
const { chromium } = require(_u + '/_공용/경로.cjs').플레이라이트(__dirname);
const 여기 = __dirname.split(String.fromCharCode(92)).join('/');
const 줄 = JSON.parse(fs.readFileSync(여기 + '/줄.json', 'utf8'));
const 곳 = 여기 + '/그림'; fs.mkdirSync(곳, { recursive: true });
const e = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const 강조 = (s) => e(s).replace(/\{r:([^}]*)\}/g, '<b class="r">$1</b>').replace(/\{y:([^}]*)\}/g, '<b class="y">$1</b>'); // 11/7 대표: 특별한 곳만 빨강·노랑
const css = `*{box-sizing:border-box}html,body{margin:0;background:transparent}body{width:1920px;height:150px;position:relative;font-family:"Pretendard Variable",sans-serif}
#s{position:absolute;left:0;width:1920px;top:20px;text-align:center;line-height:1.3;font-size:50px;white-space:nowrap}
#s span{display:inline-block;letter-spacing:-.5px;color:#fff;font-weight:700;background:rgba(0,0,0,.78);padding:12px 28px;border-radius:18px}
#s b{font-weight:800}#s b.r{color:#ff4d5a}#s b.y{color:#ffe14d}`;
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1920, height: 150 }, deviceScaleFactor: 2 });
  fs.writeFileSync(여기 + '/_자막판.html', `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><link rel="stylesheet" href="../../../_공용/글꼴/pretendardvariable-dynamic-subset.css"><style>${css}</style></head><body><div id="s"><span></span></div></body></html>`);
  await p.goto('file:///' + 여기 + '/_자막판.html');
  await p.evaluate(async (t) => { document.querySelector('#s span').textContent = t; await document.fonts.ready; }, [...new Set(줄.map((c) => c.글).join(''))].join('').replace(/[{}]/g,''));
  const 폭검사 = await p.evaluate(() => { const c = document.createElement('canvas').getContext('2d'); c.font = '700 50px "Pretendard Variable"'; const a = c.measureText('광고 계정 사기').width; c.font = '700 50px "Malgun Gothic"'; return [a, c.measureText('광고 계정 사기').width]; });
  const 넘침 = [];
  for (let i = 0; i < 줄.length; i++) {
    await p.evaluate((h) => { document.querySelector('#s span').innerHTML = h; }, 강조(줄[i].글));
    const r = await p.evaluate(() => { const b = document.querySelector('#s span').getBoundingClientRect(); return [b.left, b.right]; });
    if (r[0] < 362 || r[1] > 1558) 넘침.push([i, Math.round(r[0]), Math.round(r[1]), 줄[i].글]);
    await p.screenshot({ path: `${곳}/${String(i).padStart(4, '0')}.png`, omitBackground: true });
  }
  await p.evaluate(() => { document.querySelector('#s').style.display = 'none'; });
  await p.screenshot({ path: 곳 + '/빈칸.png', omitBackground: true });
  await b.close();
  console.log('줄', 줄.length, '· 글꼴 폭(프리텐다드 vs 맑은고딕)', 폭검사.map(Math.round), '· 넘침', 넘침.length, JSON.stringify(넘침));
})();
