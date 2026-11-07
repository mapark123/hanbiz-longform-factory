"""컷구간 이음매 전부: 원본을 «남긴 끝까지» vs «0.35초 더» 받아써 다르면(말 끝 잘림 의심), «남긴 머리부터» vs «0.25초 앞부터» 다르면(말 머리 잘림 의심) 출력.
11/7 대표 지적 «말 하다가 왜 자꾸 끝에서 짤리냐» 뒤 만듦. 사용: python -X utf8 _도구/잘림전수검사.py → 잘림검사.txt"""
import json, os, sys, re
import numpy as np, soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
from _귀 import 귀열기
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: os.path.join(여기, n)
x, sr = sf.read(J('a16k.wav'), dtype='float32')
K = json.load(open(J('컷구간.json'), encoding='utf-8'))['초구간']
m = 귀열기('large-v3')
def 받(a, b):
    seg, _ = m.transcribe(x[int(max(0, a) * sr):int(b * sr)], language='ko', condition_on_previous_text=False, beam_size=5, temperature=0)
    return ' '.join(g.text.strip() for g in seg)
깨끗 = lambda s: re.sub(r'[^가-힣0-9A-Za-z]', '', s)
줄 = []
for i, (a, b) in enumerate(K):
    if i + 1 < len(K):
        s1, s2 = 받(b - 2.5, b), 받(b - 2.5, b + 0.35)
        if 깨끗(s1) != 깨끗(s2): 줄.append(f'끝 {b:7.2f} | {s1}  →  {s2}')
    if i:
        s1, s2 = 받(a, a + 2.5), 받(a - 0.25, a + 2.5)
        if 깨끗(s1) != 깨끗(s2): 줄.append(f'머리 {a:7.2f} | {s1}  →  {s2}')
open(J('잘림검사.txt'), 'w', encoding='utf-8').write('\n'.join(줄))
print('\n'.join(줄)); print('의심', len(줄))
