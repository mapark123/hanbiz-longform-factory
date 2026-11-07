// 장면 34~46 : 네 번째(광고 대행 사기) · 정리(밝은 화면)
const 진한 = '#1d1d1f', 연판 = 'rgba(0,0,0,.06)';
장면[34] = (뿌, s) => {
  const 기본 = 장카드(4, '광고 대행 사기', '#c49bff', '#7c3aed')(뿌, s);
  const 폰알 = 박스('', 150, 150, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#2fbf71;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 14px rgba(47,191,113,.25)">${아이콘('전화', 80, '#fff', 2.6)}</div>`);
  return (t) => { 기본(t); const k = 펑(t, s.ev[1] - .1); 놓기(폰알, C.x + 330, C.y - 230, L(.4, 1, k), 흔들(t, s.ev[1], 12, 1.2), k); };
};

/* 35. "메타 공식 파트너사입니다" 전화 */
장면[35] = (뿌, s) => {
  const c19 = 컷(뿌, '19', 1180), c20 = 컷(뿌, '20', 600);
  const ph = 폰(뿌, `<div class="통화"><div class="번" style="font-size:32px">메타 공식 파트너</div><div class="상">휴대전화 · 수신 전화</div><div style="position:absolute;bottom:90px;left:0;right:0;display:flex;justify-content:space-around"><span style="width:80px;height:80px;border-radius:50%;background:#ff3b30;display:flex;align-items:center;justify-content:center">${아이콘('전화', 38, '#fff', 2.6)}</span><span class="받" style="width:80px;height:80px;border-radius:50%;background:#34c759;display:flex;align-items:center;justify-content:center">${아이콘('전화', 38, '#fff', 2.6)}</span></div></div>`, true);
  재현표(ph);
  const 실 = 박스('', 10, 10, 뿌); 실.style.background = 'linear-gradient(90deg,#c49bff,#ffd166)'; 실.style.borderRadius = '5px'; 실.style.boxShadow = '0 0 24px #c49bff';
  const 알 = [0, 1, 2, 3].map(() => { const e = 박스('점', 22, 22, 뿌); e.style.background = '#ffd166'; e.style.boxShadow = '0 0 16px #ffd166'; return e; });
  return (t) => {
    const 폰때 = soft(s.ev[1] - .3, s.ev[1] + .2, t), 둘 = soft(s.ev[2] - .3, s.ev[2] + .3, t);
    // 처음: 19 가운데 → 수신: 폰 왼쪽 · 19 오른쪽 → 파트너: 19 왼쪽 · 20 오른쪽
    const x19 = L(L(C.x, C.x + 330, 폰때), C.x - 320, 둘), w19 = L(L(1, .51, 폰때), .51, 둘);
    놓기(c19, x19, C.y, w19, 0, 1); c19.움직(t, s.t0, s.t1, 1, [1.03, 1.12], [.5, .4]);
    놓기(ph, C.x - 330, C.y + 8, .86, 흔들(t, s.ev[1], 2.5, 1) + 흔들(t, s.ev[1] + 1.1, 2.5, 1), 폰때 * (1 - 둘));
    놓기(c20, C.x + 330, C.y, L(.9, 1, 둘), 0, 둘); c20.움직(t, s.ev[2], s.t1, -1, [1.03, 1.12]);
    const 라 = soft(s.ev[3] - .2, s.ev[3] + .6, t);
    실.dataset.w = 200; 실.dataset.h = 10; 실.style.width = '200px'; 놓기(실, C.x, C.y + 210, 1, 0, 라); 실.style.transform += ` scaleX(${라.toFixed(3)})`;
    알.forEach((e, i) => { const x = ((t * .6 + i / 4) % 1); 놓기(e, C.x - 100 + 200 * x, C.y + 210, 1, 0, 라 * Math.sin(x * Math.PI)); });
  };
};

/* 36. 3개월~1년치 선납 · 800만~1,000만 원 */
장면[36] = (뿌, s) => {
  const 달 = 아이콘알(뿌, '달력', 220, 'rgba(255,255,255,.1)');
  const 개 = 박스('', 520, 90, 뿌, '<div style="display:flex;gap:14px;justify-content:center;font-size:44px;font-weight:800"><span class="a">3개월</span><span style="opacity:.5">~</span><span class="b" style="color:#ffd166">1년치</span></div>');
  const 수 = 큰글(뿌, '800만 원', 220, '#ffd166', 900);
  const 동 = [...Array(10).keys()].map(() => 박스('', 90, 90, 뿌, `<div style="width:90px;height:90px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3b0,#f5b301 60%,#b7791f);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#8a5a00">₩</div>`));
  return (t) => {
    const 수때 = soft(s.ev[1] - .3, s.ev[1] + .2, t);
    놓기(달, C.x, C.y - 70 - 수때 * 160, L(.94, 1, 펑(t, s.t0, .4)) * L(1, .7, 수때), 0, 1 - 수때 * .2);
    놓기(개, C.x, C.y + 140 - 수때 * 140, 1, 0, 인(t, s.t0 + .8, .4) * (1 - 수때 * .2));
    const 값 = L(800, 1000, soft(s.ev[1] + .2, s.ev[1] + 1.6, t)); 수.textContent = `${숫자(값)}만 원`;
    놓기(수, C.x, C.y + 150, L(.9, 1, 수때) + 인(t, s.ev[2], .1) * .05 - soft(s.ev[2] + .1, s.ev[2] + .5, t) * .05, 0, 수때);
    동.forEach((e, i) => { const a = s.ev[0] + i * .09; const f = p(a, a + .9, t); 놓기(e, C.x - 500 + i * 110, L(-80, C.y + 380, io(f)), 1, f * 200, f > 0 ? (1 - soft(a + .9, a + 1.6, t)) * Math.min(1, f * 3) : 0); });
  };
};

/* 37. 스마트스토어 열면 하루 20~30통 */
장면[37] = (뿌, s) => {
  const ph = 폰(뿌, `<div class="잠금" style="background:radial-gradient(120% 80% at 50% 0%,#3a3f55 0%,#14161f 60%,#06080f 100%)"><div class="날">스마트스토어 오픈 첫날</div><div class="시">11:02</div><div class="부" style="position:absolute;left:14px;right:14px;top:250px"></div></div>`, true);
  재현표(ph); const 부 = ph.querySelector('.부');
  부.innerHTML = `<div class="알림" style="position:relative"><div class="앱" style="background:#34c759">${아이콘('전화', 24, '#fff', 2.4)}</div><div class="알속"><div class="알머리"><b>부재중 전화</b><span>지금</span></div><div class="알본문 수">1통</div></div></div>`;
  const 수 = 부.querySelector('.수');
  const 배지 = 박스('', 170, 170, 뿌, '<div style="width:100%;height:100%;border-radius:50%;background:#ff3b30;color:#fff;font-size:76px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(255,59,48,.5)"><span>1</span></div>');
  const 배수 = 배지.querySelector('span');
  return (t) => {
    const n = t < s.ev[0] ? 0 : Math.max(1, Math.round(L(1, 30, soft(s.ev[1] - .3, s.ev[1] + 1.2, t))));
    수.textContent = `${n}통`; 배수.textContent = n;
    const 떨 = n > 1 && t < s.ev[1] + 1.2 ? Math.sin(t * 60) * 1.2 : 흔들(t, s.ev[0], 1.4);
    놓기(ph, C.x, C.y + 8, .9 * L(.94, 1, 펑(t, s.t0, .45)), 떨);
    부.style.opacity = t > s.ev[0] ? 1 : 0;
    const k = 펑(t, s.ev[0]); 놓기(배지, C.x + 210, C.y - 330, L(.4, 1, k) * (1 + (n > 1 ? .06 * Math.sin(t * 20) : 0)), 0, k);
  };
};

/* 38. 3~10일 봐주다 잠수 · 컴플레인 때만 반짝 */
장면[38] = (뿌, s) => {
  const 달력 = 박스('', 700, 560, 뿌, `<div class="창" style="width:700px;height:560px;padding:26px 30px"><div style="font-size:30px;font-weight:800;margin-bottom:16px">계약 첫 달</div><div class="날들" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px">${[...Array(28).keys()].map((i) => `<div style="height:62px;border-radius:12px;background:#f2f3f6;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;position:relative">${i + 1}<i style="position:absolute;inset:0;border-radius:12px;background:#2fbf71;opacity:0;display:flex;align-items:center;justify-content:center">${아이콘('체크', 34, '#fff', 3.2)}</i></div>`).join('')}</div></div>`);
  const 칸 = [...달력.querySelectorAll('.날들 i')];
  const 톡 = 박스('', 640, 560, 뿌, `<div class="창" style="width:640px;height:560px;background:#b2c7da;padding:30px 26px;display:flex;flex-direction:column;gap:16px;font-size:26px">
    <div class="말 내" style="align-self:flex-end;background:#fee500;color:#111;padding:14px 18px;border-radius:18px;font-weight:600">대표님, 광고 확인 부탁드려요<sub style="color:#e0a800;font-weight:800;margin-left:8px">1</sub></div>
    <div class="말 내" style="align-self:flex-end;background:#fee500;color:#111;padding:14px 18px;border-radius:18px;font-weight:600">연락이 안 되네요<sub style="color:#e0a800;font-weight:800;margin-left:8px">1</sub></div>
    <div class="말 내" style="align-self:flex-end;background:#fee500;color:#111;padding:14px 18px;border-radius:18px;font-weight:600">???<sub style="color:#e0a800;font-weight:800;margin-left:8px">1</sub></div>
    <div class="말 답" style="align-self:flex-start;background:#fff;color:#111;padding:14px 18px;border-radius:18px;font-weight:600">네~ 확인해 볼게요</div>
    <div class="말 환" style="align-self:flex-end;background:#ff3b4f;color:#fff;padding:14px 18px;border-radius:18px;font-weight:800">환불해 주세요</div></div>`);
  재현표(톡); const 말 = [...톡.querySelectorAll('.말')];
  const c = 컷(뿌, '22', 1180);
  return (t) => {
    const 첫 = 낱말('3일에서', s.t0) ?? s.t0 + 3.5;
    칸.forEach((e, i) => { e.style.opacity = i < 10 ? soft(첫 + i * .2, 첫 + i * .2 + .2, t) : 0; });
    const 톡때 = soft(s.ev[0] + .3, s.ev[0] + .8, t), 컷때 = 인(t, s.ev[2] - .2, .45) * (1 - soft(s.ev[3] - .5, s.ev[3] - .1, t)), 톡2 = soft(s.ev[3] - .4, s.ev[3], t);
    놓기(달력, C.x, C.y, L(.95, 1, 펑(t, s.t0, .5)), L(0, -6, soft(s.ev[0], s.ev[0] + .5, t)), 1 - 톡때);
    놓기(톡, C.x + 쉼(t * .6) * 10, C.y + 쉼(t * .5 + 2) * 8, 1 + soft(s.ev[0], s.t1, t) * .06, 쉼(t * .4) * .5, Math.max(톡때 * (1 - 컷때), 톡2) * (t < s.ev[2] - .2 || t > s.ev[3] - .5 ? 1 : 1 - 컷때));
    말.forEach((e, i) => { const 시 = [s.ev[0] + .9, s.ev[1], s.ev[1] + .5, s.ev[3], s.ev[4]][i]; const k = 펑(t, 시); e.style.opacity = k; e.style.transform = `translateY(${L(18, 0, k).toFixed(1)}px)`; });
    놓기(c, C.x, C.y, L(.95, 1, 컷때), 0, 컷때); c.움직(t, s.ev[2], s.ev[3], 1, [1.03, 1.12]);
  };
};

/* 39. 위약금 조항 · 쓰레드엔 소송·구제 신청 글 */
장면[39] = (뿌, s) => {
  const 종 = 박스('', 620, 780, 뿌, `<div style="width:620px;height:780px;border-radius:16px;background:#fbfaf6;color:#111;box-shadow:0 30px 80px rgba(0,0,0,.45);padding:50px 54px;display:flex;flex-direction:column;gap:18px"><div style="font-size:40px;font-weight:800;text-align:center;margin-bottom:12px">광고 대행 계약서</div>${[...Array(9).keys()].map((i) => i === 5 ? '<div class="조" style="position:relative;font-size:26px;font-weight:800;padding:6px 0">제7조 (위약금)<i style="position:absolute;inset:0;background:rgba(255,214,10,.45);border-radius:4px;clip-path:inset(0 100% 0 0)"></i></div>' : `<div style="height:14px;width:${70 + (i * 13) % 28}%;border-radius:7px;background:#d9dce3"></div>`).join('')}<div class="인" style="margin-top:auto;align-self:flex-end;width:150px;height:150px;border-radius:50%;border:8px solid #e5383b;color:#e5383b;font-size:40px;font-weight:900;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);opacity:0">위약금</div></div>`);
  재현표(종); const 형 = 종.querySelector('.조 i'), 인장 = 종.querySelector('.인');
  const 글 = [...Array(6).keys()].map(() => 박스('글카드', 440, 190, 뿌, '<div class="머"><i></i><b></b></div><div class="줄" style="width:92%"></div><div class="줄" style="width:78%"></div><div class="줄" style="width:60%"></div>'));
  return (t) => {
    const 글때 = soft(s.ev[2] - .5, s.ev[2], t);
    놓기(종, C.x - 글때 * 320, C.y, L(.95, 1, 펑(t, s.t0, .5)) * L(1, .82, 글때), L(0, -4, 글때));
    형.style.clipPath = `inset(0 ${(100 - 100 * soft(s.ev[0], s.ev[0] + .6, t)).toFixed(1)}% 0 0)`;
    const kk = soft(s.ev[1], s.ev[1] + .18, t); 인장.style.opacity = kk; 인장.style.transform = `rotate(-14deg) scale(${L(2, 1, kk).toFixed(3)})`;
    글.forEach((e, i) => { const k = 펑(t, s.ev[2] + i * .22); 놓기(e, C.x + 330 + (i % 2) * 40, C.y - 300 + i * 115, L(.9, 1, k), (i % 2 ? 2 : -2), k); });
  };
};

/* 40. 폐업 → 잠수 → 새 사업자 반복 */
장면[40] = (뿌, s) => {
  const 간 = (이름, 색) => 박스('', 560, 200, 뿌, `<div style="width:100%;height:100%;border-radius:22px;background:${색};display:flex;align-items:center;justify-content:center;gap:18px;font-size:58px;font-weight:900;box-shadow:0 26px 60px rgba(0,0,0,.4)">${아이콘('간판', 70, '#fff', 2.4)}${이름}</div>`);
  const a = 간('○○ 마케팅', '#5b3fd6'), b = 간('△△ 애드', '#2b7fff');
  const 폐 = 박스('', 300, 120, 뿌, '<div style="width:100%;height:100%;border:8px solid #ff3b4f;color:#ff3b4f;border-radius:20px;font-size:64px;font-weight:900;display:flex;align-items:center;justify-content:center;background:rgba(10,10,20,.6)">폐업</div>');
  const 고리 = 박스('', 760, 760, 뿌, '<svg width="760" height="760" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="rgba(196,155,255,.5)" stroke-width="1.2" stroke-dasharray="6 5"/><path d="M50 4 l5 -3 M50 4 l5 3" stroke="#c49bff" stroke-width="1.6" fill="none"/></svg>');
  return (t) => {
    놓기(고리, C.x, C.y, 1, t * 40, .9);
    const 내 = soft(s.ev[0], s.ev[0] + .5, t);
    놓기(a, C.x, C.y + 내 * 260, 1, 내 * 8, (1 - soft(s.ev[0] + .6, s.ev[0] + 1.1, t)) * L(.94, 1, 펑(t, s.t0, .5)));
    const kp = soft(s.ev[0] - .15, s.ev[0], t); 놓기(폐, C.x + 160, C.y - 70 + 내 * 260, L(1.8, 1, kp), -12, kp * (1 - soft(s.ev[0] + .6, s.ev[0] + 1.1, t)));
    const 올 = soft(s.ev[1] - .1, s.ev[1] + .5, t); 놓기(b, C.x, C.y + L(-300, 0, 올), 1, 0, 올);
  };
};

/* 41. 계약서 때문에 법적으로 가도 진다 · 검색하면 사례 수두룩 */
장면[41] = (뿌, s) => {
  const 대 = 박스('', 520, 520, 뿌, `<svg width="520" height="520" viewBox="0 0 100 100"><path d="M50 14v70M30 86h40" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="50" cy="12" r="3.2" fill="#fff"/></svg>`);
  const 보 = 박스('', 520, 14, 뿌); 보.style.background = '#fff'; 보.style.borderRadius = '7px';
  const 접 = [0, 1].map((i) => 박스('', 200, 140, 뿌, `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end"><div style="width:180px;height:4px;background:#fff"></div><div style="margin-top:10px">${아이콘(i ? '사람' : '종이', 80, i ? '#9cc3ff' : '#ffd166', 2.4)}</div></div>`));
  const 검 = 박스('', 820, 100, 뿌, `<div style="width:100%;height:100%;border-radius:999px;background:#fff;color:#111;display:flex;align-items:center;gap:18px;padding:0 34px;font-size:38px;font-weight:700;box-shadow:0 20px 50px rgba(0,0,0,.35)">${아이콘('돋보기', 46, '#03c75a', 2.6)}<span class="글"></span></div>`);
  const 검글 = 검.querySelector('.글');
  const 결 = [...Array(8).keys()].map(() => 박스('글카드', 820, 110, 뿌, '<div class="줄" style="width:55%;height:20px;background:#2f6fe4"></div><div class="줄" style="width:90%"></div>'));
  return (t) => {
    const 검때 = soft(s.ev[2] - .4, s.ev[2], t);
    const 기 = soft(s.ev[0] - .1, s.ev[0] + .6, t) * 16;
    const cx = C.x, cy = C.y - 40;
    놓기(대, cx, cy, 1, 0, 1 - 검때);
    놓기(보, cx, cy - 175, 1, -기, 1 - 검때);
    const r = 250; const 각 = -기 * Math.PI / 180;
    접.forEach((e, i) => { const sx = i ? 1 : -1; 놓기(e, cx + sx * r * Math.cos(각), cy - 175 + sx * r * Math.sin(각) + 75, 1, 0, 1 - 검때); });
    const 회 = soft(s.ev[1], s.ev[1] + .6, t); 접[1].style.filter = `grayscale(${회})`;
    놓기(검, C.x, C.y - 330, 1, 0, 검때); const 말 = '광고 대행 사기'; 검글.textContent = 말.slice(0, Math.floor(soft(s.ev[2], s.ev[2] + .9, t) * 말.length));
    결.forEach((e, i) => { const k = 펑(t, s.ev[3] + i * .1); 놓기(e, C.x, C.y - 200 + i * 125 - soft(s.ev[3] + .6, s.t1, t) * 300, 1, 0, k * 검때); });
  };
};

/* 42. 이 네 가지만 조심하면 된다 (밝은 화면) */
장면[42] = (뿌, s) => {
  const 이름 = ['변호사 메일', '메타인 척 메시지', '저작권 소명 메일', '광고 대행 사기'];
  const 색 = ['#ff5a4f', '#3d5cff', '#ff9f1c', '#7c3aed'];
  const 카 = 이름.map((n, i) => 박스('', 330, 330, 뿌, `<div style="width:100%;height:100%;border-radius:32px;background:#fff;box-shadow:0 24px 60px rgba(20,30,60,.16);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:${진한}"><div style="font-size:120px;font-weight:900;line-height:1;background:linear-gradient(170deg,${색[i]},${색[i]}aa);-webkit-background-clip:text;color:transparent">${i + 1}</div><div style="font-size:30px;font-weight:800">${n}</div><div class="체" style="position:absolute;right:-18px;top:-18px;width:86px;height:86px;border-radius:50%;background:#2fbf71;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 10px 26px rgba(47,191,113,.45)">${아이콘('체크', 52, '#fff', 3.4)}</div></div>`));
  const 방 = 박스('', 420, 420, 뿌, `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 20px 40px rgba(47,191,113,.45))"><svg width="420" height="420" viewBox="0 0 32 32"><path d="M16 3 5 7v8c0 7 4.700 12 11 14 6.300-2 11-7 11-14V7L16 3z" fill="#2fbf71"/><path d="M10.500 16l4 4 7-8" fill="none" stroke="#fff" stroke-width="2.400" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
  return (t) => {
    const 모 = soft(s.ev[4] - .5, s.ev[4] + .2, t);
    카.forEach((e, i) => {
      const k = 펑(t, s.t0 + .3 + i * .15, .45);
      const x = C.x - 555 + i * 370;
      놓기(e, L(x, C.x, 모), C.y, L(.9, 1, k) * L(1, .4, 모), 0, k * (1 - 모));
      const 체 = e.querySelector('.체'); const kc = soft(s.ev[i], s.ev[i] + .25, t); 체.style.opacity = kc; 체.style.transform = `scale(${L(.4, 1, kc).toFixed(3)})`;
    });
    const kb = soft(s.ev[4] - .1, s.ev[4] + .4, t); 놓기(방, C.x, C.y, L(.5, 1, kb), 0, kb);
  };
};

/* 43. 광고 계정 = 돈 주고 쌓은 자산 · 비밀번호·카드번호는 절대 */
장면[43] = (뿌, s) => {
  const 금 = 박스('', 360, 360, 뿌, `<div style="width:100%;height:100%;border-radius:40px;background:linear-gradient(160deg,#2c3446,#141a28);display:flex;align-items:center;justify-content:center;box-shadow:0 30px 70px rgba(20,30,60,.35)">${아이콘('금고', 230, '#ffd166', 1.6)}</div>`);
  const 블 = [...Array(15).keys()].map(() => 박스('블록', 110, 62, 뿌));
  const 반 = 박스('', 900, 900, 뿌); 반.style.background = 'radial-gradient(circle,rgba(255,209,102,.45),transparent 60%)';
  const c27 = 컷(뿌, '27', 1180), c25 = 컷(뿌, '25', 1180);
  const 카드 = 박스('', 640, 400, 뿌, `<div style="width:100%;height:100%;border-radius:32px;background:linear-gradient(135deg,#1e2a4a,#3d5cff);color:#fff;padding:44px 48px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 30px 80px rgba(20,30,60,.35)"><div style="width:84px;height:62px;border-radius:12px;background:linear-gradient(135deg,#ffe08a,#c9a227)"></div><div class="번" style="position:relative;font-size:46px;font-weight:700;letter-spacing:.04em;white-space:nowrap;font-variant-numeric:tabular-nums">5412 7390 1846 2207<i class="가" style="position:absolute;left:-10px;top:-6px;height:74px;width:0;background:#000;border-radius:8px"></i></div><div style="display:flex;justify-content:space-between;font-size:26px;opacity:.9"><span>KIM SAJANG</span><span>12/29</span></div></div>`);
  재현표(카드); const 가1 = 카드.querySelector('.가');
  const 비 = 박스('', 640, 130, 뿌, `<div style="width:100%;height:100%;border-radius:24px;background:#fff;box-shadow:0 20px 50px rgba(20,30,60,.2);display:flex;align-items:center;gap:20px;padding:0 34px;color:${진한};font-size:34px;font-weight:700">${아이콘('자물쇠', 54, '#3d5cff', 2.4)}<span style="position:relative">비밀번호  ●●●●●●●●<i class="가" style="position:absolute;left:150px;top:-8px;height:58px;width:0;background:#000;border-radius:8px"></i></span></div>`);
  const 가2 = 비.querySelector('.가');
  return (t) => {
    const 무 = 인(t, s.ev[2] - .3, .4), 문 = 인(t, s.ev[3] - .25, .4), 카때 = soft(s.ev[4] - .9, s.ev[4] - .4, t);
    const 앞 = 1 - 무;
    const 둥 = 쉼(t * 1.3) * 8; 놓기(금, C.x - 260, C.y + 20 + 둥, L(.94, 1, 펑(t, s.t0, .5)) + soft(s.t0, s.ev[2], t) * .06, 쉼(t * .7) * 1.2, 앞);
    블.forEach((e, i) => { const col = i % 3, row = Math.floor(i / 3); const a = s.t0 + 2.5 + i * ((s.ev[0] - s.t0 - 2.5) / 15); const k = soft(a, a + .3, t); 놓기(e, C.x + 140 + col * 118 + 쉼(t * 1.1 + row) * 3, C.y + 180 - row * 70 + L(-60, 0, k) - 쉼(t * 1.3) * 8, 1, 쉼(t * .9 + i) * 1.5, k * 앞); e.style.boxShadow = t > s.ev[0] ? `inset 0 -6px 0 rgba(0,0,0,.18),0 0 ${(20 + 14 * Math.sin(t * 3 + i)).toFixed(0)}px rgba(255,190,60,.7)` : ''; });
    놓기(반, C.x + 260, C.y + 40, 1, 0, 앞 * 인(t, s.ev[1], .3) * (1 - soft(s.ev[1] + .5, s.ev[1] + 1.5, t)));
    놓기(c27, C.x, C.y, L(.95, 1, 무), 0, 무 * (1 - 문)); c27.움직(t, s.ev[2] - .3, s.ev[3], 1, [1.03, 1.12]);
    놓기(c25, C.x, C.y, L(.95, 1, 문), 0, 문 * (1 - 카때)); c25.움직(t, s.ev[3] - .3, s.ev[4], -1, [1.03, 1.12]);
    놓기(카드, C.x, C.y - 90, L(.95, 1, 카때), 0, 카때);
    가1.style.width = (soft(s.ev[4], s.ev[4] + .25, t) * 560).toFixed(1) + 'px';
    const 비때 = soft(s.ev[5] - .8, s.ev[5] - .3, t); 놓기(비, C.x, C.y + 230, L(.95, 1, 비때), 0, 비때);
    가2.style.width = (soft(s.ev[5], s.ev[5] + .25, t) * 250).toFixed(1) + 'px';
  };
};

/* 44. 유튜브엔 대행사 사기 영상만 많고 메타 피싱 정보는 없다 */
장면[44] = (뿌, s) => {
  const 썸 = [...Array(12).keys()].map((i) => 박스('썸', 300, 168, 뿌, `<div style="position:absolute;inset:0;background:linear-gradient(${i * 33}deg,hsl(${(i * 29 + 200) % 360} 55% 45%),hsl(${(i * 29 + 260) % 360} 60% 25%));filter:blur(6px);transform:scale(1.2)"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${아이콘('재생', 70, '#fff', 2)}</div><div class="엑" style="position:absolute;inset:0;background:rgba(255,59,79,.75);display:flex;align-items:center;justify-content:center;opacity:0">${아이콘('엑스', 90, '#fff', 3.2)}</div>`));
  const 검 = 박스('', 820, 100, 뿌, `<div style="width:100%;height:100%;border-radius:999px;background:#fff;color:${진한};display:flex;align-items:center;gap:18px;padding:0 34px;font-size:38px;font-weight:700;box-shadow:0 20px 50px rgba(20,30,60,.2)">${아이콘('돋보기', 46, '#ff0033', 2.6)}<span class="글"></span></div>`);
  const 검글 = 검.querySelector('.글');
  const 빈 = 박스('', 820, 380, 뿌, '<div style="width:100%;height:100%;border-radius:26px;border:4px dashed rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center"></div>');
  return (t) => {
    const 검때 = soft(s.ev[2] - .9, s.ev[2] - .4, t);
    const 줌 = 1 + soft(s.ev[0], s.ev[2], t) * .07; 썸.forEach((e, i) => { const k = 펑(t, s.ev[0] + i * .06); const gx = (i % 4 - 1.5) * 320 * 줌, gy = (Math.floor(i / 4) - 1) * 190 * 줌; 놓기(e, C.x + gx + 쉼(t * .9 + i * 1.7) * 6, C.y - 10 + gy + 쉼(t * 1.1 + i) * 7, L(.85, 1, k) * 줌, 쉼(t * .6 + i) * .8, k * (1 - 검때)); e.querySelector('.엑').style.opacity = [1, 4, 6, 9, 11].includes(i) ? soft(s.ev[1] + (i % 5) * .08, s.ev[1] + (i % 5) * .08 + .2, t) : 0; });
    놓기(검, C.x, C.y - 250, 1, 0, 검때); const 말 = '메타 피싱 사기'; 검글.textContent = 말.slice(0, Math.floor(soft(s.ev[2] - .4, s.ev[2] + .2, t) * 말.length));
    놓기(빈, C.x, C.y + 70, 1, 0, 검때 * 인(t, s.ev[2], .3));
  };
};

/* 45. 아무도 안 만들어서 → 급하게 만들었다 */
장면[45] = (뿌, s) => {
  const 사 = [...Array(5).keys()].map(() => 아이콘알(뿌, '사람', 140, 연판, 진한));
  const q = [...Array(5).keys()].map(() => 물음표(뿌, 64, '#ffd166'));
  const 편 = 창틀(뿌, 1000, 460, '영상 편집');
  편.속.innerHTML = '<div style="padding:30px;display:flex;flex-direction:column;gap:18px">' + [0, 1, 2, 3].map((i) => `<div style="height:56px;border-radius:12px;background:#eef0f4;position:relative;overflow:hidden"><i class="트" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:12px;background:${['#3d7dff', '#ff9f1c', '#2fbf71', '#a35cff'][i]}"></i></div>`).join('') + '</div>';
  const 트 = [...편.속.querySelectorAll('.트')];
  const 진 = 박스('진행', 900, 40, 뿌, '<i style="width:0"></i>'); const 진i = 진.querySelector('i');
  const 완 = 박스('', 220, 220, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#2fbf71;display:flex;align-items:center;justify-content:center;box-shadow:0 0 60px rgba(47,191,113,.5)">${아이콘('업로드', 120, '#fff', 3)}</div>`);
  return (t) => {
    const 편때 = soft(s.ev[1] - .4, s.ev[1], t);
    사.forEach((e, i) => { const k = 펑(t, s.ev[0] + i * .12); 놓기(e, C.x - 480 + i * 240, C.y + 20, L(.6, 1, k), 0, k * (1 - 편때)); const kq = 펑(t, (낱말('당해라고', s.t0) ?? s.ev[0] + 4) + i * .1); 놓기(q[i], C.x - 430 + i * 240, C.y - 80, L(.4, 1, kq), 10, kq * (1 - 편때)); });
    놓기(편, C.x + 쉼(t * .6) * 8, C.y - 60 + 쉼(t * .5 + 1) * 6, L(.95, 1, 편때) + soft(s.ev[1], s.ev[3], t) * .06, 0, 편때 * (1 - soft(s.ev[3] - .2, s.ev[3] + .3, t) * .6));
    트.forEach((e, i) => { e.style.width = (soft(s.ev[1] + i * .4, s.ev[1] + 3 + i * .6, t) * 100).toFixed(1) + '%'; });
    진i.style.width = (soft(s.ev[2], s.ev[3], t) * 100).toFixed(1) + '%'; 놓기(진, C.x, C.y + 260, 1, 0, soft(s.ev[2] - .4, s.ev[2], t));
    const k = 펑(t, s.ev[3], .4); 놓기(완, C.x, C.y - 60, L(.4, 1, k), 0, k);
  };
};

/* 46. 구독 · 영상 두 개 · 사기 조심 · 안녕 */
장면[46] = (뿌, s) => {
  const 구 = 박스('구독', 420, 120, 뿌, `${아이콘('재생', 52, '#fff', 2.4)}<span>구독</span>`); const 구글 = 구.querySelector('span');
  const 종 = 박스('', 140, 140, 뿌, `<div style="width:100%;height:100%;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 16px 40px rgba(20,30,60,.2)">${아이콘('종', 80, 진한, 2.4)}</div>`);
  const 커 = 커서(뿌); const 물 = 물결(뿌);
  const 영 = [0, 1].map((i) => 박스('썸', 420, 236, 뿌, `<div style="position:absolute;inset:0;background:linear-gradient(${i ? 210 : 30}deg,#1e2a4a,${i ? '#7c3aed' : '#3d5cff'})"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${아이콘('재생', 90, '#fff', 2)}</div><div style="position:absolute;left:18px;bottom:14px;font-size:24px;font-weight:800">${i ? '광고 노하우' : '광고 세팅'}</div>`));
  const 레 = 박스('', 720, 120, 뿌, `<div style="display:flex;align-items:center;gap:22px;color:${진한}"><b style="font-size:40px;white-space:nowrap">1년차 마케터</b><div class="진행" style="flex:1;height:34px;background:rgba(0,0,0,.08);position:relative"><i class="레i" style="width:0"></i></div></div>`); const 레i = 레.querySelector('.레i');
  return (t) => {
    const 영때 = soft(s.ev[2] - .4, s.ev[2] + .1, t), 끝 = soft(s.ev[4], s.t1, t);
    const 눌 = t > s.ev[0];
    구글.textContent = 눌 ? '구독중' : '구독'; 구.style.background = 눌 ? '#e5e5ea' : '#ff0033'; 구.style.color = 눌 ? 진한 : '#fff'; 구.style.boxShadow = 눌 ? '0 16px 40px rgba(20,30,60,.15)' : '0 20px 50px rgba(255,0,51,.35)';
    const 위 = 영때 * 260;
    놓기(구, C.x - 80, C.y - 위 + 20, (t > s.ev[0] && t < s.ev[0] + .12 ? .94 : 1) * L(.94, 1, 펑(t, s.t0, .5)) * L(1, .8, 영때), 0, 1 - 끝);
    놓기(종, C.x + 230 - 영때 * 40, C.y - 위 + 20, L(1, .8, 영때), 흔들(t, s.ev[1], 18, 1), 인(t, s.ev[0], .3) * (1 - 끝));
    놓기(커, L(C.x + 360, C.x - 60, soft(s.ev[0] - 1, s.ev[0], t)), C.y + 50 - 위, t > s.ev[0] && t < s.ev[0] + .12 ? .85 : 1, 0, soft(s.t0 + .2, s.t0 + .6, t) * (1 - soft(s.ev[0] + .4, s.ev[0] + .8, t)));
    물결그리기(물, t, s.ev[0], C.x - 60, C.y + 30 - 위);
    영.forEach((e, i) => { const k = soft(s.ev[2] + i * .2, s.ev[2] + i * .2 + .5, t); 놓기(e, C.x - 230 + i * 460, C.y + 70 + L(60, 0, k), 1, 0, k * (1 - soft(s.ev[3] - .6, s.ev[3] - .2, t)) * (1 - 끝)); });
    const 레때 = soft(s.ev[3] - .4, s.ev[3], t); 놓기(레, C.x, C.y + 110, 1, 0, 레때 * (1 - 끝)); 레i.style.width = (soft(s.ev[3], s.ev[3] + 1.4, t) * 100).toFixed(1) + '%';
  };
};
