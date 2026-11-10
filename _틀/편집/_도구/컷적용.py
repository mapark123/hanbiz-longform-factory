"""컷구간.json 대로 원본을 잘라 이어 붙인다.
- 영상: 프레임(1/30초)에 맞춰 select · 10비트 원본이라 yuv420p 로 찍는다(11/5 함정: High 10 이면 윈도우 플레이어가 깨진 파일이라 함)
- 소리: 48k 원본을 같은 프레임 경계로 잘라 numpy 로 이어 붙이고 이음매마다 5ms 페이드(딸깍 소리 방지)
- filter_complex 한 줄에 select·aselect 를 같이 넣으면 145조각에서 ffmpeg 가 "Cannot allocate memory" 로 죽음(11/7 실측) → 지난번처럼 영상 필터 파일 + 소리 따로
사용: python -X utf8 _도구/컷적용.py [출력이름]  (기본 컷본_v1.mp4)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: os.path.join(여기, n)
K = json.load(open(J('컷구간.json'), encoding='utf-8'))['초구간']
FPS = 30
조각 = []
for a, b in K:
    fa, fb = round(a * FPS), round(b * FPS)
    if fb > fa:
        조각.append((fa, fb))

# 소리
x, sr = sf.read(J('a48k.wav'), dtype='float32')
페 = int(sr * 0.005)
조 = []
for fa, fb in 조각:
    s = x[int(fa / FPS * sr):int(fb / FPS * sr)].copy()
    if len(s) > 페 * 2:
        s[:페] *= np.linspace(0, 1, 페)
        s[-페:] *= np.linspace(1, 0, 페)
    조.append(s)
sf.write(J('_컷소리.wav'), np.concatenate(조), sr)

# 영상
# ffmpeg 식 해석기는 + 를 145개 이어 쓰면 "Cannot allocate memory" 로 죽음(11/7 실측) → 12개씩 괄호로 묶어 깊이를 줄임
항 = [f'between(n,{fa},{fb - 1})' for fa, fb in 조각]
식 = '+'.join('(' + '+'.join(항[i:i + 12]) + ')' for i in range(0, len(항), 12))
open(J('_영상필터.txt'), 'w', encoding='utf-8').write(f"fps={FPS}:round=near,select='{식}',setpts=N/{FPS}/TB,format=yuv420p")  # select 의 n 은 프레임 번호라, 60fps·가변 원본도 먼저 30fps 로 맞춰야 소리와 같은 자리를 자른다
출력 = J(sys.argv[1] if len(sys.argv) > 1 else '컷본_v1.mp4')
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로, 인코더
원본 = 경로.설정(__file__)['원본녹화']  # 설정.json «원본녹화»
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 원본, '-i', J('_컷소리.wav'), '-/filter:v', J('_영상필터.txt'),
                '-map', '0:v', '-map', '1:a', *인코더.컷옵션(), '-r', str(FPS), '-fps_mode', 'cfr',
                '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-shortest', 출력], check=True)
print('조각', len(조각), '예상 길이', round(sum(fb - fa for fa, fb in 조각) / FPS, 2), '→', 출력)
