// 장면 18~33 : 두 번째(메타인 척) · 세 번째(소명 → 해킹)
장면[18] = 장카드(2, '메타인 척하는 메시지', '#7fb2ff', '#3d5cff');

/* 19. 대표가 직접 받은 DM 3장 · 한 달에도 몇 번씩 */
장면[19] = (뿌, s) => {
  const 카 = ['04', '05', '07'].map((n) => 사진(뿌, n, 720));
  const c = 컷(뿌, '11', 1180);
  return (t) => {
    const 컷때 = 인(t, s.ev[3] - .3, .5);
    카.forEach((e, i) => {
      const a = s.ev[i] - .25; const k = soft(a, a + .55, t);
      const 뒤로 = 카.filter((_, j) => j > i && t > s.ev[j] - .25).length; const 뒤k = 카.reduce((m, _, j) => j > i ? m + soft(s.ev[j] - .25, s.ev[j] + .3, t) : m, 0);
      놓기(e, C.x + L(700, 0, k) - 뒤k * 40, C.y - 뒤k * 60, (1 - 뒤k * .08) * L(.96, 1, k), L(6, 0, k) - 뒤k * 2, k * (1 - 컷때) * (1 - 뒤k * .25));
      e.style.zIndex = 10 + i;
      e.style.filter = 뒤k > .05 ? `brightness(${(1 - 뒤k * .3).toFixed(3)})` : 'none';
    });
    놓기(c, C.x, C.y, L(.94, 1, 컷때), 0, 컷때); c.움직(t, s.ev[3] - .3, s.t1, 1, [1.02, 1.1], [.5, .4]);
  };
};

/* 20. 규정 위반 · 24시간 안에 날려 버리겠다 */
장면[20] = (뿌, s) => {
  const 경 = 아이콘알(뿌, '경고', 200, '#ff3b4f');
  const 시 = 큰글(뿌, '24:00:00', 230, '#ff4d5e', 800);
  const 빛 = 박스('', W, H, 뿌); 빛.style.background = 'radial-gradient(55% 55% at 58% 45%,rgba(255,40,60,.5),transparent 70%)';
  return (t) => {
    const k0 = 펑(t, s.ev[0]); const 시때 = soft(s.ev[1] - .2, s.ev[1] + .3, t);
    놓기(경, C.x, C.y - 40 - 시때 * 230, L(.4, 1, k0) * L(1, .6, 시때), 0, k0);
    const 남 = Math.max(0, 86400 - Math.max(0, t - s.ev[1]) * 1700);
    const hh = Math.floor(남 / 3600), mm = Math.floor(남 % 3600 / 60), ss = Math.floor(남 % 60);
    시.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    const 쾅 = 흔들(t, s.ev[2], 3, .5);
    놓기(시, C.x + 쾅 * 4, C.y + 90, L(.9, 1, 시때) + 인(t, s.ev[2], .08) * .06 - soft(s.ev[2] + .08, s.ev[2] + .5, t) * .06, 쾅 * .4, 시때);
    보임(빛, 인(t, s.ev[2], .08) * (1 - soft(s.ev[2] + .1, s.ev[2] + 1, t) * .7) + 시때 * .15);
  };
};

/* 21. 프사는 메타 로고 · 들어가 보면 엉터리 계정 */
장면[21] = (뿌, s) => {
  const 프 = 박스('', 300, 300, 뿌, `<div style="width:300px;height:300px;border-radius:50%;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 8px rgba(255,255,255,.12);background:#fff"><img src="${window.사례['06'].src}" style="position:absolute;width:${445 * 300 / 52}px;left:${-21 * 300 / 52}px;top:${-31 * 300 / 52}px"></div>`);
  프.firstChild.style.position = 'relative';
  const 이름 = 박스('', 600, 70, 뿌, `<div style="display:flex;gap:12px;align-items:center;justify-content:center;font-size:46px;font-weight:700">Ai Chat's <span style="width:40px;height:40px;border-radius:50%;background:#1877f2;display:inline-flex;align-items:center;justify-content:center">${아이콘('체크', 26, '#fff', 3.4)}</span></div>`);
  const 카 = 사진(뿌, '13', 780);
  const 선 = 박스('', 820, 6, 뿌); 선.style.background = 'linear-gradient(90deg,transparent,#5ee1ff,transparent)'; 선.style.boxShadow = '0 0 30px #5ee1ff';
  const 테1 = 테두리(카, [88, 258, 392, 279]);
  const x1 = 박스('', 120, 120, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#ff3b4f;display:flex;align-items:center;justify-content:center">${아이콘('엑스', 70, '#fff', 3.2)}</div>`);
  return (t) => {
    const 프때 = 펑(t, s.ev[0] - .1, .45), 스 = soft(s.ev[1] - .4, s.ev[1] + .9, t);
    놓기(프, C.x, C.y - 70 + 쉼(t * 1.1) * 5, L(.6, 1, 프때) * L(1, 1.25, soft(s.ev[0], s.ev[1] - .5, t) * .3), 0, 프때 * (1 - 스));
    놓기(이름, C.x, C.y + 150, 1, 0, 프때 * (1 - 스));
    const 밀 = soft(s.ev[1], s.t1, t); 놓기(카, C.x - 밀 * 30, C.y + 쉼(t * .6) * 6, 1 + 밀 * .12, 쉼(t * .45) * .5, 스); 카.style.clipPath = `inset(0 0 ${((1 - 스) * 100).toFixed(1)}% 0)`;
    놓기(선, C.x, C.y - 220 + 440 * 스, 1, 0, 스 > 0 && 스 < 1 ? 1 : 0);
    const kk = soft(s.ev[2], s.ev[2] + .3, t); 테1.style.opacity = kk; 테1.style.transform = `scale(${L(1.2, 1, kk).toFixed(3)})`;
    const kx = 펑(t, s.ev[3]); 놓기(x1, C.x + 420, C.y + 180, L(.4, 1, kx), 0, kx);
  };
};

/* 22. 당황해서 누른다 · 링크 겉과 속이 다르다 */
장면[22] = (뿌, s) => {
  const 카 = 사진(뿌, '08', 760);
  const 링테 = 테두리(카, [72, 392, 372, 620], '#5ee1ff');
  const 주소 = ['pageaitve-update7239.info', 'communitybusinessmanagers.com', 'system.assistance-page.com'].map((u) => 박스('', 820, 96, 뿌, `<div style="width:100%;height:100%;border-radius:20px;background:#0f1424;border:2px solid #ff3b4f;display:flex;align-items:center;gap:16px;padding:0 26px;font-size:34px;font-weight:600;color:#fff;box-shadow:0 20px 50px rgba(255,59,79,.35)">${아이콘('링크', 40, '#ff6b78', 2.4)}<span style="color:#ff8a94">${u}</span></div>`));
  const 겉 = 박스('', 820, 96, 뿌, `<div style="width:100%;height:100%;border-radius:20px;background:#fff;color:#111;display:flex;align-items:center;gap:16px;padding:0 26px;font-size:34px;font-weight:700;box-shadow:0 20px 50px rgba(0,0,0,.35)">${아이콘('링크', 40, '#1877f2', 2.4)}Meta Business Help Center</div>`);
  const 커 = 커서(뿌); const 물 = 물결(뿌);
  const 글리치 = 박스('', W, H, 뿌); 글리치.style.background = 'repeating-linear-gradient(0deg,rgba(255,59,79,.0) 0 6px,rgba(94,225,255,.18) 6px 8px)';
  return (t) => {
    const 당 = 흔들(t, s.ev[0], 1.3, .5);
    const 링 = soft(s.ev[1] - .2, s.ev[1] + .7, t), 뒤집 = soft(s.ev[2] + .1, s.ev[2] + .5, t);
    놓기(카, C.x + 당 * 3, C.y - 링 * 40, L(1, 1.05, 링), 당 * .3, 1 - 뒤집 * .85);
    카.카메라(L(380, 212, 링), L(+카.dataset.h / 2, 483, 링), L(1, 1.45, 링));
    링테.style.opacity = (soft(s.ev[1] + .4, s.ev[1] + .8, t) * (1 - 뒤집)).toFixed(3);
    // 클릭 → 겉(제목) 카드가 뒤집혀 속(진짜 주소)
    const 클 = s.ev[2];
    놓기(겉, C.x, C.y + 330, 1, 0, soft(클 - .6, 클 - .3, t) * (1 - 뒤집)); 겉.style.transform += ` rotateX(${(뒤집 * 90).toFixed(1)}deg)`;
    주소.forEach((e, i) => { const a = 클 + .35 + i * .95; const k = soft(a, a + .4, t); 놓기(e, C.x, C.y - 160 + i * 130, 1, 0, k); e.style.transform += ` rotateX(${((1 - k) * -90).toFixed(1)}deg)`; });
    놓기(커, L(C.x + 360, C.x + 140, soft(클 - .9, 클, t)), C.y + 350, t > 클 && t < 클 + .12 ? .85 : 1, 0, soft(클 - 1, 클 - .7, t) * (1 - soft(클 + .3, 클 + .6, t)));
    물결그리기(물, t, 클, C.x + 140, C.y + 340);
    const g = t > s.ev[3] && t < s.ev[3] + .45 ? 1 : 0; 보임(글리치, g * (.5 + .5 * Math.sin(t * 90)));
    if (g) 주소.forEach((e, i) => { e.style.transform += ` translateX(${(Math.sin(t * 120 + i) * 10).toFixed(1)}px)`; });
  };
};

/* 23. 안 당하는 법 = 대조하지 말고 아예 열지 마 */
장면[23] = (뿌, s) => {
  const 카 = 사진(뿌, '07', 680);
  const 돋 = 박스('', 200, 200, 뿌, 아이콘('돋보기', 200, '#fff', 2));
  const xx = 박스('', 160, 160, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#ff3b4f;display:flex;align-items:center;justify-content:center">${아이콘('엑스', 96, '#fff', 3.2)}</div>`);
  const 방 = 박스('', 380, 380, 뿌, `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 40px rgba(94,225,255,.6))">${아이콘('방패', 380, '#5ee1ff', 1.6)}</div>`);
  const 날 = [...Array(6).keys()].map((i) => 아이콘알(뿌, i % 2 ? '메일' : '경고', 120, i % 2 ? 'rgba(61,125,255,.85)' : 'rgba(255,59,79,.85)'));
  const 체 = 박스('', 220, 220, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#2fbf71;display:flex;align-items:center;justify-content:center;box-shadow:0 0 60px rgba(47,191,113,.6)">${아이콘('체크', 140, '#fff', 3.4)}</div>`);
  return (t) => {
    const 방때 = soft(s.ev[2] - 1.2, s.ev[2] - .4, t);
    놓기(카, C.x - 60, C.y, 1, 0, 1 - 방때);
    const 대 = soft(s.ev[0] - .2, s.ev[0] + .3, t) * (1 - soft(s.ev[1] + .3, s.ev[1] + .7, t));
    const 왔 = Math.sin((t - s.ev[0]) * 2.4);
    놓기(돋, C.x - 60 + 왔 * 240, C.y - 40 + Math.cos((t - s.ev[0]) * 1.7) * 120, 1, 0, 대);
    const kx = 펑(t, s.ev[1]); 놓기(xx, C.x - 60 + 왔 * 240 + 60, C.y + 40, L(.4, 1, kx), 0, kx * (1 - soft(s.ev[1] + .5, s.ev[1] + .9, t)));
    놓기(방, C.x - 120, C.y, L(.8, 1, 방때) + 쉼(t * 2) * .01, 0, 방때 * (1 - soft(s.ev[4] - .3, s.ev[4] + .2, t) * .6));
    // 날아오는 것: 앞 둘은 효과음 시각에 방패에 닿음 · 나머지는 그 사이사이
    const 닿 = [s.ev[2], s.ev[3], s.ev[2] + .7, s.ev[3] + .8, s.ev[2] + 1.4, s.ev[3] + 1.6];
    날.forEach((e, i) => {
      const a = 닿[i]; const 옴 = p(a - .7, a, t), 튕 = Math.max(0, t - a);
      const y0 = C.y - 200 + (i % 3) * 200;
      const x = 튕 > 0 ? C.x - 120 + 200 + 튕 * 900 : L(1950, C.x + 80, io(옴));
      const y = 튕 > 0 ? y0 - 튕 * (i % 2 ? 600 : -500) : y0;
      놓기(e, x, y, 1, 튕 * 400, (t > a - .7 ? 1 : 0) * (1 - soft(a + .3, a + .7, t)) * 방때);
    });
    const kc = 펑(t, s.ev[4], .4); 놓기(체, C.x - 120, C.y, L(.3, 1, kc), 0, kc);
  };
};
장면[24] = 장카드(3, '저작권 소명 메일', '#ffd166', '#ff9f1c');

/* 25. 소명 링크 → 입력 폼 */
장면[25] = (뿌, s) => {
  const 메 = 박스('', 760, 300, 뿌, `<div class="창" style="width:760px;height:300px;padding:34px;display:flex;flex-direction:column;gap:18px"><div style="font-size:30px;font-weight:700">저작권 위반 신고 접수 안내</div><div style="height:14px;width:90%;border-radius:7px;background:#e3e6ec"></div><div style="height:14px;width:70%;border-radius:7px;background:#e3e6ec"></div><div style="margin-top:auto;align-self:flex-start;padding:16px 30px;border-radius:14px;background:#1877f2;color:#fff;font-size:26px;font-weight:700">이의 제기(소명)하기</div></div>`);
  재현표(메);
  const 폼 = 창틀(뿌, 720, 640, '저작권 위반 소명서');
  재현표(폼);
  const 칸들 = [['이름', '김사장'], ['연락처', '010-1234-5678'], ['아이디', 'kim.sajang77'], ['비밀번호', '●●●●●●●●●●'], ['소명 사유', '제 사진을 직접 찍었습니다']];
  폼.속.innerHTML = '<div style="height:26px"></div>' + 칸들.map(([a]) => `<div class="칸"><b>${a}</b><span></span></div>`).join('') + '<div class="단추">제출하기</div>';
  const 칸 = [...폼.속.querySelectorAll('.칸')], 단 = 폼.속.querySelector('.단추');
  const 커 = 커서(뿌); const 물 = 물결(뿌);
  const c = 컷(뿌, '12', 600);
  return (t) => {
    const 폼때 = soft(s.ev[1] - .3, s.ev[1] + .2, t), 둘 = soft(s.ev[3] - .3, s.ev[3] + .3, t);
    놓기(메, C.x, C.y, L(.96, 1, 펑(t, s.t0, .5)), 0, 1 - 폼때);
    놓기(커, L(C.x + 300, C.x - 160, soft(s.ev[0] - .8, s.ev[0], t)), C.y + 95, t > s.ev[0] && t < s.ev[0] + .12 ? .85 : 1, 0, 1 - 폼때);
    물결그리기(물, t, s.ev[0], C.x - 170, C.y + 85);
    놓기(폼, C.x - 둘 * 300, C.y, L(.94, 1, 폼때) * L(1, .92, 둘), 0, 폼때);
    // 칸 채우기: 이름·연락처는 폼 열리고 곧 · 아이디·비번은 타자 소리에 · 사유는 그 뒤
    const 시작 = [s.ev[1] + .5, s.ev[1] + 1.4, s.ev[2], s.ev[2] + .9, s.ev[2] + 1.7];
    칸.forEach((e, i) => { const 글 = 칸들[i][1]; const n = Math.floor(soft(시작[i], 시작[i] + .8, t) * 글.length); e.querySelector('span').textContent = 글.slice(0, n); e.classList.toggle('켬', t > 시작[i] - .1 && t < 시작[i] + .9); });
    단.style.boxShadow = 둘 > .01 ? `0 0 0 ${(6 + 4 * Math.sin(t * 6)).toFixed(1)}px rgba(255,59,79,.45)` : 'none'; 단.style.background = 둘 > .01 ? '#ff3b4f' : '#3d7dff';
    놓기(c, C.x + 380, C.y, L(.9, 1, 둘), 0, 둘); c.움직(t, s.ev[3], s.t1, 1, [1.04, 1.14], [.5, .6]);
  };
};

/* 26. 실제 원격 사례 — 비번 바꾸고 이메일까지 */
장면[26] = (뿌, s) => {
  const a = 컷(뿌, '12', 620), b = 컷(뿌, '13', 620);
  const 카 = 박스('', 760, 430, 뿌, `<div class="창" style="width:760px;height:430px;padding:30px 34px;display:flex;flex-direction:column;gap:14px;font-size:28px"><div style="font-size:30px;font-weight:800;display:flex;align-items:center;gap:12px">${아이콘('사람', 40, '#111', 2.4)}계정 정보</div>
  <div class="행" style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:2px solid #eef0f4"><b>아이디</b><span>kim.sajang77</span></div>
  <div class="행 비" style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:2px solid #eef0f4"><b>비밀번호</b><span class="값">●●●●●●●●●●</span></div>
  <div class="행 메" style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:2px solid #eef0f4;overflow:hidden"><b>이메일</b><span class="값" style="position:relative;display:inline-block;width:420px;height:36px;text-align:right"><i class="옛" style="font-style:normal;position:absolute;right:0">kim.sajang77@naver.com</i><i class="새" style="font-style:normal;position:absolute;right:0;color:#ff3b4f;font-weight:700">secure-verify.mt@proton.me</i></span></div>
  <div class="행" style="display:flex;justify-content:space-between;padding:14px 0"><b>로그인</b><span class="로그">허용</span></div></div>`);
  재현표(카);
  const 비 = 카.querySelector('.비 .값'), 옛 = 카.querySelector('.옛'), 새 = 카.querySelector('.새'), 로그 = 카.querySelector('.로그'), 메행 = 카.querySelector('.메');
  const c14 = 컷(뿌, '14', 1180);
  return (t) => {
    const 카때 = soft(s.ev[1] - .6, s.ev[1] - .1, t), 끝때 = 인(t, s.ev[4] - .2, .45);
    const 회 = soft(s.ev[0], s.ev[0] + .8, t);
    놓기(a, C.x - 320, C.y, 1, 0, 1 - 카때); 놓기(b, C.x + 320, C.y, 1, 0, (1 - 카때) * 인(t, s.t0 + 1.5, .5));
    a.움직(t, s.t0, s.ev[1], 1); b.움직(t, s.t0, s.ev[1], -1);
    [a, b].forEach((e) => { e.img.style.filter = 회 > 0 ? `sepia(${(회 * .35).toFixed(2)}) saturate(${L(1, .8, 회).toFixed(2)})` : 'none'; });
    놓기(카, C.x, C.y, L(.95, 1, 카때), 0, 카때 * (1 - 끝때));
    const 바 = soft(s.ev[1], s.ev[1] + .6, t); 비.style.color = 바 > .5 ? '#ff3b4f' : '#111'; 비.textContent = 바 > 0 && 바 < 1 ? '●●●●●●●●●●'.split('').map((c, i) => ((i * 7 + Math.floor(t * 30)) % 3 ? '●' : '○')).join('') : '●●●●●●●●●●';
    const 연 = soft(s.ev[2], s.ev[2] + .6, t); 옛.style.transform = `translateY(${(-40 * 연).toFixed(1)}px)`; 옛.style.opacity = 1 - 연; 새.style.transform = `translateY(${(40 * (1 - 연)).toFixed(1)}px)`; 새.style.opacity = 연;
    const 삭 = soft(s.ev[3], s.ev[3] + .4, t); 메행.style.background = 삭 > 0 ? `rgba(255,59,79,${(.12 * 삭).toFixed(3)})` : 'transparent';
    로그.textContent = t > s.ev[4] - .3 ? '차단됨' : '허용'; 로그.style.color = t > s.ev[4] - .3 ? '#ff3b4f' : '#2fbf71'; 로그.style.fontWeight = 800;
    놓기(c14, C.x, C.y, L(.94, 1, 끝때), 0, 끝때); c14.움직(t, s.ev[4] - .3, s.t1 + 1, 1, [1.03, 1.1]);
  };
};

/* 27. 내 카드로 광고비 · 이상한 스팸 광고 */
장면[27] = (뿌, s) => {
  const c = 컷(뿌, '15', 1080);
  const 결 = ['META*ADS 승인 482,300원', 'META*ADS 승인 1,200,000원', 'META*ADS 승인 736,900원', 'META*ADS 승인 1,200,000원'].map((g) => 알림(뿌, '카드', '카드 승인', g, '방금', '#e5383b'));
  결.forEach((e) => { e.dataset.w = 430; e.style.width = '430px'; });
  const 타 = [...Array(9).keys()].map((i) => { const e = 박스('타일', 230, 160, 뿌, `<div style="position:absolute;inset:0;background:linear-gradient(${i * 40}deg,hsl(${(i * 47) % 360} 70% 55%),hsl(${(i * 47 + 90) % 360} 70% 35%));filter:blur(14px);transform:scale(1.3)"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;filter:blur(3px);opacity:.9">${아이콘(['돈', '경고', '재생', '지구', '카드', '사람', '돈', '재생', '경고'][i], 80, '#fff', 2.4)}</div>`); return e; });
  return (t) => {
    const 타때 = soft(s.ev[2] - .4, s.ev[2] + .1, t);
    놓기(c, C.x - 120 * (1 - 타때), C.y, 1, 0, 1 - 타때 * .85); c.움직(t, s.t0, s.t1, 1, [1.03, 1.1]); 흐림(c, 타때 * 10);
    const 시 = [s.ev[0], s.ev[1], s.ev[1] + .8, s.ev[1] + 1.6];
    결.forEach((e, i) => { const k = 펑(t, 시[i]); const 아래 = 시.filter((x, j) => j > i && t > x).length; 놓기(e, C.x + 470, C.y - 260 + 아래 * 108 + L(-30, 0, k), L(.94, 1, k), 0, k * (1 - 타때)); });
    타.forEach((e, i) => { const k = 펑(t, s.ev[2] + i * .08); const 맥 = t > s.ev[3] ? 1 + .04 * Math.sin((t - s.ev[3]) * 12 + i) : 1; 놓기(e, C.x - 260 + (i % 3) * 260, C.y - 190 + Math.floor(i / 3) * 190, L(.6, 1, k) * 맥, 0, k); });
  };
};

/* 28. 카드사 끝난 6시 이후 · 새벽을 노린다 */
장면[28] = (뿌, s) => {
  const 판 = 박스('원판', 520, 520, 뿌, [...Array(12).keys()].map((i) => `<i style="position:absolute;left:254px;top:22px;width:12px;height:${i % 3 ? 22 : 40}px;border-radius:6px;background:rgba(255,255,255,${i % 3 ? .35 : .8});transform-origin:6px 238px;transform:rotate(${i * 30}deg)"></i>`).join(''));
  const 시침 = 박스('바늘', 18, 150, 뿌), 분침 = 박스('바늘', 10, 210, 뿌); 분침.style.background = '#ffd166';
  const 가게 = 박스('', 330, 330, 뿌, `<div style="width:100%;height:100%;border-radius:30px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-size:30px;font-weight:700">${아이콘('전화', 110, '#fff', 2)}<span>카드사 고객센터</span></div>`);
  const 잠 = 박스('', 130, 130, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#ff3b4f;display:flex;align-items:center;justify-content:center">${아이콘('자물쇠', 74, '#fff', 2.6)}</div>`);
  const 달 = 박스('', 160, 160, 뿌, '<svg width="160" height="160" viewBox="0 0 32 32"><path d="M21 4a12 12 0 1 0 7 19A10 10 0 0 1 21 4z" fill="#ffd166"/></svg>');
  return (t) => {
    const 시각 = L(L(15.5, 18, soft(s.ev[1] - .8, s.ev[1], t)), 27, soft(s.ev[3] - .9, s.ev[3], t)); // 27 = 새벽 3시
    const 옆 = soft(s.ev[1] + .2, s.ev[1] + .7, t) * (1 - soft(s.ev[3] - 1, s.ev[3] - .4, t));
    const cx = C.x - 260 * 옆, cy = C.y;
    놓기(판, cx, cy, L(.94, 1, 펑(t, s.t0, .5)));
    const 붉 = t > s.ev[2] ? .5 + .5 * Math.sin((t - s.ev[2]) * 6) : 0; 판.style.boxShadow = `0 30px 80px rgba(0,0,0,.5),0 0 ${(80 * 붉).toFixed(0)}px rgba(255,59,79,${(.6 * 붉).toFixed(2)})`;
    놓기(시침, cx, cy - 75, 1, (시각 % 12) * 30); 시침.style.transformOrigin = '50% 100%';
    놓기(분침, cx, cy - 105, 1, (시각 % 1) * 360); 분침.style.transformOrigin = '50% 100%';
    놓기(가게, C.x + 300, C.y, 1, 0, 옆); const kz = 펑(t, s.ev[1] + .6); 놓기(잠, C.x + 420, C.y - 120, L(.4, 1, kz), 0, kz * 옆);
    const kd = 펑(t, s.ev[3]); 놓기(달, cx + 320, cy - 230, L(.4, 1, kd), -15, kd);
  };
};

/* 29. 당해 보면 머리가 하얘진다 */
장면[29] = (뿌, s) => {
  const 창 = 창틀(뿌, 720, 520, 'Facebook 로그인'); 재현표(창);
  창.속.innerHTML = `<div style="height:40px"></div><div class="칸"><b>아이디</b><span>kim.sajang77</span></div><div class="칸 비"><b>비밀번호</b><span class="커"></span></div><div class="단추" style="background:#1877f2">로그인</div><div style="text-align:center;font-size:22px;color:#ff3b4f;font-weight:700" class="틀">비밀번호가 일치하지 않습니다</div>`;
  const 커 = 창.속.querySelector('.커'), 틀 = 창.속.querySelector('.틀');
  const 흰 = 박스('', W, H, 뿌); 흰.style.background = '#fff';
  return (t) => {
    const 번 = 인(t, s.ev[0] - .05, .12) * (1 - soft(s.ev[0] + .2, s.ev[0] + 2.4, t));
    보임(흰, Math.max(번, 인(t, s.t0, .01) * (1 - soft(s.t0, s.ev[0] - .3, t)) * 0));
    놓기(창, C.x, C.y, L(.9, 1, soft(s.t0, s.t0 + .8, t)), 0, 1);
    커.textContent = Math.floor(t * 2.2) % 2 ? '|' : ''; 커.style.color = '#1877f2';
    틀.style.opacity = t > s.ev[1] - .5 ? (.6 + .4 * Math.sin(t * 7)).toFixed(2) : 0;
  };
};

/* 30. 원격 컨설팅 중 갑자기 — 모르는 광고 new */
장면[30] = (뿌, s) => {
  const c16 = 컷(뿌, '16', 1180), c17 = 컷(뿌, '17', 1180);
  const 선 = 박스('', 1180, 6, 뿌); 선.style.background = '#fff'; 선.style.boxShadow = '0 0 40px #fff';
  const 카 = 사진(뿌, '14', 900); const 테 = 테두리(카, [18, 54, 290, 96]);
  return (t) => {
    const 꺼 = soft(s.ev[1], s.ev[1] + .35, t);
    놓기(c16, C.x, C.y, 1, 0, 1 - 꺼 * 0); c16.움직(t, s.t0, s.ev[1], 1, [1.03, 1.1 + soft(s.ev[0], s.ev[0] + 2, t) * .04]);
    c16.style.transform += ` scaleY(${L(1, .004, 꺼).toFixed(4)})`; 보임(c16, 꺼 < .999 ? 1 : 0);
    놓기(선, C.x, C.y, L(1, .02, soft(s.ev[1] + .3, s.ev[1] + .6, t)), 0, 꺼 > .9 ? 1 - soft(s.ev[1] + .4, s.ev[1] + .7, t) : 0);
    const 병때 = 인(t, s.ev[1] + .8, .5) * (1 - soft(s.ev[2] - .3, s.ev[2], t));
    놓기(c17, C.x, C.y, L(.95, 1, 병때), 0, 병때); c17.움직(t, s.ev[1] + .8, s.ev[2], -1, [1.03, 1.12]);
    const 카때 = soft(s.ev[2] - .2, s.ev[2] + .3, t);
    놓기(카, C.x, C.y, L(.96, 1.02, soft(s.ev[2], s.t1, t)), 0, 카때);
    const 줌k = soft(s.ev[3] - .3, s.ev[3] + .5, t); 카.카메라(L(450, 260, 줌k), L(+카.dataset.h / 2, 150, 줌k), L(1, 1.5, 줌k));
    const kk = soft(s.ev[3], s.ev[3] + .3, t); 테.style.opacity = (kk * (.75 + .25 * Math.sin(t * 8))).toFixed(3);
  };
};

/* 31. 일예산 120만 원 · 베트남어 광고 · 외국 회사 페이지 */
장면[31] = (뿌, s) => {
  const 판 = 박스('', 820, 470, 뿌, `<div class="창" style="width:820px;height:470px;padding:30px 36px;display:flex;flex-direction:column;gap:6px;font-size:28px">
   <div style="font-size:24px;font-weight:700;color:#1877f2;margin-bottom:8px">광고 관리자</div>
   <div style="display:flex;justify-content:space-between;padding:16px 0;border-bottom:2px solid #eef0f4"><b>광고 이름</b><span style="font-weight:700">new</span></div>
   <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:2px solid #eef0f4"><b>일 예산</b><span class="예" style="font-size:52px;font-weight:900;color:#ff3b4f;font-variant-numeric:tabular-nums">₩0</span></div>
   <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0"><b>광고 문구</b><span class="베" style="padding:8px 18px;border-radius:12px;background:#fff3cd;font-weight:700">Ưu đãi lớn! Đăng ký ngay hôm nay</span></div></div>`);
  재현표(판); const 예 = 판.querySelector('.예'), 베 = 판.querySelector('.베');
  const 페 = 사진(뿌, '15', 820);
  const 빛 = 박스('', 1000, 1000, 뿌); 빛.style.background = 'radial-gradient(circle,rgba(255,255,255,.22),transparent 60%)';
  const 경 = 아이콘알(뿌, '경고', 150, '#ff3b4f');
  return (t) => {
    const 페때 = soft(s.ev[3] - .4, s.ev[3] + .1, t);
    놓기(판, C.x, C.y, L(.95, 1, 펑(t, s.ev[0] - .2, .5)), 0, 1 - 페때);
    const 돈 = soft(s.ev[1], s.ev[1] + 1.1, t); 예.textContent = '₩' + 숫자(1200000 * 돈);
    베.style.opacity = soft(s.ev[2], s.ev[2] + .3, t); 베.style.transform = `scale(${L(.8, 1, soft(s.ev[2], s.ev[2] + .3, t)).toFixed(3)})`;
    놓기(페, C.x, C.y - 30, L(.94, 1.06, soft(s.ev[3], s.t1, t)), 0, 페때);
    놓기(빛, C.x, C.y - 30, 1, 0, 페때 * (.7 + .3 * Math.sin(t * 2)));
    const ke = 펑(t, s.ev[4]); 놓기(경, C.x + 380, C.y + 170, L(.4, 1, ke), 0, ke);
  };
};

/* 32. 2시간 동안 끄고 켜기 씨름 */
장면[32] = (뿌, s) => {
  const 스 = 박스('스위치', 300, 100, 뿌, '<i></i>'); const 알 = 스.querySelector('i');
  const 나 = 박스('', 260, 70, 뿌, '<div style="font-size:34px;font-weight:800;text-align:center">광고 켜짐</div>');
  const 해 = 아이콘알(뿌, '사람', 150, 'rgba(255,59,79,.85)'), 대 = 아이콘알(뿌, '사람', 150, 'rgba(61,125,255,.85)');
  const 시 = 박스('', 160, 160, 뿌, 아이콘('시계', 160, '#ffd166', 2));
  return (t) => {
    // 켜짐(해커) ↔ 꺼짐(대표): 효과음 시각마다 바뀜, 사이사이 더 빠르게
    const 바뀜 = [s.ev[0], s.ev[1], s.ev[2], s.ev[2] + .35, s.ev[2] + .65].filter((x) => t >= x).length;
    const 켬 = 바뀜 % 2 === 0;
    const 최근 = [s.ev[0], s.ev[1], s.ev[2], s.ev[2] + .35, s.ev[2] + .65].filter((x) => t >= x).pop() ?? -9;
    const k = soft(최근, 최근 + .14, t); const 위치 = 켬 ? L(8, 208, k) : L(208, 8, k);
    알.style.left = (t < s.ev[0] ? 208 : 위치) + 'px';
    스.style.background = (t < s.ev[0] || 켬) ? '#2fbf71' : '#3a3a44';
    놓기(스, C.x, C.y, 1.6); 놓기(나, C.x, C.y + 150, 1, 0, 1); 나.firstChild.textContent = (t < s.ev[0] || 켬) ? '광고 켜짐' : '광고 꺼짐';
    const 나감 = soft(s.ev[3], s.ev[3] + .6, t);
    놓기(해, C.x + 420 + 나감 * 300, C.y, 1, 0, 1 - 나감); 놓기(대, C.x - 420, C.y, 1, 0, 1);
    const 빨 = soft(s.ev[4], s.t1, t); 놓기(시, C.x, C.y - 240, 1, 빨 * 720, soft(s.ev[4] - .2, s.ev[4] + .2, t));
  };
};

/* 33. 결국 영구 정지 · 헬프센터 연결 안 됨 */
장면[33] = (뿌, s) => {
  const 카 = 사진(뿌, '16', 860);
  const c = 컷(뿌, '18', 1180);
  const 연 = 박스('', 460, 110, 뿌, '<div style="width:100%;height:100%;border-radius:999px;background:rgba(10,14,28,.82);display:flex;align-items:center;justify-content:center;gap:16px;font-size:36px;font-weight:700"><span class="점들">연결 중</span></div>');
  const 점 = 연.querySelector('.점들');
  const x = 박스('', 140, 140, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#ff3b4f;display:flex;align-items:center;justify-content:center">${아이콘('엑스', 80, '#fff', 3.2)}</div>`);
  return (t) => {
    const 쾅 = 흔들(t, s.ev[0], 2.4, .45);
    const 컷때 = soft(s.ev[1] - .5, s.ev[1], t);
    놓기(카, C.x + 쾅 * 4, C.y, L(1, 1.25, soft(s.ev[0] - .4, s.ev[0], t)) - 컷때 * .1, 0, 1 - 컷때);
    카.카메라(418, L(228, 150, soft(s.ev[0] - .4, s.ev[0], t)), L(1, 1.3, soft(s.ev[0] - .4, s.ev[0], t)));
    놓기(c, C.x, C.y, L(.95, 1, 컷때), 0, 컷때); c.움직(t, s.ev[1] - .5, s.t1, 1, [1.03, 1.12]);
    const 끝 = soft(s.ev[3], s.ev[3] + .8, t); c.img.style.filter = 끝 > 0 ? `grayscale(${끝.toFixed(2)}) brightness(${L(1, .7, 끝).toFixed(2)})` : 'none';
    점.textContent = '연결 중' + '.'.repeat(1 + Math.floor(t * 2.5) % 3);
    놓기(연, C.x, C.y + 260, 1, 0, 컷때 * (1 - soft(s.ev[2], s.ev[2] + .3, t)));
    const kx = 펑(t, s.ev[2]); 놓기(x, C.x, C.y + 260, L(.4, 1, kx), 0, kx * (1 - 끝));
  };
};
