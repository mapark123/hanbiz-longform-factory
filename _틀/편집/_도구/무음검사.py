"""무음만 잘랐나 검사(11/7 대표: «무음을 편집해야지 끝음을 편집하면 안 됨»).
이어 붙이며 버린 구간마다, 일부러 지운 말(지움)·숨 을 뺀 나머지에 소리(-42dB 이상)가 남아 있으면 = 말소리를 잘라 먹은 것.
사용: python -X utf8 _도구/무음검사.py → 무음검사.txt (0곳이어야 통과)"""
import json, os
import numpy as np, soundfile as sf
여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: os.path.join(여기, n)
x, sr = sf.read(J('a16k.wav'), dtype='float32')
db = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(320) / 320, mode='same')[::160] + 1e-12))
C = json.load(open(J('컷구간.json'), encoding='utf-8'))
K, 지움, 숨 = C['초구간'], C['지움'], C['숨']
의도 = np.zeros(len(db), bool)
for a, b, *_ in 지움 + 숨:
    의도[int(round(a * 100)):int(round(b * 100))] = True
버림 = [(0, K[0][0])] + [(K[i][1], K[i + 1][0]) for i in range(len(K) - 1)] + [(K[-1][1], C['원본초'])]
줄 = []
for a, b in 버림:
    ks = np.arange(int(round(a * 100)), int(round(b * 100)))
    ks = ks[(ks < len(db))]
    소리 = ks[(db[ks] > -42) & ~의도[ks]]
    if len(소리) >= 2:
        줄.append(f'{a:7.2f}~{b:7.2f} 버린 곳 안 말소리 {len(소리) / 100:.2f}초 ({소리[0] / 100:.2f}~{소리[-1] / 100:.2f}, 최대 {db[소리].max():.0f}dB)')
open(J('무음검사.txt'), 'w', encoding='utf-8').write('\n'.join(줄))
print('\n'.join(줄)); print('실패', len(줄), '/ 버린 곳', len(버림))
