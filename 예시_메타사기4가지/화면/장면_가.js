// 장면 1~17 (메타사기 4가지 예시) — 부품은 _틀/화면/장면_부품.js
/* 1. 오프닝 · 밤에 쏟아지는 경고 알림 */
장면[1] = (뿌, s) => {
  const 뒤 = 컷(뿌, '01', 1500); 흐림(뒤, 14);
  const ph = 폰(뿌, `<div class="잠금"><div class="날">10월 28일 화요일</div><div class="시">2:14</div></div>`, true);
  const 표 = 재현표(ph);
  const 알 = [
    ['경고', 'Meta Business', '귀하의 광고 계정이 24시간 후 삭제됩니다.', '#1877f2'],
    ['경고', 'Messenger', '페이스북에서 심각한 위반 경고를 드립니다.', '#7b5cff'],
    ['메일', '메일', '변호사 이건우 법률사무소 — 저작권 침해 경고 및 시정 요구', '#2f80ed'],
    ['경고', '메일', '[최종 통보] 개인정보보호법 위반 — 법적 조치 예정', '#e5383b'],
  ].map(([앱, 제, 본, 색]) => 알림(ph.속, 앱, 제, 본, '지금', 색));
  알.forEach((a) => { a.style.position = 'absolute'; a.dataset.w = 344; a.style.width = '344px'; });
  const 붉 = 박스('', 392, 800, 뿌); 붉.style.borderRadius = '64px'; 붉.style.boxShadow = '0 0 0 6px #ff3b4f,0 0 80px 20px rgba(255,59,79,.55)';
  return (t) => {
    놓기(뒤, C.x, C.y + 20, 1, 0, .28); 뒤.움직(t, s.t0, s.t1 + 1, 1, [1.05, 1.12]);
    const 떨 = 흔들(t, s.ev[0], 1.4) + 흔들(t, s.ev[1], .8) + 흔들(t, s.ev[2], .8) + 흔들(t, s.ev[3], .8) + 흔들(t, s.ev[4], 1.6, .5);
    const z = L(.86, .96, soft(s.t0, s.t1, t));
    놓기(ph, C.x, C.y + 6 + 쉼(t * .8) * 4, z, 떨);
    알.forEach((a, i) => { const k = 펑(t, s.ev[i + 1] ?? s.ev[4]); const 아래 = 알.filter((_, j) => j > i && t >= (s.ev[j + 1] ?? s.ev[4])).length; a.style.left = '10px'; a.style.top = (230 + (알.length - 1 - i) * 0 + (i === 3 ? 0 : 0)) + 'px'; a.style.transform = `translateY(${(L(-40, 0, k) + 아래 * 104 - (i === 3 ? 0 : 0)).toFixed(1)}px) scale(${L(.94, 1, k).toFixed(3)})`; 보임(a, k); });
    const r = 인(t, s.ev[4], .25) * (.55 + .45 * Math.sin((t - s.ev[4]) * 9));
    놓기(붉, C.x, C.y + 6 + 쉼(t * .8) * 4, z, 떨, t > s.ev[4] ? r : 0);
  };
};
// 알림 순서: 새 알림이 맨 위로, 앞 알림은 아래로 밀림 → 위 계산(아래 = 뒤에 온 알림 개수)

/* 2. 협박 문자 폭탄 */
장면[2] = (뿌, s) => {
  const ph = 폰(뿌, `<div class="잠금" style="background:radial-gradient(120% 80% at 50% 0%,#5a1d2a 0%,#1a0d14 50%,#06080f 100%)"><div class="날">10월 28일 화요일</div><div class="시">2:15</div></div>`, true);
  재현표(ph);
  const 글 = ['24시간 안에 회신하지 않으면…', '귀하의 계정이 영구 정지됩니다', '형사 고소가 진행됩니다', '최종 경고', '법적 조치 안내', '지금 바로 확인하세요', '페이지 삭제 예정', '규정 위반 신고 접수', '소명하지 않으면 삭제', '심각한 범죄 행위 확인'];
  const 무리 = [...Array(26).keys()].map((i) => { const a = 알림(뿌, i % 3 ? '경고' : '메일', i % 2 ? 'Messenger' : '메일', 글[i % 글.length], '지금', ['#e5383b', '#1877f2', '#7b5cff'][i % 3]); return a; });
  // 고정된 흩뿌림 자리 (얼굴 원·자막 띠 피함)
  const 자리 = 무리.map((_, i) => { const r = Math.sin(i * 12.9898) * 43758.5453; const f = r - Math.floor(r); const g = (Math.sin(i * 78.233) * 12543.1) % 1; return { x: 520 + ((i * 0.618) % 1) * 1260, y: 90 + Math.abs(g) * 720, s: .62 + f * .3, r: (f - .5) * 10, d: f * 6 }; });
  const 맥 = 박스('', W, H, 뿌); 맥.style.background = 'radial-gradient(60% 60% at 58% 45%,transparent 30%,rgba(255,30,50,.5) 100%)';
  return (t) => {
    const 쿵 = 흔들(t, s.ev[2], 2.2, .45);
    놓기(ph, C.x, C.y + 6, .96 + 인(t, s.ev[2], .12) * .03 - soft(s.ev[2] + .12, s.ev[2] + .6, t) * .03, 쿵);
    무리.forEach((a, i) => { const 시 = s.ev[0] + i * 0.13; const k = 펑(t, 시, .28); const z = 자리[i]; const 멀 = z.y < 300 || z.x > 1600 ? 1 : 0; 놓기(a, z.x, z.y + L(-30, 0, k), z.s * L(.8, 1, k), z.r + 쿵 * .5, k * (.92 - z.d * .05)); 흐림(a, 멀 ? 1.2 : 0); });
    보임(맥, t > s.ev[1] ? (.35 + .35 * Math.sin((t - s.ev[1]) * 6)) * (1 - soft(s.ev[2], s.ev[2] + .4, t) * .4) : 0);
  };
};

/* 3. 이거 100% 사기입니다 */
장면[3] = (뿌, s) => {
  const 숫 = 큰글(뿌, '100%', 330, '#fff', 900);
  const 도 = 박스('도장', 520, 260, 뿌, '사기');
  const 빛 = 박스('', W, H, 뿌); 빛.style.background = 'radial-gradient(50% 50% at 58% 45%,rgba(255,45,61,.45),transparent 70%)';
  return (t) => {
    const k = 펑(t, s.ev[0], .3); const 쾅 = p(s.ev[1], s.ev[1] + .18, t);
    const 떨 = 흔들(t, s.ev[1], 2.5, .4);
    놓기(숫, C.x + 떨 * 3, C.y - 20, L(1.25, 1, k) - (쾅 > 0 && 쾅 < 1 ? 0 : 0), 0, k); 흐림(숫, (1 - k) * 18);
    놓기(도, C.x + 250 + 떨 * 2, C.y + 150, L(2.4, 1, io(쾅)), L(-20, -10, io(쾅)), 쾅 > 0 ? Math.min(1, 쾅 * 3) : 0);
    보임(빛, 인(t, s.ev[1], .1) * (1 - soft(s.ev[1] + .1, s.ev[1] + .9, t) * .6));
  };
};

/* 4. 이딴 걸 누가 당해? → 꽤 많더라 */
장면[4] = (뿌, s) => {
  const c = 컷(뿌, '08', 1180); const q = 물음표(뿌, 130);
  const 사람 = [...Array(14).keys()].map(() => 아이콘알(뿌, '사람', 86, 'rgba(255,255,255,.16)'));
  return (t) => {
    const 줄 = soft(s.ev[1] - .2, s.ev[1] + .5, t);
    놓기(c, C.x, C.y - 30 - 줄 * 60, L(1, .86, 줄)); c.움직(t, s.t0, s.t1, -1, [1.02, 1.1], [.5, .38]);
    const k = 펑(t, s.ev[0]); 놓기(q, C.x + 470, C.y - 280, L(.4, 1, k), L(-20, 8, k), k * (1 - 줄));
    사람.forEach((e, i) => { const kk = 펑(t, s.ev[1] + i * .06, .25); 놓기(e, C.x - 600 + i * 92, C.y + 360, L(.3, 1, kk), 0, kk); });
  };
};

/* 5. 수강생 연령대 */
장면[5] = (뿌, s) => {
  const c = 컷(뿌, '02', 1180);
  const 이름 = ['20대', '30대', '40대', '50대+'];
  const 막 = 이름.map((n, i) => 박스('막대', 170, 520, 뿌));
  const 표 = 이름.map((n) => { const e = 박스('막대이름', 170, 50, 뿌); e.textContent = n; return e; });
  const 바닥 = 박스('', 900, 4, 뿌); 바닥.style.background = 'rgba(255,255,255,.35)'; 바닥.style.borderRadius = '2px';
  const 경 = 아이콘알(뿌, '경고', 120, '#ff3b4f');
  const 절대 = 낱말('절대', s.t0) ?? s.ev[1] + 1.8;
  return (t) => {
    const 막등장 = 인(t, s.ev[1] - .3, .5);
    놓기(c, C.x, C.y, 1 - 막등장 * .1, 0, 1 - 막등장); c.움직(t, s.t0, s.ev[1], 1, [1.03, 1.12]);
    const 밑 = C.y + 300;
    놓기(바닥, C.x, 밑 + 2, 1, 0, 막등장);
    // 기대(젊은 층 높음) → 절대 안 해요(줄어듦) → 40대 우뚝
    const 기대 = [.8, .7, .35, .3], 실제 = [.22, .38, 1, .66];
    const 바뀜 = soft(절대, 절대 + .8, t), 사십 = soft(s.ev[2], s.ev[2] + .7, t);
    막.forEach((e, i) => {
      const 자람 = soft(s.ev[1] + i * .12, s.ev[1] + i * .12 + .7, t);
      let hgt = L(기대[i], i === 2 ? .45 : 실제[i], 바뀜); if (i === 2) hgt = L(hgt, 1, 사십);
      const h = 520 * hgt * 자람;
      e.style.height = Math.max(2, h) + 'px'; e.dataset.h = Math.max(2, h);
      e.style.background = i === 2 ? `linear-gradient(180deg,${사십 > .01 ? '#ffd166' : '#6c7aa8'},${사십 > .01 ? '#f59e0b' : '#3c4a78'})` : 'linear-gradient(180deg,#6c7aa8,#3c4a78)';
      e.style.boxShadow = i === 2 && 사십 > .01 ? `0 0 ${60 * 사십}px rgba(255,190,60,.55)` : 'none';
      const x = C.x - 330 + i * 220; 놓기(e, x, 밑 - h / 2, 1, 0, 막등장);
      놓기(표[i], x, 밑 + 40, 1, 0, 막등장);
    });
    const k = 펑(t, s.ev[3]); 놓기(경, C.x - 330 + 2 * 220, 밑 - 520 - 90, L(.4, 1, k), 0, k);
  };
};

/* 6. 메타·변호사라고 써 있으니 믿는다 */
장면[6] = (뿌, s) => {
  const 봉 = 박스('', 560, 380, 뿌, `<div style="position:absolute;inset:0;border-radius:28px;background:linear-gradient(160deg,#ffffff,#e9edf5);box-shadow:0 30px 80px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center">${아이콘('메일', 220, '#2f3b5c', 1.6)}</div>`);
  const 배1 = 박스('', 220, 76, 뿌, '<div style="width:100%;height:100%;border-radius:999px;background:#1877f2;color:#fff;font-size:36px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(24,119,242,.5)">Meta</div>');
  const 배2 = 박스('', 220, 76, 뿌, '<div style="width:100%;height:100%;border-radius:999px;background:#1d2a4d;color:#ffd166;font-size:36px;font-weight:800;display:flex;align-items:center;justify-content:center;border:3px solid #ffd166;box-shadow:0 12px 30px rgba(0,0,0,.4)">변호사</div>');
  const ph = 톡카드(뿌, '11', 660);
  const c = 컷(뿌, '03', 1180); const q = 물음표(뿌, 120);
  return (t) => {
    const 폰때 = 인(t, s.ev[2] - .2, .45), 컷때 = 인(t, s.ev[3] - .25, .45);
    const 봉보 = (1 - 폰때);
    놓기(봉, C.x - 폰때 * 200, C.y + 쉼(t) * 4, 1, 0, 봉보);
    const k1 = 펑(t, s.ev[0]), k2 = 펑(t, s.ev[1]);
    놓기(배1, C.x - 170 - 폰때 * 200, C.y - 210, L(.5, 1, k1), -6, k1 * 봉보);
    놓기(배2, C.x + 170 - 폰때 * 200, C.y - 210, L(.5, 1, k2), 5, k2 * 봉보);
    ph.보이기(L(60, 235, soft(s.ev[2] - .1, s.ev[2] + 1.2, t))); 놓기(ph, C.x + (1 - 폰때) * 160, C.y - 250 + ph.vh / 2, 1, 0, 폰때 * (1 - 컷때));
    놓기(c, C.x, C.y, L(.92, 1, 컷때), L(0, -1.5, soft(s.ev[3], s.ev[3] + 1.2, t)), 컷때); c.움직(t, s.ev[3] - .3, s.t1, 1, [1.02, 1.1], [.45, .4]);
    const kq = 펑(t, s.ev[3] + .1); 놓기(q, C.x + 470, C.y - 270, L(.4, 1, kq), L(-15, 10, kq), kq * 컷때);
  };
};

/* 7. 카드번호·비밀번호를 그냥 보내 줌 */
장면[7] = (뿌, s) => {
  const 것 = ['카드', '자물쇠', '신분증'].map((n) => 아이콘알(뿌, n, 190, 'rgba(255,255,255,.12)'));
  const 비 = 것.map(() => 박스('', 90, 90, 뿌, 아이콘('비행기', 90, '#9cc3ff', 2)));
  const 빈 = 것.map(() => { const e = 박스('', 190, 190, 뿌); e.style.border = '3px dashed rgba(255,255,255,.28)'; e.style.borderRadius = '34%'; return e; });
  return (t) => {
    것.forEach((e, i) => {
      const x0 = C.x - 300 + i * 300, y0 = C.y; const a = s.ev[i];
      const 등장 = 펑(t, s.t0 + .1 + i * .12);
      const f = soft(a, a + .9, t);
      const x = L(x0, 1900, f) , y = y0 - Math.sin(f * Math.PI * .5) * 560;
      놓기(e, x, y, L(1, .35, f), L(0, 28 + i * 6, f), 등장 * (1 - soft(a + .6, a + .9, t)));
      놓기(비[i], x - 110, y + 40, L(.6, 1, f), -12, f > 0 && f < 1 ? Math.min(1, f * 4) * (1 - f) : 0);
      놓기(빈[i], x0, y0, 1, 0, t > a ? .9 * 인(t, a + .2, .4) : 0);
    });
    const 한 = 흔들(t, s.ev[3], 1.2, .5); 빈.forEach((e, i) => { if (t > s.ev[3]) e.style.transform += ` translateY(${(soft(s.ev[3], s.ev[3] + .8, t) * 14).toFixed(1)}px) rotate(${한}deg)`; });
  };
};

/* 8. 게시판 공지 — 실제 사건 예고 */
장면[8] = (뿌, s) => {
  const 창 = 창틀(뿌, 1160, 520, '한비즈 파트너센터 · 게시판');
  const 판 = 사진(창.속, '17', 1160, 0); 판.style.boxShadow = 'none'; 판.style.left = '0'; 판.style.top = '30px'; 판.style.position = 'absolute'; 판.style.transform = 'none';
  const 줄빛 = mk('div', '', 창.속); Object.assign(줄빛.style, { position: 'absolute', left: '0', top: '30px', width: '1160px', height: 판.자(44) + 'px', background: 'rgba(255,209,102,.35)', boxShadow: 'inset 0 0 0 4px #ffb020' });
  const 커 = 커서(뿌); const 물 = 물결(뿌);
  return (t) => {
    const 줌 = soft(s.ev[1], s.ev[1] + 1.2, t), 깊 = soft(s.ev[2], s.t1, t);
    const 다가 = soft(s.t0, s.ev[1], t) * .05; 놓기(창, C.x + 쉼(t * .7) * 10, C.y - 10 + 쉼(t * .5 + 1) * 6, L(.9 + 다가, 1.06, 줌) + 깊 * .08, 쉼(t * .4) * .4); 흐림(창, 깊 * 4);
    const 목 = { x: C.x - 400, y: C.y - 260 + 30 + 판.자(22) };
    const 가 = soft(s.ev[0] - 1.2, s.ev[0], t);
    놓기(커, L(C.x + 380, 목.x, 가), L(C.y + 200, 목.y, 가), t > s.ev[0] && t < s.ev[0] + .12 ? .85 : 1, 0, 1 - soft(s.ev[1] + .3, s.ev[1] + .7, t));
    물결그리기(물, t, s.ev[0], 목.x, 목.y);
    보임(줄빛, 인(t, s.ev[1], .3) * (.75 + .25 * Math.sin(t * 5)));
  };
};

장면[9] = 장카드(1, '변호사 메일', '#ff8a5c', '#ff3b4f');

/* 10. 수강생 카톡 — 페이지 지웠대요 */
장면[10] = (뿌, s) => {
  const ph = 톡카드(뿌, '03', 560, 780);
  const c = 컷(뿌, '05', 640);
  return (t) => {
    const 둘 = soft(s.ev[1] - .25, s.ev[1] + .35, t);
    놓기(ph, C.x - 둘 * 330, C.y - 380 + ph.vh / 2);
    // 03 원본: 학생 말 y 0~170 · 대표 답 170~362 · 아래 362~
    const 보 = L(0, 185, soft(s.ev[0] - .1, s.ev[0] + .7, t)) + L(0, 180, soft(s.ev[2] - .1, s.ev[2] + .9, t));
    ph.보이기(Math.max(10, 보)); ph.밀기(0);
    놓기(c, C.x + 340, C.y, L(.9, 1, 둘), 0, 둘); c.움직(t, s.ev[1], s.t1, 1, [1.04, 1.16], [.55, .55]);
    const 회 = soft(s.ev[3], s.ev[3] + .6, t); c.img.style.filter = 회 > 0 ? `grayscale(${회}) brightness(${L(1, .7, 회)})` : 'none';
  };
};

/* 11. 그럴싸한 가짜 변호사 메일 */
장면[11] = (뿌, s) => {
  const m = 긴사진(뿌, '01', 640, 820);
  const 형 = mk('div', '형광', m.속); const 형2 = mk('div', '형광', m.속);
  const k = m.k; Object.assign(형.style, { left: 40 * k + 'px', top: 606 * k + 'px', width: 640 * k + 'px', height: 26 * k + 'px' }); Object.assign(형2.style, { left: 40 * k + 'px', top: 636 * k + 'px', width: 640 * k + 'px', height: 26 * k + 'px' });
  const 붉 = mk('div', '강조테', m.속); Object.assign(붉.style, { left: 34 * k + 'px', top: 600 * k + 'px', width: 652 * k + 'px', height: 180 * k + 'px', opacity: 0 });
  const c = 컷(뿌, '04', 1180);
  return (t) => {
    const 펼 = soft(s.ev[0] - .1, s.ev[0] + .55, t);
    const 컷때 = 인(t, s.ev[3] - .2, .45);
    m.style.transformOrigin = '50% 0'; 놓기(m, C.x, C.y + 20, 1, 0, 펼 * (1 - 컷때)); m.style.transform += ` scaleY(${L(.3, 1, 펼).toFixed(3)})`;
    const 내 = soft(s.ev[1] - .6, s.ev[1] + .3, t);
    m.카메라(371, L(320, 690, 내), L(1, 1.25, soft(s.ev[2], s.ev[2] + .8, t)));
    형.style.clipPath = `inset(0 ${(100 - 100 * soft(s.ev[1], s.ev[1] + .9, t)).toFixed(1)}% 0 0)`;
    형2.style.clipPath = `inset(0 ${(100 - 100 * soft(s.ev[1] + .6, s.ev[1] + 1.5, t)).toFixed(1)}% 0 0)`;
    붉.style.opacity = (인(t, s.ev[2], .2) * (.7 + .3 * Math.sin((t - s.ev[2]) * 8))).toFixed(3);
    const 떨 = t > s.ev[3] ? Math.sin(t * 47) * 1.6 + Math.sin(t * 31) * 1.1 : 0;
    놓기(c, C.x + 떨, C.y, L(.94, 1, 컷때), 떨 * .15, 컷때); c.움직(t, s.ev[3], s.t1, 1, [1.03, 1.1], [.5, .55]);
  };
};

/* 12. 근데 회신 주소가 개인 메일 */
장면[12] = (뿌, s) => {
  const m = 긴사진(뿌, '01', 640, 820);
  const 테 = mk('div', '강조테', m.속); const k = m.k;
  Object.assign(테.style, { left: 262 * k + 'px', top: 1394 * k + 'px', width: 200 * k + 'px', height: 34 * k + 'px', borderRadius: '8px' });
  const 건 = 아이콘알(뿌, '간판', 160, 'rgba(255,255,255,.14)'), 메 = 아이콘알(뿌, '메일', 160, 'rgba(255,59,79,.85)');
  const q = 물음표(뿌, 110);
  return (t) => {
    const 이동 = soft(s.ev[0] - .3, s.ev[0] + .7, t);
    const 옆 = soft(s.ev[2] - .4, s.ev[2] + .2, t);
    놓기(m, C.x - 옆 * 260, C.y + 20, 1 - 옆 * .08);
    m.카메라(371, L(760, 1410, 이동), L(1, 1.35, soft(s.ev[1] - .2, s.ev[1] + .5, t)));
    const kk = soft(s.ev[1], s.ev[1] + .35, t); 테.style.opacity = kk.toFixed(3); 테.style.transform = `scale(${L(1.3, 1, kk).toFixed(3)})`;
    const k1 = 펑(t, s.ev[2]), k2 = 펑(t, s.ev[2] + .18), k3 = 펑(t, s.ev[2] + .4);
    놓기(건, C.x + 330, C.y - 120, L(.4, 1, k1), 0, k1); 놓기(메, C.x + 330, C.y + 120, L(.4, 1, k2), 0, k2); 놓기(q, C.x + 470, C.y, L(.4, 1, k3), 10, k3);
  };
};

/* 13. 적힌 번호로 걸어 봄 */
장면[13] = (뿌, s) => {
  const ph = 폰(뿌, `<div class="통화"><div class="번">1599-4585</div><div class="상">발신 중…</div><div class="격"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="끊">${아이콘('전화', 38, '#fff', 2.6)}</div></div>`, true);
  재현표(ph); const 상 = ph.querySelector('.상');
  const c = 컷(뿌, '09', 660);
  return (t) => {
    놓기(ph, C.x - 330, C.y + 8, .9 * L(.94, 1, 펑(t, s.ev[0] - .3)));
    상.textContent = t < s.ev[1] ? '발신 중…' : `통화 중  00:0${Math.min(9, Math.floor(t - s.ev[1]))}`;
    const 감 = soft(s.ev[2] - .2, s.ev[2] + .6, t);
    놓기(c, C.x + 350 - 감 * 40, C.y, L(1, 1.08, 감)); c.움직(t, s.t0, s.t1, -1, [1.03, 1.14], [.5, .4]);
  };
};

/* 14. 검색해도 없음 · 변호사회 "그런 변호사 없다" */
장면[14] = (뿌, s) => {
  const r = 사진(뿌, '02', 520); const x = 박스('', 200, 200, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#ff3b4f;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 50px rgba(255,59,79,.5)">${아이콘('엑스', 120, '#fff', 3)}</div>`);
  const 커 = 박스('', 4, 44, 뿌); 커.style.background = '#3d7dff';
  const ph = 톡카드(뿌, '12', 600); const c = 컷(뿌, '06', 640);
  return (t) => {
    const 넘 = soft(s.ev[2] - .3, s.ev[2] + .3, t);
    놓기(r, C.x - 넘 * 200, C.y, L(.95, 1, 펑(t, s.t0)), 0, 1 - 넘);
    놓기(커, C.x - 160, C.y - 160, 1, 0, t < s.ev[1] && Math.floor(t * 3) % 2 === 0 ? 1 - 넘 : 0);
    const kx = 펑(t, s.ev[1]); 놓기(x, C.x + 190, C.y + 140, L(.3, 1, kx), L(-30, 0, kx), kx * (1 - 넘));
    ph.보이기(L(70, 256, soft(s.ev[2], s.ev[2] + 1.6, t))); 놓기(ph, C.x - 330, C.y - 260 + ph.vh / 2, 1, 0, 넘);
    const 안 = soft(s.ev[3] - .2, s.ev[3] + .8, t);
    놓기(c, C.x + 340, C.y, L(1, 1.06, 안), 0, 넘); c.움직(t, s.ev[2], s.t1, 1, [1.03, 1.12]); c.img.style.filter = `brightness(${L(.85, 1.08, 안).toFixed(3)})`;
  };
};

/* 15. 비싸게 학습시킨 페이지가 날아감 */
장면[15] = (뿌, s) => {
  const c = 컷(뿌, '07', 1180);
  const 블 = [...Array(24).keys()].map(() => 박스('블록', 118, 66, 뿌));
  const 자리 = 블.map((_, i) => ({ col: i % 3, row: Math.floor(i / 3) }));
  return (t) => {
    const 블때 = 인(t, s.ev[0] - .5, .5);
    놓기(c, C.x, C.y, 1 - 블때 * .06, 0, 1 - 블때 * .82); c.움직(t, s.t0, s.t1, 1, [1.03, 1.12]); 흐림(c, 블때 * 8);
    const 무 = s.ev[2];
    블.forEach((e, i) => {
      const { col, row } = 자리[i];
      const 시 = row < 4 ? s.ev[0] + i * .1 : s.ev[1] - 1.2 + (i - 12) * .1;
      const k = soft(시, 시 + .35, t);
      const bx = C.x - 128 + col * 128, by = C.y + 300 - row * 72;
      const 떨어짐 = Math.max(0, t - 무 - row * .02);
      const 회 = ((i * 37) % 11 - 5) * 14; const dx = ((i * 53) % 9 - 4) * 70;
      const y = 떨어짐 > 0 ? by + 900 * 떨어짐 * 떨어짐 * .9 - 260 * 떨어짐 * (row / 8) : by + L(-60, 0, k);
      놓기(e, bx + (떨어짐 > 0 ? dx * Math.min(1, 떨어짐 * 1.8) : 0), Math.min(y, C.y + 380 + (i % 3) * 8), 1, 떨어짐 > 0 ? 회 * Math.min(1, 떨어짐 * 2) : 0, k * 블때);
      e.style.filter = t > s.ev[3] ? `grayscale(${soft(s.ev[3], s.ev[3] + .5, t)})` : 'none';
    });
  };
};

/* 16. 그래서 공지를 박아 버림 */
장면[16] = (뿌, s) => {
  const 창 = 창틀(뿌, 1160, 420, '한비즈 파트너센터 · 게시판');
  const 판 = 사진(창.속, '17', 1160, 0); 판.style.boxShadow = 'none'; 판.style.position = 'absolute'; 판.style.left = '0'; 판.style.top = '20px';
  const 핀 = 박스('', 90, 120, 뿌, '<svg width="90" height="120" viewBox="0 0 30 40"><path d="M9 2h12l-2 10 5 6H6l5-6z" fill="#ffd166" stroke="#b7791f" stroke-width="1.2"/><path d="M15 18v20" stroke="#b7791f" stroke-width="2.4" stroke-linecap="round"/></svg>');
  const 반 = mk('div', '', 창.속); Object.assign(반.style, { position: 'absolute', left: '0', top: '20px', width: '260px', height: 판.자(44) + 'px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)' });
  return (t) => {
    놓기(창, C.x, C.y, L(.94, 1, 펑(t, s.t0, .5)));
    판.style.transform = `translateY(${L(판.자(130), 0, soft(s.ev[0] - 1.6, s.ev[0] - .2, t)).toFixed(1)}px)`;
    const k = soft(s.ev[0] - .25, s.ev[0], t);
    놓기(핀, C.x - 560, C.y - 210 + L(-300, 0, k) + 20, 1, L(-25, -8, k), k);
    반.style.transform = `translateX(${L(-300, 1300, p(s.ev[1], s.ev[1] + .9, t)).toFixed(1)}px)`; 반.style.opacity = t > s.ev[1] && t < s.ev[1] + .9 ? 1 : 0;
  };
};

/* 17. 광고 첫날부터 스팸이 온다 */
장면[17] = (뿌, s) => {
  const ph = 톡카드(뿌, '06', 600, 760);
  const c = 컷(뿌, '10', 1180);
  return (t) => {
    const 컷때 = 인(t, s.ev[2] - .3, .5);
    ph.보이기(L(120, 513, soft(s.ev[0] - .1, s.ev[0] + .8, t))); 놓기(ph, C.x, C.y - 360 + ph.vh / 2, L(.94, 1, 펑(t, s.t0, .45)), 0, 1 - 컷때);
    놓기(c, C.x, C.y, L(.94, 1, 컷때), 0, 컷때); c.움직(t, s.ev[2] - .3, s.t1, -1, [1.03, 1.12]);
  };
};
