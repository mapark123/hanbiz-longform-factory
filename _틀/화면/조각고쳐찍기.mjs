// 고친 장면이 걸친 12초 조각만 다시 찍고, 나머지는 기존 찍은것/뒷화면.mp4 에서 그대로(재압축 없이) 잘라 이어 붙인다.
// 사용: node 조각고쳐찍기.mjs 8,21,38 [--동시 12]   (장면 번호) → 찍은것/뒷화면.mp4 를 새것으로 바꾸고 옛것은 _아카이브_보관함 으로
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
const 여기 = path.dirname(fileURLToPath(import.meta.url)).split(path.sep).join('/');
let _u = 여기; while (!fs.existsSync(`${_u}/_공용/경로.cjs`) && path.dirname(_u) !== _u) _u = path.dirname(_u);
const 경로 = createRequire(import.meta.url)(`${_u}/_공용/경로.cjs`);
const 장면들 = process.argv[2].split(',').map(Number);
const 동시 = process.argv.includes('--동시') ? +process.argv[process.argv.indexOf('--동시') + 1] : 12;
const 데이터 = fs.readFileSync(`${여기}/데이터.js`, 'utf8');
const 창 = {}; new Function('window', 데이터)(창); const 배치 = 창.배치; // 데이터.js 는 줄 끝이 \r\n 이라 정규식 대신 그대로 실행
const 총 = 경로.설정(여기).길이, 조각초 = 12, 개수 = Math.ceil(총 / 조각초);
const 고칠 = new Set();
for (const n of 장면들) { const s = 배치.find((x) => x.번호 === n); for (let k = Math.floor((s.t0 - .5) / 조각초); k <= Math.floor((s.t1 + .5) / 조각초); k++) if (k >= 0 && k < 개수) 고칠.add(k); }
const 목록 = [...고칠].sort((a, b) => a - b);
console.log('다시 찍을 조각', 목록.join(','));
const 곳 = `${여기}/찍은것/_고침`; fs.mkdirSync(곳, { recursive: true });
const t0 = Date.now(); let 다음 = 0, 실패 = [];
const 일꾼 = async () => {
  while (다음 < 목록.length) {
    const k = 목록[다음++]; const a = k * 조각초, b = Math.min(총, (k + 1) * 조각초);
    await new Promise((ok) => {
      const c = spawn('node', [`${여기}/찍기.mjs`, '뒷화면', '--구간', `${a},${b}`, '--출력', `${곳}/${String(k).padStart(4, '0')}.mp4`, '--일꾼', '1', '--4k'], { stdio: ['ignore', 'pipe', 'pipe'] });
      let 글 = ''; c.stdout.on('data', (d) => (글 += d)); c.stderr.on('data', (d) => (글 += d));
      c.on('close', (code) => { if (code !== 0) 실패.push([k, 글.slice(-300)]); console.log(`조각 ${k} 끝 · ${Math.round((Date.now() - t0) / 1000)}초`); ok(); });
    });
  }
};
await Promise.all([...Array(동시).keys()].map(() => 일꾼()));
if (실패.length) { console.log('실패', JSON.stringify(실패)); process.exit(1); }
const 옛 = `${여기}/찍은것/뒷화면.mp4`;
const 줄 = [];
for (let k = 0; k < 개수; k++) {
  if (고칠.has(k)) 줄.push(`file '${곳}/${String(k).padStart(4, '0')}.mp4'`);
  else { 줄.push(`file '${옛}'`, `inpoint ${k * 조각초}`, `outpoint ${Math.min(총 + .1, (k + 1) * 조각초)}`); }
}
fs.writeFileSync(`${곳}/목록.txt`, 줄.join('\n'));
const 새 = `${여기}/찍은것/뒷화면_새.mp4`;
const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${곳}/목록.txt`, '-c', 'copy', '-movflags', '+faststart', 새]);
if (r.status !== 0) { console.log('잇기 실패', String(r.stderr).slice(-400)); process.exit(1); }
const 보관 = `${여기}/_아카이브_보관함/${new Date().toISOString().slice(0, 10)}`; fs.mkdirSync(보관, { recursive: true });
fs.renameSync(옛, `${보관}/뒷화면_고치기전_${Date.now()}.mp4`); fs.renameSync(새, 옛);
console.log(`끝 · ${Math.round((Date.now() - t0) / 1000)}초 · ${옛}`);
