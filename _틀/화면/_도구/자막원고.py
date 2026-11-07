"""자막 원고: 말 시각(낱말) → 문장 단위 → 길면 뜻이 끝나는 자리(연결 어미·쉼표)에서만 나눔.
11/7 대표: «말 소리에 맞게 달아서 엄청 불편 · 문장에 맞게» · 위치는 귀 높이(위 862) · 얼굴 피해 가운데 1110.
사용: python -X utf8 화면/_도구/자막원고.py → 화면/자막/원고.json · 원고.txt"""
import json, os, re
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)


여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
말 = json.load(open(f'{여기}/말시각.json', encoding='utf-8'))
낱 = [[w, a, b] for c in 말 for w, a, b in c['단어'] if w.strip()]
최대 = 30  # 한 줄 글자 수(띄어쓰기 포함) 상한
끝말 = re.compile(r'[.?!]$|(요|다|죠|까|네|녕)[.?!]?$')
이음 = re.compile(r'(,|는데|은데|인데|니까|어서|아서|해서|가지고|고|면|지만|면서|거든요|는데요|더라고요|라고)[,]?$')

# 1) 문장 나누기: 마침표·물음표 또는 «요/다/죠» 로 끝나고 0.25초 넘게 쉼
문장 = []; 지금 = []
for i, (w, a, b) in enumerate(낱):
    지금.append([w, a, b])
    다음a = 낱[i + 1][1] if i + 1 < len(낱) else 1e9
    if re.search(r'[.?!]$', w) or (끝말.search(w) and 다음a - b > .25) or 다음a - b > 1.2:
        문장.append(지금); 지금 = []
if 지금: 문장.append(지금)

글 = lambda ws: ' '.join(x[0] for x in ws)
def 나누기(ws):
    if len(글(ws)) <= 최대 or len(ws) < 2: return [ws]
    후보 = []
    for k in range(1, len(ws)):
        왼, 오 = 글(ws[:k]), 글(ws[k:])
        if len(왼) < 7 or len(오) < 7: continue
        점 = abs(len(왼) - len(오))
        if 이음.search(ws[k - 1][0]): 점 -= 12
        if ws[k - 1][0].endswith(','): 점 -= 6
        점 -= min(2.0, ws[k][1] - ws[k - 1][2]) * 8  # 실제로 쉰 자리면 더 좋음(뜻이 끊기는 자리일 때만 쓰임)
        후보.append((점, k))
    if not 후보: return [ws]
    k = min(후보)[1]
    return 나누기(ws[:k]) + 나누기(ws[k:])

줄 = []
for ws in 문장:
    for 조 in 나누기(ws):
        줄.append({'t0': 조[0][1], 't1': 조[-1][2], '글': 글(조)})
# 시각: 말 시작 0.05초 전에 뜨고, 다음 자막까지 0.4초 안 쉬면 이어 붙여 깜빡임 없앰
for i, c in enumerate(줄):
    c['t0'] = max(0, round(c['t0'] - .05, 2))
    다음 = 줄[i + 1]['t0'] - .05 if i + 1 < len(줄) else 설['길이'] - .07
    c['t1'] = round(min(다음, c['t1'] + .35) if 다음 - c['t1'] > .4 else 다음, 2)
os.makedirs(f'{여기}/자막', exist_ok=True)
json.dump(줄, open(f'{여기}/자막/원고_자동.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
open(f'{여기}/자막/원고_자동.txt', 'w', encoding='utf-8').write('\n'.join(f'{i:03d} {c["t0"]:7.2f}-{c["t1"]:7.2f} | {c["글"]}' for i, c in enumerate(줄)))
print('자막', len(줄), '줄 · 가장 긴 줄', max(len(c['글']) for c in 줄), '자')
