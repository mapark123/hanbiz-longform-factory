// 장면 부품(모든 영상 공통) — 흔들·펑·폰사진·긴사진·톡카드·창틀·물음표·커서·물결·장카드. 메타사기 4가지에서 뽑아냄.
const 흔들 = (t, a, 세기 = 1, 길이 = .4) => { if (t < a || t > a + 길이) return 0; const x = (t - a) / 길이; return Math.sin(x * Math.PI * 9) * (1 - x) * 세기; };
const 펑 = (t, a, d = .32) => { // 0 → 1.08 → 1 처럼 보이지만 튕김 없이: 커지며 나타남
  const x = p(a, a + d, t); return x <= 0 ? 0 : x >= 1 ? 1 : io(x);
};

// 폰 안 캡처(카톡·DM 목록): 폭 364 에 맞춰 넣고 위에서부터 드러냄
const 폰사진 = (부모, 번호, 머리 = '', 배경색 = '#b2c7da') => {
  const s = window.사례[번호]; const iw = 364, ih = Math.round(iw * s.h / s.w);
  const e = 폰(부모, `<div class="톡" style="background:${배경색}"><div class="톡머리">${머리}</div><div class="톡판"><div class="톡속" style="position:absolute;left:0;top:0;width:${iw}px;height:${ih}px"><img src="${s.src}" style="width:${iw}px;height:${ih}px"></div></div></div>`);
  e.톡속 = e.querySelector('.톡속'); e.ih = ih; e.k = iw / s.w;
  e.보이기 = (원y) => { const y = 원y * e.k; e.톡속.style.clipPath = `inset(0 0 ${Math.max(0, ih - y).toFixed(1)}px 0)`; };
  e.밀기 = (px) => { e.톡속.style.transform = `translateY(${(-px).toFixed(1)}px)`; };
  return e;
};
// 긴 캡처를 창 안에서 내려 보기 (메일 01 등): 폭 w · 보이는 높이 vh
const 긴사진 = (부모, 번호, w, vh) => {
  const s = window.사례[번호]; const ih = Math.round(w * s.h / s.w); const k = w / s.w;
  const e = 박스('사진카드', w, vh, 부모, `<div class="사진속" style="width:${w}px;height:${ih}px"><img src="${s.src}" style="width:${w}px;height:${ih}px"></div>`);
  e.style.borderRadius = '22px'; e.속 = e.querySelector('.사진속'); e.원 = s; e.k = k;
  e.카메라 = (원cx, 원cy, z = 1) => { const cx = 원cx * k, cy = 원cy * k; const tx = Math.min(0, Math.max(w - w * z, w / 2 - cx * z)), ty = Math.min(0, Math.max(vh - ih * z, vh / 2 - cy * z)); e.속.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${z.toFixed(4)})`; };
  return e;
};

// 캡처 카드(카톡·DM): 폰 틀 대신 크게 — 위에서부터 드러냄(보이기) · 위로 밀기(밀기) · 단위 = 원본 픽셀
const 톡카드 = (부모, 번호, w, 최대높이 = 820) => {
  const s = window.사례[번호]; const ih = Math.round(w * s.h / s.w); const vh = Math.min(ih, 최대높이);
  const e = 긴사진(부모, 번호, w, vh); e.ih = ih; e.vh = vh;
  e.보이기 = (원y) => { const y = Math.min(ih, 원y * e.k); e.속.style.clipPath = `inset(0 0 ${Math.max(0, ih - y).toFixed(1)}px 0)`; e.style.height = Math.max(40, Math.min(vh, y)) + 'px'; };
  e.밀기 = (원px) => { e.속.style.transform = `translateY(${(-원px * e.k).toFixed(1)}px)`; };
  return e;
};
const 창틀 = (부모, w, h, 제목) => { const e = 박스('창', w, h, 부모, `<div class="창머리"><i></i><i></i><i></i>${제목}</div><div class="창속" style="position:absolute;left:0;right:0;top:58px;bottom:0;overflow:hidden"></div>`); e.속 = e.querySelector('.창속'); return e; };
const 물음표 = (부모, 크기 = 120, 색 = '#ffd60a') => { const e = 박스('', 크기, 크기, 부모, `<div style="width:100%;height:100%;border-radius:50%;background:${색};color:#111;font-weight:900;font-size:${크기 * .62}px;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(0,0,0,.35)">?</div>`); return e; };
const 커서 = (부모) => 박스('', 44, 44, 부모, '<svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 2l15 10-7 1.500 4 7.500-3 1.500-4-7.500-5 5z" fill="#fff" stroke="#111" stroke-width="1.300" stroke-linejoin="round"/></svg>');
const 물결 = (부모) => { const e = 박스('고리', 80, 80, 부모); e.style.borderColor = '#3d7dff'; return e; };
const 물결그리기 = (e, t, a, x, y) => { const k = p(a, a + .5, t); 놓기(e, x, y, L(.2, 1.6, k), 0, k > 0 && k < 1 ? (1 - k) * .9 : 0); };


/* 장 카드 공통 */
const 장카드 = (번, 이름, 색1, 색2) => (뿌, s) => {
  const 수 = 박스('장수', 600, 440, 뿌, String(번)); 수.style.backgroundImage = `linear-gradient(170deg,${색1},${색2})`;
  const 이 = 박스('장이름', 1000, 80, 뿌, `<i>${['', '첫 번째', '두 번째', '세 번째', '네 번째'][번]}</i>${이름}`); 이.style.color = '#fff';
  const 고 = [0, 1].map(() => { const e = 박스('고리', 520, 520, 뿌); e.style.borderColor = 색1; return e; });
  return (t) => {
    const a = s.ev[0] - .15; const k = soft(a, a + .55, t);
    놓기(수, C.x, C.y - 70 + L(-90, 0, k), L(1.15, 1, k), 0, k); 흐림(수, (1 - k) * 20);
    const k2 = soft(a + .25, a + .75, t); 놓기(이, C.x, C.y + 230 + L(30, 0, k2), 1, 0, k2);
    고.forEach((e, i) => { const kk = p(a + i * .25, a + 1.4 + i * .25, t); 놓기(e, C.x, C.y - 70, L(.5, 1.9, io(kk)), 0, kk > 0 && kk < 1 ? (1 - kk) * .7 : 0); });
  };
};
