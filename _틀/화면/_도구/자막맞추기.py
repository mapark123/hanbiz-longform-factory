"""자막/원고.txt(제가 문장 단위로 쓴 줄) → 말시각.json 낱말 시각에 글자 단위로 맞대어 줄마다 시작·끝 시각.
뜨는 때 = 그 줄 첫 글자 말하기 0.05초 전 · 지는 때 = 마지막 글자 끝 +0.3초(다음 줄과 0.4초 안 떨어지면 다음 줄까지 이어서 깜빡임 없앰).
사용: python -X utf8 화면/_도구/자막맞추기.py → 화면/자막/줄.json · 맞추기.txt"""
import json, os, re, difflib
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)

여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
말 = json.load(open(f'{여기}/말시각.json', encoding='utf-8'))
민 = lambda s: re.sub(r"\{[ry]:([^}]*)\}", lambda m: m.group(1), s)  # 색 표시 {r:..} {y:..} 벗기기
깨 = lambda s: re.sub(r'[^가-힣A-Za-z0-9]', '', 민(s))
# 받아쓰기 글자 + 글자마다 시각
W, T0, T1 = [], [], []
for c in 말:
    for w, a, b in c['단어']:
        g = 깨(w)
        for i, ch in enumerate(g):
            W.append(ch); T0.append(a + (b - a) * i / max(1, len(g))); T1.append(a + (b - a) * (i + 1) / max(1, len(g)))
줄글 = [l.strip() for l in open(f'{여기}/자막/원고.txt', encoding='utf-8') if l.strip()]
M, 소속 = [], []
for k, l in enumerate(줄글):
    for ch in 깨(l): M.append(ch); 소속.append(k)
sm = difflib.SequenceMatcher(None, M, W, autojunk=False)
짝 = {}
for a, b, n in sm.get_matching_blocks():
    for i in range(n): 짝[a + i] = b + i
줄 = []; 기록 = []
for k, l in enumerate(줄글):
    idx = [i for i, s in enumerate(소속) if s == k]
    맞 = [짝[i] for i in idx if i in 짝]
    비율 = len(맞) / max(1, len(idx))
    if not 맞: 기록.append(f'못 맞춤 {k} {l}'); 줄.append({'글': l, 't0': None, 't1': None}); continue
    줄.append({'글': l, 't0': T0[min(맞)], 't1': T1[max(맞)], '맞음': round(비율, 2)})
    if 비율 < .8: 기록.append(f'맞음 {비율:.0%} · {k} {l}')
# 빈 시각 채우기 · 겹침·깜빡임 정리
for i, c in enumerate(줄):
    if c['t0'] is None: c['t0'] = 줄[i - 1]['t1']; c['t1'] = c['t0'] + 1
for i, c in enumerate(줄):
    c['t0'] = round(max(0, c['t0'] - .05), 3)
for i, c in enumerate(줄):
    다음 = 줄[i + 1]['t0'] if i + 1 < len(줄) else 설['길이'] - .07
    끝 = c['t1'] + .3
    c['t1'] = round(다음 if 다음 - 끝 < .4 else min(끝, 다음), 3)
    if c['t1'] <= c['t0']: 기록.append(f'시각 뒤집힘 {i} {c["글"]}')
json.dump(줄, open(f'{여기}/자막/줄.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
open(f'{여기}/자막/맞추기.txt', 'w', encoding='utf-8').write('\n'.join(f'{i:03d} {c["t0"]:7.2f}-{c["t1"]:7.2f} ({c["t1"] - c["t0"]:4.1f}초) {c["글"]}' for i, c in enumerate(줄)) + '\n\n' + '\n'.join(기록))
print('줄', len(줄), '· 문제', len(기록)); print('\n'.join(기록))
