"""컷본의 «말 컷» 이음매마다 앞뒤 2.5초를 따로 받아써서, 지운 말 꼬리가 남았거나 남길 말이 잘렸는지 본다.
사용: python -X utf8 _도구/이음매확인.py [컷본.mp4]  → 이음매확인.txt"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
from _귀 import 귀열기
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: os.path.join(여기, n)
영상 = J(sys.argv[1] if len(sys.argv) > 1 else '컷본_v1.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 영상, '-vn', '-ac', '1', '-ar', '16000', J('_컷16k.wav')], check=True)
x, sr = sf.read(J('_컷16k.wav'), dtype='float32')
K = json.load(open(J('컷구간.json'), encoding='utf-8'))['초구간']
t = 0; 이음 = []
for i, (a, b) in enumerate(K):
    fa, fb = round(a * 30), round(b * 30)
    if i and a - K[i - 1][1] > 0.5:
        이음.append((t, K[i - 1][1], a))
    t += (fb - fa) / 30
m = 귀열기('large-v3')
줄 = []
for c, pa, pb in 이음:
    s, e = max(0, c - 2.5), c + 2.5
    seg, _ = m.transcribe(x[int(s * sr):int(e * sr)], language='ko', word_timestamps=True, condition_on_previous_text=False, beam_size=5, temperature=0)
    ws = [w for g in seg for w in (g.words or [])]
    앞 = ' '.join(w.word.strip() for w in ws if s + w.start < c)
    뒤 = ' '.join(w.word.strip() for w in ws if s + w.start >= c)
    줄.append(f'{c:7.2f} (원본 {pa:6.1f}→{pb:6.1f}) | {앞}  ‖  {뒤}')
open(J('이음매확인.txt'), 'w', encoding='utf-8').write('\n'.join(줄))
print('\n'.join(줄))
