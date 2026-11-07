// 장면을 프로세스 여러 개로 나눠 찍고 이어 붙인다. CPU·GPU 를 끝까지 쓰는 찍기.
// 사용: node 전부찍기.mjs 장면01 [장면02 ...] [--동시 14]
// 조각마다 node + 브라우저 + ffmpeg(NVENC) 한 벌. 조각 경계는 프레임 단위로 딱 맞춘다. NVENC 는 8개까지만 동시에 쓰고 나머지는 CPU 인코더.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
const 여기 = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).join('/');
let _u = 여기; while (!fs.existsSync(`${_u}/_공용/경로.cjs`) && path.dirname(_u) !== _u) _u = path.dirname(_u);
const 경로 = createRequire(import.meta.url)(`${_u}/_공용/경로.cjs`);

const 인자 = process.argv.slice(2);
const i동시 = 인자.indexOf('--동시');
const 동시 = i동시 >= 0 ? +인자[i동시 + 1] : Math.max(2, os.cpus().length - 2);
const 장면들 = 인자.filter((a, i) => !a.startsWith('--') && i !== i동시 + 1);
const 조각초 = 12;
const 할일 = [];
for (const 이름 of 장면들) {
  const html = fs.readFileSync(`${여기}/${이름}.html`, 'utf8');
  const m = html.match(/시작\s*=\s*([\d.]+)\s*,\s*끝\s*=\s*([\d.]+)/) ?? [0, 0, 경로.설정(여기).길이]; // 뒷화면.html 은 설정.json 길이
  if (!m) throw new Error(이름 + ': const 시작=..,끝=.. 을 못 찾음');
  const 길이 = +m[2] - +m[1];
  const 곳 = `${여기}/찍은것/_조각/${이름}`; fs.rmSync(곳, { recursive: true, force: true }); fs.mkdirSync(곳, { recursive: true });
  const 개수 = Math.ceil(길이 / 조각초);
  for (let k = 0; k < 개수; k++) 할일.push({ 이름, k, a: k * 조각초, b: Math.min(길이, (k + 1) * 조각초), 곳 });
}
console.log(`장면 ${장면들.length} · 조각 ${할일.length} · 동시 ${동시}`);
const t0 = Date.now(); let 끝난 = 0, 다음 = 0, 실패 = [];
const 일꾼 = async () => {
  while (다음 < 할일.length) {
    // 메모리 지킴이: 쓸 수 있는 메모리가 8GB 아래면 새 조각을 시작하지 않고 기다린다
    while (os.freemem() < 8 * 2 ** 30) await new Promise((ok) => setTimeout(ok, 3000));
    if (다음 >= 할일.length) break;
    const j = 할일[다음++];
    await new Promise((ok) => {
      const c = spawn('node', [`${여기}/찍기.mjs`, j.이름, '--구간', `${j.a},${j.b}`, '--출력', `${j.곳}/${String(j.k).padStart(4, '0')}.mp4`, '--일꾼', '1', '--4k'], { stdio: ['ignore', 'pipe', 'pipe'] });
      let 글 = ''; c.stdout.on('data', (d) => (글 += d)); c.stderr.on('data', (d) => (글 += d));
      c.on('close', (code) => { 끝난++; if (code !== 0) { 실패.push([j.이름, j.k, 글.slice(-300)]); } if (끝난 % 10 === 0 || 끝난 === 할일.length) console.log(`${끝난}/${할일.length} · ${Math.round((Date.now() - t0) / 1000)}초`); ok(); });
    });
  }
};
await Promise.all([...Array(동시).keys()].map(() => 일꾼()));
if (실패.length) { console.log('실패', JSON.stringify(실패)); process.exit(1); }
for (const 이름 of 장면들) {
  const 곳 = `${여기}/찍은것/_조각/${이름}`;
  const 목록 = fs.readdirSync(곳).filter((f) => f.endsWith('.mp4')).sort().map((f) => `file '${곳}/${f}'`).join('\n');
  fs.writeFileSync(`${곳}/목록.txt`, 목록);
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${곳}/목록.txt`, '-c', 'copy', '-movflags', '+faststart', `${여기}/찍은것/${이름}.mp4`]);
  if (r.status !== 0) { console.log('잇기 실패', 이름, String(r.stderr).slice(-300)); process.exit(1); }
  fs.rmSync(곳, { recursive: true, force: true });
}
console.log(`끝 · ${Math.round((Date.now() - t0) / 1000)}초`);
