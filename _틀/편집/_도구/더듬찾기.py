"""컷본 전체를 단어 시각으로 받아써서 «같은 말 반복·더듬은 앞 판»을 찾는다(11/7 대표: «대본 검수만 해도 나올 부분»).
낱말 둘이 붙어서 앞 2글자가 같거나(해킹한/해킹하는), 1~3낱말 묶음이 바로 다시 나오면 후보. 사용: python -X utf8 _도구/더듬찾기.py → 더듬후보.txt"""
import os, sys, re
import soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
from _귀 import 귀열기
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
x, sr = sf.read(os.path.join(여기, '_컷16k.wav'), dtype='float32')
m = 귀열기('large-v3')
ws = []
for c in range(0, int(len(x) / sr), 25):  # 30초 창을 25초씩(겹침 5초)
    seg, _ = m.transcribe(x[int(c * sr):int((c + 30) * sr)], language='ko', word_timestamps=True, condition_on_previous_text=False, beam_size=5, temperature=0,
                          initial_prompt='어, 음, 그, 저, 그니까, 이제, 그 그 그러니까 이게 이게')
    for g in seg:
        for w in g.words:
            t = c + w.start
            if (c == 0 or w.start >= 2.5) and (w.start < 27.5 or c + 30 >= len(x) / sr):
                ws.append((t, re.sub(r'[^가-힣0-9A-Za-z]', '', w.word)))
ws = [w for w in ws if w[1]]
ws.sort()
줄 = []
for i in range(len(ws) - 1):
    a, b = ws[i][1], ws[i + 1][1]
    if a == b or (len(a) >= 2 and len(b) >= 2 and a[:2] == b[:2]):
        줄.append(f'{int(ws[i][0]//60)}:{ws[i][0]%60:05.2f} 낱말 | ' + ' '.join(w[1] for w in ws[max(0, i - 4):i + 6]))
    for n in (2, 3):
        if i + 2 * n <= len(ws) and [w[1] for w in ws[i:i + n]] == [w[1] for w in ws[i + n:i + 2 * n]]:
            줄.append(f'{int(ws[i][0]//60)}:{ws[i][0]%60:05.2f} 묶음{n} | ' + ' '.join(w[1] for w in ws[max(0, i - 3):i + 2 * n + 3]))
open(os.path.join(여기, '더듬후보.txt'), 'w', encoding='utf-8').write('\n'.join(줄))
open(os.path.join(여기, '컷본_단어.txt'), 'w', encoding='utf-8').write(' '.join(f'{w[1]}[{w[0]:.2f}]' for w in ws))
print('\n'.join(줄)); print('후보', len(줄))
