"""뒷 장면 구상 + 효과음 배치도 (11/7 대표: «클로드 자체 효과음 X · 한비즈 효과음 등급별 라이브러리만 · 몇 개 돌려 반복 X · 장면마다 어울리게»).
시각 기준 = 설정.json «기준영상»(대표 최종 컷 · 얼굴 원 · 검은 바탕)을 받아쓴 화면/말시각.json.
효과음 닻: 낱말(장면 구간 안 첫 등장 단어 시작) 또는 숫자(장면 시작 + 초).
사용: python -X utf8 화면/_도구/배치도.py → 화면/배치도.json · 화면/콘티_뒷장면_효과음.html"""
import base64, io, json, os, re, collections
from PIL import Image
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)


여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
뿌리 = os.path.dirname(여기)
라이브 = 설['효과음라이브러리']
컷씬 = f'{뿌리}/재료/컷씬'
사례 = f'{뿌리}/재료/실제사례'
말 = json.load(open(f'{여기}/말시각.json', encoding='utf-8'))
단어 = [(w, a, b) for c in 말 for w, a, b in c['단어']]

# ───────── 장면 ─────────
# (시작, 끝, 제목, 화면 구상, 재료[컷씬번호/사례번호/재현], 효과음[(닻, 파일, 왜)])
S = [
 # (시작초, 끝초, '제목', '화면 구상(한두 문장)', ['컷씬 01', '실제사례 03(가림)', '재현: …'],
 #  [(닻 낱말 또는 장면 시작+초, '효과음 파일 이름', '왜'), ...]),
 # 예시는 ../예시_메타사기4가지/화면/배치도_예시.py (46장면·163개)
 (0.0, 5.0, '오프닝 예시', '정가운데 폰에 알림이 쌓인다.', ['재현: 잠금화면 알림'],
  [(0.05, 'SEL_携帯電話のバイブレーション1.mp3', '첫 프레임 폰 진동')]),
]

# ───────── 파일 찾기 · 겹침 검사 ─────────
모든 = {}
for root, _, fs in os.walk(라이브):
    for f in fs:
        if f.lower().endswith(('.wav', '.mp3')):
            p = os.path.join(root, f).replace(chr(92), '/')
            모든.setdefault(f, []).append(p)
def 찾기(이름):
    if '/' in 이름:
        p = f'{라이브}/{이름}'
        if os.path.exists(p): return p
        이름 = 이름.split('/')[-1]
    ps = 모든.get(이름)
    if not ps: return None
    순 = lambda p: (0 if '/1_A' in p else 1 if '/2_A/' in p else 2 if '/5_' in p else 3 if '/3_B/' in p else 4 if '/4_C/' in p else 5)
    return sorted(ps, key=순)[0]
def 등급(p):
    for k, v in [('/1_A', 'A★'), ('/2_A/', 'A'), ('/3_B/', 'B'), ('/4_C/', 'C'), ('/5_', '장면음'), ('/6_', '미등급')]:
        if k in p: return v
    return '?'
def 닻(a, t0, t1):
    if isinstance(a, (int, float)): return round(t0 + a, 2)
    for w, s, e in 단어:
        if t0 - 0.3 <= s < t1 and a.replace(' ', '') in w.replace(' ', ''): return s
    return None

# 녹화가 다시 잘리면(대표 재컷) 구판→새판 시각 옮기기가 필요: 예시_메타사기4가지/화면/배치도_예시.py 의 맵() 참고

장면 = []; 문제 = []; 쓴 = collections.Counter()
for i, (t0, t1, 제목, 구상, 재료, 효과) in enumerate(S, 1):
    목록 = []
    for a, f, 왜 in 효과:
        p = 찾기(f); t = 닻(a, t0, t1)
        if not p: 문제.append(f'장면{i} 파일 없음: {f}')
        if t is None: 문제.append(f'장면{i} 닻 못 찾음: {a}')
        쓴[os.path.basename(p) if p else f] += 1
        목록.append({'t': t, '닻': a, '파일': p, '이름': f.split('/')[-1], '등급': 등급(p) if p else '?', '왜': 왜})
    글 = ' '.join(c['글'] for c in 말 if c['t1'] > t0 + .05 and c['t0'] < t1 - .05)
    장면.append({'번호': i, 't0': t0, 't1': t1, '제목': 제목, '구상': 구상, '재료': 재료, '효과음': 목록, '말': 글})
for k, n in 쓴.items():
    if n > 1: 문제.append(f'같은 파일 {n}번: {k}')
json.dump(장면, open(f'{여기}/배치도.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
총 = sum(len(s['효과음']) for s in 장면)
등급수 = collections.Counter(e['등급'] for s in 장면 for e in s['효과음'])
print('장면', len(장면), '효과음', 총, '서로 다른 파일', len(쓴), dict(등급수))
print('\n'.join(문제) or '문제 없음')
