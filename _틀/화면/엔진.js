// 롱폼 뒷 화면 엔진 (메타사기 4가지 11/7 에서 다듬음). 모든 그림은 시각 t(설정.json «기준영상» 초)만으로 정한다 — 조각으로 나눠 찍어도 같은 그림.
// 얼굴 원 자리(메타사기: 왼쪽 아래 1920 기준 가로 22~342 · 세로 738~1058)와 자막 띠는 비운다. 그림 중심 C — 얼굴 위치가 다르면 C 를 옮긴다.
const W = 1920, H = 1080, C = { x: 1110, y: 468 };
const 무대 = document.getElementById('무대');
const mk = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (parent || 무대).appendChild(e); return e; };
const 박스 = (cls, w, h, parent, html) => { const e = mk('div', cls, parent, html); Object.assign(e.style, { position: 'absolute', left: '0', top: '0', width: w + 'px', height: h + 'px' }); e.dataset.w = w; e.dataset.h = h; return e; };
const 보임 = (e, o) => { o = Math.max(0, Math.min(1, o)); e.style.opacity = o.toFixed(4); e.style.visibility = o <= 0.002 ? 'hidden' : 'visible'; };
const 놓기 = (e, x, y, s = 1, r = 0, o) => { const w = +e.dataset.w, h = +e.dataset.h; e.style.transform = `translate(${(x - w / 2).toFixed(2)}px,${(y - h / 2).toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(4)})`; if (o !== undefined) 보임(e, o); };
const 인 = (t, a, d = .45) => soft(a, a + d, t);
const 아웃 = (t, b, d = .35) => 1 - soft(b - d, b, t);
const 창 = (t, a, b, fi = .4, fo = .35) => 인(t, a, fi) * 아웃(t, b, fo);
const 흐림 = (e, px) => { e.style.filter = px > .05 ? `blur(${px.toFixed(2)}px)` : 'none'; };
const 낱말 = (말, 뒤 = 0) => { for (const [w, a] of window.단어) if (a >= 뒤 - .3 && w.replace(/\s/g, '').includes(말)) return a; return null; };
const 쉼 = (x) => Math.sin(x); // 살아 있는 카메라용
const 숫자 = (n) => Math.round(n).toLocaleString('ko-KR');

/* ── 아이콘 (SVG 선) ── */
const I = {
  카드: '<rect x="3" y="6" width="26" height="18" rx="3"/><path d="M3 11h26M7 19h6"/>',
  자물쇠: '<rect x="6" y="14" width="20" height="14" rx="3"/><path d="M10 14v-4a6 6 0 0 1 12 0v4"/><circle cx="16" cy="21" r="2"/>',
  신분증: '<rect x="3" y="7" width="26" height="18" rx="3"/><circle cx="11" cy="15" r="3"/><path d="M6.5 21.5c1-2.300 2.700-3.500 4.500-3.500s3.500 1.200 4.500 3.500M19 13h6M19 17h6M19 21h4"/>',
  비행기: '<path d="M29 3 3 14l10 3 3 10 13-24z"/><path d="M13 17l16-14"/>',
  방패: '<path d="M16 3 5 7v8c0 7 4.700 12 11 14 6.300-2 11-7 11-14V7L16 3z"/>',
  체크: '<path d="M7 16.500l6 6 12-13"/>',
  엑스: '<path d="M8 8l16 16M24 8 8 24"/>',
  돋보기: '<circle cx="14" cy="14" r="8"/><path d="M20 20l7 7"/>',
  시계: '<circle cx="16" cy="16" r="12"/><path d="M16 9v7l5 3"/>',
  전화: '<path d="M8 4h5l2 6-3 2a15 15 0 0 0 8 8l2-3 6 2v5a2 2 0 0 1-2 2A22 22 0 0 1 6 6a2 2 0 0 1 2-2z"/>',
  메일: '<rect x="3" y="7" width="26" height="18" rx="3"/><path d="M4 9l12 9 12-9"/>',
  경고: '<path d="M16 4 2 28h28L16 4z"/><path d="M16 13v7M16 24v.5"/>',
  사람: '<circle cx="16" cy="11" r="5"/><path d="M6 28c1-6 5-9 10-9s9 3 10 9"/>',
  금고: '<rect x="4" y="5" width="24" height="22" rx="3"/><circle cx="17" cy="16" r="5"/><path d="M17 11v2M17 19v2M12 16h2M20 16h2M8 10v12"/>',
  달력: '<rect x="4" y="6" width="24" height="22" rx="3"/><path d="M4 12h24M10 3v6M22 3v6"/>',
  간판: '<rect x="4" y="9" width="24" height="12" rx="2"/><path d="M10 9 16 3l6 6M8 21v7M24 21v7"/>',
  저울: '<path d="M16 4v24M8 28h16M5 9h22M9 9l-4 9h8l-4-9zM23 9l-4 9h8l-4-9z"/>',
  종이: '<path d="M8 3h11l6 6v20H8z"/><path d="M19 3v6h6M12 15h9M12 19h9M12 23h6"/>',
  종: '<path d="M8 22V14a8 8 0 0 1 16 0v8l2 3H6l2-3z"/><path d="M13 27a3 3 0 0 0 6 0"/>',
  재생: '<rect x="3" y="7" width="26" height="18" rx="5"/><path d="M14 12v8l6-4-6-4z"/>',
  링크: '<path d="M13 19l6-6M10 15l-3 3a4.500 4.500 0 0 0 6.400 6.400l3-3M22 17l3-3a4.500 4.500 0 0 0-6.400-6.400l-3 3"/>',
  돈: '<circle cx="16" cy="16" r="12"/><path d="M12 11l4 6 4-6M11 17h10M11 20.500h10M16 17v7"/>',
  지구: '<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c4 4 4 20 0 24M16 4c-4 4-4 20 0 24"/>',
  빈칸: '<rect x="5" y="5" width="22" height="22" rx="4"/>',
  업로드: '<path d="M16 22V7M10 13l6-6 6 6M6 25h20"/>',
};
const 아이콘 = (이름, 크기 = 64, 색 = '#fff', 굵기 = 2.2) => `<svg width="${크기}" height="${크기}" viewBox="0 0 32 32" fill="none" stroke="${색}" stroke-width="${굵기}" stroke-linecap="round" stroke-linejoin="round">${I[이름]}</svg>`;

/* ── 배경: 밤(사기 장면) ↔ 낮(해결·정리). 장마다 은은한 색 ── */
const 배경 = (() => {
  const 판 = mk('div', '배경판');
  const 낮 = mk('div', '배경낮', 판);
  const 빛 = [0, 1, 2].map(() => mk('div', '배경빛', 판));
  const 잡음 = mk('div', '잡음', 판);
  const 테 = mk('div', '테두리그늘', 판);
  // 장 구간과 색 (시각은 배치도 장면 경계)
  // 장 구간·색·밝기(낮=1 밝은 화면) = 설정.json «장» → 데이터.js 의 window.장
  const 구간 = window.장;
  return (t) => {
    let i = 구간.findIndex(([a, b]) => t >= a && t < b); if (i < 0) i = 구간.length - 1;
    const [a, , 색, 낮값] = 구간[i];
    const 앞 = 구간[Math.max(0, i - 1)];
    const x = soft(a, a + 1.2, t);
    const 낮도 = L(앞[3], 낮값, x);
    보임(낮, 낮도);
    빛.forEach((e, k) => {
      const 크 = [900, 700, 560][k];
      const px = C.x + Math.sin(t * .11 + k * 2.1) * 420 + (k - 1) * 260, py = C.y + Math.cos(t * .09 + k * 1.7) * 220 - 40;
      e.style.cssText = `position:absolute;left:${px - 크 / 2}px;top:${py - 크 / 2}px;width:${크}px;height:${크}px;border-radius:50%;background:radial-gradient(circle,${k === 1 ? 앞[2] : 색} 0%,transparent 70%);filter:blur(40px)`;
      보임(e, (k === 1 ? 1 - x : 1) * (낮도 > .5 ? .16 : .22) + (k === 1 ? 0 : 0));
    });
    잡음.style.backgroundPosition = `${(Math.floor(t * 30) % 9) * 53}px ${(Math.floor(t * 30) % 7) * 41}px`;
    보임(테, 1 - 낮도 * .7);
  };
})();

/* ── 부품 ── */
// 아이폰 (1배로 그림 · 4K 는 장치배율 2) — 폭 392 · 높이 800
const 폰 = (부모, 속html, 어두움 = false) => {
  const e = 박스('폰', 392, 800, 부모, `<div class="폰틀"><div class="폰화면${어두움 ? ' 어둠' : ''}"><div class="섬"></div><div class="상태"><b>9:41</b><span>${아이콘('지구', 0)}</span></div><div class="폰속">${속html}</div><div class="홈줄"></div></div></div>`);
  e.속 = e.querySelector('.폰속'); return e;
};
// 사진 카드 (실제 캡처) — 폭 w 로 맞춤 · 카메라(확대 영역) 지원
const 사진 = (부모, 번호, w, 둥 = 18) => {
  const s = window.사례[번호]; const h = Math.round(w * s.h / s.w);
  const e = 박스('사진카드', w, h, 부모, `<div class="사진속"><img src="${s.src}" style="width:${w}px;height:${h}px"></div>`);
  e.style.borderRadius = 둥 + 'px'; e.속 = e.querySelector('.사진속'); e.원 = s;
  e.카메라 = (cx, cy, z) => { e.속.style.transform = `translate(${(w / 2 - cx * z).toFixed(2)}px,${(h / 2 - cy * z).toFixed(2)}px) scale(${z.toFixed(4)})`; };
  e.카메라(w / 2, h / 2, 1);
  e.자 = (x) => x * w / s.w; // 원본 픽셀 → 카드 좌표
  return e;
};
// 사진 위 강조 테두리 (원본 픽셀 좌표 rect)
const 테두리 = (카드, r, 색 = '#ff3b4f') => {
  const k = +카드.dataset.w / 카드.원.w;
  const e = mk('div', '강조테', 카드.속); Object.assign(e.style, { left: r[0] * k - 6 + 'px', top: r[1] * k - 6 + 'px', width: (r[2] - r[0]) * k + 12 + 'px', height: (r[3] - r[1]) * k + 12 + 'px', borderColor: 색, boxShadow: `0 0 0 6px ${색}33` });
  return e;
};
const 형광펜 = (카드, r) => {
  const k = +카드.dataset.w / 카드.원.w;
  const e = mk('div', '형광', 카드.속); Object.assign(e.style, { left: r[0] * k + 'px', top: r[1] * k + 'px', width: (r[2] - r[0]) * k + 'px', height: (r[3] - r[1]) * k + 'px' });
  e.칠 = (x) => { e.style.clipPath = `inset(0 ${(100 - x * 100).toFixed(2)}% 0 0)`; };
  e.칠(0); return e;
};
// 컷씬 카드 16:9 · 켄번즈
const 컷 = (부모, 번호, w = 1180) => {
  const h = Math.round(w * 941 / 1672);
  const e = 박스('컷카드', w, h, 부모, `<img src="${window.컷씬[번호]}">`);
  e.img = e.querySelector('img'); e.img.style.width = w + 'px'; e.img.style.height = h + 'px';
  e.움직 = (t, a, b, 방향 = 1, 줌 = [1.03, 1.12], 초점 = [.5, .45]) => {
    const x = p(a, b, t); const z = L(줌[0], 줌[1], x);
    const dx = (초점[0] - .5) * w * (z - 1) * 2 * -1 + 방향 * L(-14, 14, x), dy = (초점[1] - .5) * h * (z - 1) * 2 * -1;
    e.img.style.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) scale(${z.toFixed(4)})`;
  };
  return e;
};
// 큰 글씨 (한 장면 하나)
const 큰글 = (부모, 글, 크기 = 200, 색 = '#fff', 굵기 = 800) => { const e = 박스('큰글', 1400, 크기 * 1.25, 부모, ''); e.style.fontSize = 크기 + 'px'; e.style.color = 색; e.style.fontWeight = 굵기; e.textContent = 글; return e; };
const 재현표 = (부모) => mk('div', '재현표', 부모, '재현');
// 아이콘 알 (둥근 타일 위 아이콘)
const 아이콘알 = (부모, 이름, 크기 = 150, 바탕 = 'rgba(255,255,255,.1)', 색 = '#fff') => { const e = 박스('아이콘알', 크기, 크기, 부모, 아이콘(이름, 크기 * .48, 색, 2)); e.style.background = 바탕; return e; };
// iOS 알림 배너 (재현)
const 알림 = (부모, 앱, 제목, 본문, 시 = '지금', 색 = '#1877f2') => 박스('알림', 380, 92, 부모, `<div class="앱" style="background:${색}">${아이콘(앱, 24, '#fff', 2.4)}</div><div class="알속"><div class="알머리"><b>${제목}</b><span>${시}</span></div><div class="알본문">${본문}</div></div>`);
// 반짝 선(화면 전환 번쩍)
const 번쩍 = mk('div', '번쩍');

/* ── 장면 묶음 ── */
const 장면 = {};
const 이음 = new Set([2]); // 앞 장면과 같은 그림이 이어지는 장면(페이드 없이 바로)
let 장면들 = [];
const 준비 = () => {
  장면들 = window.배치.map((s) => {
    const 뿌리 = mk('div', '장면'); 보임(뿌리, 0);
    const f = 장면[s.번호];
    const 그리기 = f ? f(뿌리, s) : (() => {});
    return { ...s, 뿌리, 그리기 };
  });
};
window.__frame = (ms) => {
  const t = ms / 1000;
  배경(t);
  let 번 = 0;
  for (const s of 장면들) {
    const 끝 = s.t1, 시작 = s.t0;
    const 다음 = 장면들[장면들.indexOf(s) + 1];
    const o = 창(t, 시작, 끝, 이음.has(s.번호) ? .02 : .38, 다음 && 이음.has(다음.번호) ? .02 : .3);
    if (o <= 0.001) { if (s.뿌리.style.visibility !== 'hidden') 보임(s.뿌리, 0); continue; }
    보임(s.뿌리, o);
    s.그리기(t, o);
  }
  // 전환 번쩍: 장 카드 시작에만 아주 짧게
  for (const n of (window.장카드 || [])) { const s = 장면들[n - 1]; 번 = Math.max(번, (soft(s.t0 - .12, s.t0, t) * (1 - soft(s.t0, s.t0 + .35, t)))); }
  보임(번쩍, 번 * .55);
};
window.__길이 = window.길이 * 1000;
