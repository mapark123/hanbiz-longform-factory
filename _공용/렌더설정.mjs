// 영상 찍기 공용 설정 (2026-11-04) — 그래픽카드로 화면을 그리고(크롬) 그래픽카드로 묶는다(NVENC).
// 그래픽카드가 없거나 안 되는 PC 에서는 멈추지 않고 CPU 고화질로 내려가며, 어느 쪽으로 돌았는지 찍어 준다.
// 비교 측정 결과: _공용/_GPU렌더_측정_1104.md
import { spawnSync } from 'node:child_process';

const GPU옵션 = ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'];

const 렌더러읽기 = () => {
  const g = document.createElement('canvas').getContext('webgl2');
  if (!g) return '없음';
  const e = g.getExtension('WEBGL_debug_renderer_info');
  return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER);
};

// 설치된 크롬(새 방식 headless)이 가장 빠르다. 없으면 플레이라이트 기본 브라우저로 내려간다.
export async function 브라우저열기(chromium, 추가옵션 = {}) {
  const 추가인자 = 추가옵션.args || [];
  const 차례 = [{ channel: 'chrome', args: [...GPU옵션, ...추가인자] }, { args: [...GPU옵션, ...추가인자] }, { args: 추가인자 }];
  let 마지막오류;
  for (const 옵션 of 차례) {
    let b;
    try {
      b = await chromium.launch({ ...추가옵션, ...옵션 });
      const 시험 = await b.newPage();
      const 렌더러 = await 시험.evaluate(렌더러읽기);
      await 시험.close();
      const 소프트웨어 = /swiftshader|llvmpipe|없음/i.test(렌더러);
      if (소프트웨어 && 옵션 !== 차례[차례.length - 1]) { await b.close(); continue; }
      console.log(`[화면] ${소프트웨어 ? 'CPU' : 'GPU'} · ${렌더러}`);
      return b;
    } catch (e) { 마지막오류 = e; if (b) await b.close().catch(() => {}); }
  }
  throw 마지막오류;
}

// 찍는 한 장의 화질. PNG 는 6배 느린데 화질 차이가 거의 없어 JPEG 100 을 쓴다.
export const JPEG화질 = 100;

const 코덱됨 = (코덱) => spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=black:s=256x256:d=0.1:r=5', '-c:v', 코덱, '-f', 'null', '-']).status === 0;
let NVENC됨;
function NVENC확인() {
  if (process.env.렌더CPU === '1') return false; // 문제가 생겼을 때 CPU 로 강제하는 스위치
  if (NVENC됨 === undefined) NVENC됨 = 코덱됨('h264_nvenc');
  return NVENC됨;
}
let AMF됨;
function AMF확인() {
  if (process.env.렌더CPU === '1') return false;
  if (AMF됨 === undefined) AMF됨 = 코덱됨('h264_amf');
  return AMF됨;
}

// 색 표시까지 표준(bt709)으로 맞춘다. 전에는 PC 범위·옛 표준(bt601)으로 나가고 있었다.
const 색옵션 = ['-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];

// ffmpeg 영상 인코딩 옵션 묶음. '-c:v libx264 ... -pix_fmt yuv420p' 자리에 그대로 넣는다.
export function 영상옵션() {
  if (NVENC확인()) {
    console.log('[묶기] GPU · NVENC h264 p7 cq18');
    return ['-c:v', 'h264_nvenc', '-preset', 'p7', '-tune', 'hq', '-rc', 'vbr', '-cq', '18', '-b:v', '0',
      '-multipass', 'fullres', '-rc-lookahead', '32', '-spatial-aq', '1', '-temporal-aq', '1', '-aq-strength', '8',
      '-bf', '3', '-b_ref_mode', 'middle', ...색옵션];
  }
  if (AMF확인()) {
    console.log('[묶기] GPU · AMF h264 quality cqp16');
    return ['-c:v', 'h264_amf', '-usage', 'transcoding', '-quality', 'quality', '-rc', 'cqp', '-qp_i', '16', '-qp_p', '16', '-qp_b', '16', ...색옵션];
  }
  console.log('[묶기] CPU · x264 slow crf16');
  // 10/19 렌더 중 PC 가 꺼진 일이 있어 CPU 는 4스레드로 묶는다 · 풀려면 환경변수 렌더스레드=0
  return ['-c:v', 'libx264', '-threads', process.env.렌더스레드 ?? '4', '-preset', 'slow', '-crf', '16', ...색옵션];
}
