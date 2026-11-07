// 장면 HTML 을 가상 시계로 찍는다 (120장 → 60프레임). USB 쓰기 금지 기간이라 결과는 D 화면/찍은것/ 에 둔다.
// 미리보기: node 찍기.mjs 장면01 --미리 3,12,40    전체: node 찍기.mjs 장면01
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { fileURLToPath, pathToFileURL } from 'node:url';
const 여기 = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).join('/');
let _u = 여기; while (!fs.existsSync(`${_u}/_공용/경로.cjs`) && path.dirname(_u) !== _u) _u = path.dirname(_u);
const 경로 = createRequire(import.meta.url)(`${_u}/_공용/경로.cjs`);
const { chromium } = 경로.플레이라이트(여기);
const { 브라우저열기, JPEG화질, 영상옵션 } = await import(pathToFileURL(`${_u}/_공용/렌더설정.mjs`).href);
const 이름 = process.argv[2];
const 배율 = process.argv.includes('--4k') ? 2 : 1;
const 미리 = process.argv.includes('--미리') ? process.argv[process.argv.indexOf('--미리') + 1].split(',').map(Number) : null;
const b = await 브라우저열기(chromium, { args: [`--force-device-scale-factor=${배율}`, '--allow-file-access-from-files'] });
const page = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 배율 });
const 오류 = []; page.on('pageerror', (e) => 오류.push(e.message));
await page.goto(`file:///${여기}/${이름}.html`);
await page.waitForFunction(() => window.__준비, null, { timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
console.log('[글꼴]', JSON.stringify(await page.evaluate(() => { const 불림 = [...document.fonts].filter((f) => f.status === 'loaded' && /Pretendard/.test(f.family)).length; const c = document.createElement('canvas').getContext('2d'); c.font = '40px "Pretendard Variable"'; const a = c.measureText('김민수 상담 Regular').width; c.font = '40px "Malgun Gothic"'; return { 불림, 프리텐다드폭: a, 맑은고딕폭: c.measureText('김민수 상담 Regular').width }; })));
const cdp = await page.context().newCDPSession(page);
const 찍 = async () => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: JPEG화질 })).data, 'base64');
if (미리) {
  const 곳 = `${여기}/_미리/${이름}`; fs.mkdirSync(곳, { recursive: true });
  for (const s of 미리) { await page.evaluate((ms) => window.__frame(ms), s * 1000); await page.waitForTimeout(40); fs.writeFileSync(`${곳}/${String(Math.round(s * 10)).padStart(5, '0')}.jpg`, await 찍()); }
  console.log('미리 끝', JSON.stringify(오류)); await b.close(); process.exit(0);
}
const 전체길이 = await page.evaluate(() => window.__길이) / 1000;
const 구간 = process.argv.includes('--구간') ? process.argv[process.argv.indexOf('--구간') + 1].split(',').map(Number) : [0, 전체길이];
const 일꾼수 = process.argv.includes('--일꾼') ? +process.argv[process.argv.indexOf('--일꾼') + 1] : Math.max(1, Math.min(16, Math.floor(os.cpus().length / 2)));
const 곳 = `${여기}/찍은것`; fs.mkdirSync(곳, { recursive: true });
const 결과 = process.argv.includes('--출력') ? process.argv[process.argv.indexOf('--출력') + 1] : `${곳}/${이름}${process.argv.includes('--구간') ? '_시험' : ''}.mp4`;
const 찍는 = 120, 내는 = 60;
const 옵션 = [...영상옵션()]; const vf = 옵션.indexOf('-vf'); 옵션[vf + 1] = `tmix=frames=2:weights='1 1',fps=${내는},` + 옵션[vf + 1];
// 4K 는 프로세스마다 메모리가 크다(11/5 14개 동시에 커밋 98%). 미리보기 버퍼와 스레드를 줄인다
if (배율 === 2) { const i = 옵션.indexOf('-rc-lookahead'); if (i >= 0) 옵션[i + 1] = '4'; const m = 옵션.indexOf('-multipass'); if (m >= 0) 옵션[m + 1] = 'disabled'; 옵션.push('-threads', '2'); }
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-filter_threads', '1', '-filter_complex_threads', '1', '-threads', '2', '-f', 'image2pipe', '-framerate', String(찍는), '-c:v', 'mjpeg', '-i', '-', ...옵션, '-r', String(내는), 결과], { stdio: ['pipe', 'inherit', 'inherit'] });
ff.stdin.on('error', () => {});
const 첫 = Math.round(구간[0] * 찍는), 장수 = Math.round((구간[1] - 구간[0]) * 찍는); const t0 = Date.now();
// 일꾼마다 브라우저 하나. 다 찍은 장은 순서대로 ffmpeg 로 보낸다(이어 붙이는 자국이 생기지 않는다)
const 대기 = new Map(); let 보낼 = 0, 줄 = 0, 실패 = null;
let 기다림 = []; const 깨우기 = () => { const w = 기다림; 기다림 = []; w.forEach((f) => f()); };
const 최대대기 = 일꾼수 * 6;
const 일꾼 = async (번호) => {
  const br = 번호 === 0 ? b : await 브라우저열기(chromium, { args: [`--force-device-scale-factor=${배율}`, '--allow-file-access-from-files'] });
  const pg = 번호 === 0 ? page : await br.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 배율 });
  if (번호 !== 0) { pg.on('pageerror', (e) => 오류.push(e.message)); await pg.goto(`file:///${여기}/${이름}.html`); await pg.waitForFunction(() => window.__준비, null, { timeout: 60000 }); await pg.evaluate(() => document.fonts.ready); }
  const c = 번호 === 0 ? cdp : await pg.context().newCDPSession(pg);
  while (true) {
    if (실패) return;
    const i = 줄++;
    if (i >= 장수) break;
    while (i - 보낼 > 최대대기) await new Promise((ok) => 기다림.push(ok));
    await pg.evaluate((ms) => window.__frame(ms), ((첫 + i) * 1000) / 찍는);
    const 그림 = Buffer.from((await c.send('Page.captureScreenshot', { format: 'jpeg', quality: JPEG화질 })).data, 'base64');
    대기.set(i, 그림);
    while (대기.has(보낼)) {
      const 조각 = 대기.get(보낼); 대기.delete(보낼); 보낼++;
      if (!ff.stdin.write(조각)) await new Promise((ok) => ff.stdin.once('drain', ok));
      if (보낼 % 2400 === 0) console.log(`${보낼}/${장수} · ${Math.round((Date.now() - t0) / 1000)}초`);
    }
    깨우기();
  }
  if (번호 !== 0) await br.close();
};
await Promise.all([...Array(일꾼수).keys()].map((n) => 일꾼(n).catch((e) => { 실패 = e; 깨우기(); })));
ff.stdin.end();
await new Promise((ok, no) => ff.on('close', (c) => (c === 0 ? ok() : no(new Error('ffmpeg ' + c)))));
if (실패) throw 실패;
const 초 = (Date.now() - t0) / 1000;
console.log(`끝 ${결과} · 일꾼 ${일꾼수} · ${장수}장 · ${Math.round(초)}초 · 초당 ${(장수 / 초).toFixed(1)}장 · 영상 1초당 ${(초 / (장수 / 찍는)).toFixed(2)}초 · 오류 ${JSON.stringify(오류)}`);
await b.close();
