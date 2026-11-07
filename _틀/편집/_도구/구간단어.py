"""정한 구간만 잘게 다시 받아써 단어 시각을 찍는다(전체 받아쓰기는 다시 말한 부분을 합쳐 시각이 뭉개짐).
사용: python -X utf8 _도구/구간단어.py 26:32 143:149 ...  → 결과 구간단어.txt 에 덧붙임"""
import os, sys
import numpy as np, soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
from _귀 import 귀열기
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
x, sr = sf.read(os.path.join(여기, 'a16k.wav'), dtype='float32')
m = 귀열기('large-v3')
PROMPT = '어, 음, 그, 저, 그니까, 자, 이제, 어… 그 그러니까 이게 이게 말이죠.'
줄 = []
for arg in sys.argv[1:]:
    a, b = map(float, arg.split(':'))
    seg, _ = m.transcribe(x[int(a * sr):int(b * sr)], language='ko', word_timestamps=True, condition_on_previous_text=False, initial_prompt=PROMPT, beam_size=5, temperature=0)
    ws = [w for g in seg for w in (g.words or [])]
    줄.append(f'--- {a}-{b}\n' + ' '.join(f'{w.word.strip()}[{a + w.start:.2f}-{a + w.end:.2f}]' for w in ws))
open(os.path.join(여기, '구간단어.txt'), 'a', encoding='utf-8').write('\n'.join(줄) + '\n')
print('\n'.join(줄))
