"""배치도.json → 대표 확인용 콘티 한 장(화면/콘티_뒷장면_효과음.html).
CSS 는 _리포트_공통.css 를 <style> 안에, 그림은 base64 로 심는다(hanbiz-report 규칙).
효과음은 라이선스상 파일을 밖으로 넘기면 안 돼서 심지 않고 이 PC 의 라이브러리 파일을 바로 튼다(이 PC 에서만 소리 남).
사용: python -X utf8 화면/_도구/콘티만들기.py"""
import base64, io, json, os, re, html, collections
from PIL import Image
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)


여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
뿌리 = os.path.dirname(여기)
장면 = json.load(open(f'{여기}/배치도.json', encoding='utf-8'))
css = open(os.path.join(_p, '_공용', '_리포트_공통.css'), encoding='utf-8').read()
가릴것 = set()  # 11/7 가린 사본(재료/실제사례_가림) 완성 → 그 폴더 그림을 씀

def 꺾쇠(s):  # 대표 규칙: « » 쓰지 않음
    return s.replace('«', '“').replace('»', '”')
def e(s): return html.escape(꺾쇠(s))
def 심기(p, w=360, q=72):
    im = Image.open(p).convert('RGB'); im.thumbnail((w, 10000))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
def 그림(재료):
    m = re.match(r'(컷씬|실제사례) (\d+)', 재료)
    if not m: return None
    종류, n = m.group(1), m.group(2).zfill(2)
    폴더 = f'{뿌리}/재료/{"컷씬" if 종류 == "컷씬" else "실제사례_가림"}'
    fs = [f for f in os.listdir(폴더) if f.startswith(n + '_')]
    if not fs: return None
    if 종류 == '실제사례' and n in 가릴것: return 'X'
    return 심기(f'{폴더}/{fs[0]}')

def 초(t): return f'{int(t // 60)}:{t % 60:04.1f}'
총 = sum(len(s['효과음']) for s in 장면)
파일수 = len({x['파일'] for s in 장면 for x in s['효과음']})
등급 = collections.Counter(x['등급'] for s in 장면 for x in s['효과음'])
컷씬수 = len({m.group(1) for x in 장면 for r in x['재료'] for m in [re.match(r'컷씬 (\d+)', r)] if m})
사례수 = len({n for x in 장면 for r in x['재료'] for m in [re.match(r'실제사례 ([\d·]+)', r)] if m for n in m.group(1).split('·')})
장 = [('오프닝', 0, 80.2), ('첫 번째 · 변호사 메일', 80.2, 145.5), ('두 번째 · 메타인 척 메시지', 145.5, 226.7),
      ('세 번째 · 소명 메일 → 해킹', 226.7, 356.8), ('네 번째 · 광고 대행 사기', 356.8, 446.8), ('정리 · 끝맺음', 446.8, 542.5)]

카드 = []
for 이름, a, b in 장:
    카드.append(f'<h3 class="장">{e(이름)} <span>{초(a)} – {초(b)}</span></h3>')
    for s in [s for s in 장면 if a <= s['t0'] < b]:
        thumbs = []
        for r in s['재료']:
            g = 그림(r)
            if g == 'X': thumbs.append(f'<figure class="가림"><div>개인정보 가린 사본으로 넣음</div><figcaption>{e(r)}</figcaption></figure>')
            elif g: thumbs.append(f'<figure><img src="{g}" alt=""><figcaption>{e(r)}</figcaption></figure>')
            else: thumbs.append(f'<figure class="글"><div>{e(r)}</div></figure>')
        효 = ''.join(
            f'<li><button data-src="file:///{html.escape(x["파일"])}" title="눌러서 듣기">▶</button>'
            f'<b class="t">{초(x["t"]) if x["t"] is not None else "?"}</b><span class="g g{x["등급"].replace("★", "s")}">{e(x["등급"])}</span>'
            f'<span class="n">{e(x["이름"])}</span><span class="w">{e(x["왜"])}</span></li>' for x in s['효과음'])
        카드.append(f'''<article class="sc"><div class="sh"><em>{s["번호"]:02d}</em><div><h4>{e(s["제목"])}</h4><div class="tm">{초(s["t0"])} – {초(s["t1"])} · {s["t1"] - s["t0"]:.1f}초</div></div></div>
<p class="말">{e(s["말"][:220])}{"…" if len(s["말"]) > 220 else ""}</p>
<div class="bd"><div class="구상"><div class="lab">화면</div><p>{e(s["구상"])}</p><div class="thumbs">{"".join(thumbs)}</div></div>
<div class="효"><div class="lab">효과음 {len(s["효과음"])}개</div><ul>{효}</ul></div></div></article>''')

추가css = '''
h3.장{margin:38px 0 12px;font-family:"Noto Serif KR",serif;font-size:24px;color:var(--navy)}h3.장 span{font:500 14px "IBM Plex Mono",monospace;color:var(--gold);margin-left:10px}
.sc{background:#fff;border:1px solid #e3ddd0;border-radius:10px;padding:13px;margin:0 0 8px}
.sh{display:flex;gap:12px;align-items:baseline}.sh em{font:600 15px "IBM Plex Mono",monospace;color:var(--gold);font-style:normal}.sh h4{margin:0;font-size:17px;color:var(--navy);word-break:keep-all}
.tm{font:500 12.5px "IBM Plex Mono",monospace;color:var(--ink-2)}
p.말{margin:8px 0 10px;padding:8px 11px;background:var(--cream);border-left:3px solid var(--navy);font-size:13.5px;line-height:1.6;color:var(--ink);word-break:keep-all}
.bd{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:12px;align-items:start}
@media(max-width:900px){.bd{grid-template-columns:minmax(0,1fr)}}
.lab{font:600 11.5px "IBM Plex Mono",monospace;color:var(--gold);letter-spacing:.06em;margin-bottom:4px}
.구상 p{margin:0 0 8px;font-size:14px;line-height:1.65;word-break:keep-all;color:var(--ink)}
.thumbs{display:flex;flex-wrap:wrap;gap:6px}.thumbs figure{margin:0;width:176px}.thumbs img{width:100%;height:auto;border-radius:6px;display:block}
.thumbs figcaption{font-size:11.5px;color:var(--ink-2);margin-top:2px}
.thumbs figure.글 div,.thumbs figure.가림 div{background:var(--cream);border:1px dashed #cfc6b3;border-radius:6px;padding:8px;font-size:12px;color:var(--ink);word-break:keep-all}
.효 ul{list-style:none;margin:0;padding:0}.효 li{display:grid;grid-template-columns:26px 50px 46px minmax(0,1fr);gap:0 6px;align-items:center;padding:4px 0;border-bottom:1px solid #f0ebe0;font-size:13px}
.효 li .w{grid-column:4;color:var(--ink);word-break:keep-all}.효 li .n{grid-column:4;font:500 12px "IBM Plex Mono",monospace;color:var(--navy);word-break:break-all}
.효 li button{grid-row:span 2;width:24px;height:24px;border-radius:50%;border:0;background:var(--navy);color:#fff;font-size:10px;cursor:pointer}.효 li button.on{background:var(--red)}
.효 li .t{grid-row:span 2;font:600 12px "IBM Plex Mono",monospace;color:var(--navy)}
.g{grid-row:span 2;font:600 11px "IBM Plex Mono",monospace;text-align:center;border-radius:4px;padding:2px 0;color:#fff}
.gAs{background:var(--gold)}.gA{background:var(--navy)}.gB{background:#4a5a7a}.gC{background:#6b7280}.g장면음{background:var(--green)}.g미등급{background:#8a6d3b}
.규칙 li{margin:4px 0;line-height:1.65;word-break:keep-all}
'''
글 = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>메타사기 4가지 뒷장면 콘티</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>{css}{추가css}</style></head><body><div class="shell">
<aside class="rail"><div class="mark">Hanbiz Marketing</div><div class="who">메타사기 4가지<br>뒷장면 콘티</div>
<nav><a href="#s1"><em>01</em>화면 방향</a><a href="#s2"><em>02</em>효과음 쓰는 법</a><a href="#s3"><em>03</em>장면별 콘티</a><a href="#s4"><em>04</em>다음 작업</a></nav>
<div class="foot">2026.11.07<br>기준 영상 — 대표 완성본 9:02<br>(4분 2초 끝음 복구판)</div></aside>
<main>
<header class="hero"><div class="kicker">Storyboard · Sound Map</div><div class="grid2"><div>
<h1>장면 46개에 효과음 {총}개를 깔고,<br><span class="hl">같은 소리는 한 번도 다시 쓰지 않습니다.</span></h1>
<p class="lead">대표님 완성본의 실제 말 시각에 맞춰 장면을 나눴습니다. 효과음은 한비즈 효과음 라이브러리에서만 골랐고, 대표님이 쓰시던 소리(A★)를 핵심 순간에 먼저 넣었습니다. 클로드 기본 효과음은 하나도 없습니다.</p></div>
<div class="side">
<div class="row"><div class="k">장면</div><div class="v">46개</div><div class="d">평균 11.8초 · 장 카드 4장</div></div>
<div class="row"><div class="k">효과음</div><div class="v">{총}개</div><div class="d">서로 다른 파일 {파일수}개 · 반복 0</div></div>
<div class="row"><div class="k">등급</div><div class="v">A★ {등급["A★"]} · A {등급["A"]}</div><div class="d">B {등급["B"]} · C {등급["C"]} · 장면음 {등급["장면음"]} · 미등급 {등급["미등급"]}</div></div>
<div class="row"><div class="k">재료</div><div class="v">컷씬 {컷씬수}장</div><div class="d">실제 캡처 {사례수}장 · 재현 화면은 재현 표시</div></div>
</div></div>
<div class="meta">시각 기준 — 설정.json «기준영상» 받아쓰기 · 효과음 닻은 그 낱말이 시작되는 순간 · ▶ 단추는 이 PC 에서만 소리가 납니다(라이선스상 효과음 파일을 문서에 넣어 밖으로 보낼 수 없음)</div></header>

<section id="s1"><div class="head"><div class="no">01</div><div><h2>화면 방향</h2><p class="dek">지난 영상에서 받은 지적을 그대로 기준으로 삼았습니다.</p></div></div>
<ul class="규칙">
<li><b>얼굴은 오른쪽 아래.</b> 대표님이 주실 얼굴 자른 파일 자리(오른쪽 아래)를 비우고, 그림의 중심은 화면 왼쪽 가운데(가로 880 · 세로 460 근처)에 둡니다. 아래 자막 띠(창근 대리 자막 자리)도 비웁니다.</li>
<li><b>한 번에 한 곳만 정가운데.</b> 폰은 아이폰 틀 하나, 실제 캡처는 그 폰이나 노트북 안에 넣습니다. 튕기는 움직임 없이 부드럽게, 앞 그림이 사라진 뒤 다음 그림이 나옵니다.</li>
<li><b>글 카드 없음.</b> 말한 내용을 글로 다시 쓰지 않습니다. 글은 이름표(장 카드), 핵심 숫자 하나(100% · 24:00:00 · 120만 원 · 1,000만 원), 실제 화면 속 글자만 씁니다.</li>
<li><b>사람 장면은 컷씬 그림.</b> 장면마다 다른 컷씬 한 장씩, 반복 없이 씁니다(쓰지 않는 컷씬: 23 덕트 대표 · 24 돈 내나요 · 26 캡처 보내기 · 21 카드 불러 줌 — 녹화에서 그 말이 빠짐).</li>
<li><b>실제 캡처는 가린 사본만.</b> 수강생 이름·이메일·페이지 ID·업체명은 가리고, CR Agency 이름도 가려 처음 보는 외국 회사 페이지로 보여 줍니다. 새로 그린 화면(알림·폼·예산·수신 화면)에는 작게 재현 표시를 붙입니다.</li>
<li><b>배경 색.</b> 사기 장면은 어두운 밤 남색, 해결·정리 장면은 밝은 회백색으로 바꿔 분위기를 나눕니다. 장 카드 네 장은 같은 틀에 색만 다릅니다.</li>
<li><b>글꼴은 프리텐다드를 실제로 불러서</b> 찍기 전에 글자 폭을 재 맑은 고딕이 아닌지 확인합니다.</li></ul></section>

<section id="s2"><div class="head"><div class="no">02</div><div><h2>효과음 쓰는 법</h2><p class="dek">라이브러리 읽어보기와 등급표(예능효과음-등급.json)를 따랐습니다.</p></div></div>
<ul class="규칙">
<li><b>고르는 순서.</b> 대표님이 실제로 쓰신 소리(A★) → A → 장면에 꼭 맞는 소리가 A 에 없을 때만 B·C(폰 진동·벨소리·타이머·키보드·자물쇠처럼 실제 물건 소리는 B·C 에만 있음).</li>
<li><b>반복 없음.</b> {총}개 모두 다른 파일입니다. 같은 성격의 소리(장 카드 징글 4개, 체크 4개, 스위치 4개)도 파일을 전부 다르게 골랐고, 정리 장면의 체크 4개는 도-레-솔-도로 올라가게 했습니다.</li>
<li><b>크기.</b> 목소리를 가리지 않게 효과음은 목소리보다 작게 깔고, 쿵·도장 같은 큰 강조만 목소리 높이까지 올립니다. 말이 겹치는 순간엔 짧은 소리만 씁니다.</li>
<li><b>소재 손질.</b> 등급표에 고역이 세다고 적힌 소리는 높은 음을 살짝 깎고, 순간음은 아주 짧게 페이드인해서 딸깍 소리를 막습니다.</li>
<li><b>분위기.</b> 웃긴 소리(띠용·코믹)는 대표님이 웃으며 말하는 대목(질린 얼굴, 해커가 짜증 나서 나감)에만 조금 쓰고, 해킹·협박 대목은 긴장음·심장 소리로 무겁게 갑니다.</li></ul></section>

<section id="s3"><div class="head"><div class="no">03</div><div><h2>장면별 콘티</h2><p class="dek">회색 띠 = 그 장면에서 대표님이 실제로 하신 말 · ▶ = 효과음 듣기 · 시각 = 완성본 기준</p></div></div>
{"".join(카드)}</section>

<section class="end" id="s4"><div class="head"><div class="no">04</div><div><h2>다음 작업</h2></div></div>
<ol><li>대표님이 얼굴을 오른쪽 아래로 자른 파일을 소통 폴더에 넣어 주시면, 그 자리를 정확히 재서 비웁니다.</li>
<li>실제 캡처 가린 사본과 재현 화면을 먼저 만들고, 장면을 장 단위(6개)로 나눠 찍습니다.</li>
<li>장마다 미리보기 몇 장을 보고, 전체는 4K 60fps 로 찍은 뒤 효과음을 이 배치도대로 얹습니다.</li>
<li>바꾸고 싶은 장면·효과음이 있으면 장면 번호와 효과음 시각만 말씀해 주세요.</li></ol></section>
</main></div>
<script>
let 지금=null,단추=null;
document.querySelectorAll('.효 button').forEach(b=>b.onclick=()=>{{
 if(지금){{지금.pause();단추.classList.remove('on');if(단추===b){{지금=null;return}}}}
 지금=new Audio(b.dataset.src);단추=b;b.classList.add('on');지금.play().catch(()=>b.classList.remove('on'));지금.onended=()=>b.classList.remove('on');
}});
</script></body></html>'''
out = f'{여기}/콘티_뒷장면_효과음.html'
open(out, 'w', encoding='utf-8').write(글)
print(out, round(os.path.getsize(out) / 1e6, 2), 'MB')
