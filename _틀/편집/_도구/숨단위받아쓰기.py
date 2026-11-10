"""살아남은 구간을 숨 단위(조용한 틈)로 쪼개 하나씩 받아쓴다. 짧게 끊어 주면 받아쓰기가 앞뒤 문맥으로 매끄럽게 고치지 못해 더듬은 말이 그대로 나온다.
결과 = 숨단위.txt: 원본 시작~끝 | 글 . 사용: python -X utf8 _도구/숨단위받아쓰기.py"""
import json, os, sys
import numpy as np, soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
from _귀 import 귀열기
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: os.path.join(여기, n)
x, sr = sf.read(J('a16k.wav'), dtype='float32')
# 살린구간.json 은 옛 공정의 결과물이다. 없으면(컷 전 첫 받아쓰기) 녹화 전체를 본다.
구간 = json.load(open(J('살린구간.json'), encoding='utf-8'))['프레임구간'] if os.path.exists(J('살린구간.json')) else [[0, int(len(x) / sr * 30)]]
칸 = int(sr * 0.01)
db = 20 * np.log10(np.sqrt(np.convolve(x**2, np.ones(칸 * 2) / (칸 * 2), mode='same')[::칸] + 1e-12))
조용선 = db[int(0.0):].copy()
THR = -38
덩 = []
for fa, fb in 구간:
    a, b = int(fa / 30 * 100), int(fb / 30 * 100)
    시작 = None; 조용수 = 0
    for k in range(a, min(b, len(db))):
        if db[k] >= THR:
            if 시작 is None: 시작 = k
            조용수 = 0; 마지막 = k
        elif 시작 is not None:
            조용수 += 1
            if 조용수 >= 10:
                덩.append((시작, 마지막)); 시작 = None
    if 시작 is not None: 덩.append((시작, min(마지막, b)))
# 짧은 덩어리는 이웃과 묶되 6초를 넘기지 않는다
묶음 = []
for s, e in 덩:
    if 묶음 and (e - 묶음[-1][0]) <= 600 and (s - 묶음[-1][1]) <= 40 and (묶음[-1][1] - 묶음[-1][0]) < 250:
        묶음[-1] = (묶음[-1][0], e)
    else:
        묶음.append((s, e))
print('덩어리', len(덩), '묶음', len(묶음))
m = 귀열기('large-v3')
PROMPT = '어, 음, 그, 저, 그니까, 자, 이제, 어… 그 그러니까 이게 이게 말이죠.'
줄 = []
for s, e in 묶음:
    a = max(0, s - 15) / 100; b = (e + 15) / 100
    seg, _ = m.transcribe(x[int(a * sr):int(b * sr)], language='ko', word_timestamps=True, condition_on_previous_text=False, initial_prompt=PROMPT, beam_size=5, temperature=0)
    ws = [w for g in seg for w in (g.words or [])]
    글 = ' '.join(f"{w.word.strip()}" for w in ws)
    긴 = [f"{w.word.strip()}({a + w.start:.2f}-{a + w.end:.2f})" for w in ws if w.end - w.start > 0.9]
    줄.append(f"{s / 100:8.2f} {e / 100:8.2f} | {글}" + (f"  ##긴말 {' '.join(긴)}" if 긴 else ''))
open(J('숨단위.txt'), 'w', encoding='utf-8').write('\n'.join(줄))
print('끝', len(줄))
