"""뒷 화면(찍은것/뒷화면.mp4) + 대표 얼굴 원(설정.json «기준영상» 의 원만 도려냄) + 소리(_소리_최종.wav) → 최종 4K 60fps.
얼굴 원(4K)·길이·자막 높이는 설정.json. 메타사기 실측 예: 중심 (365.5, 1797) · 반지름 320.
사용: python -X utf8 화면/_도구/최종합치기.py"""
import os, subprocess
import numpy as np
from PIL import Image
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__)


여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace(chr(92), '/')
뿌리 = os.path.dirname(여기)
대표 = 설['기준영상']; 총 = 설['길이']; 원 = 설.get('얼굴원_4K', {'cx': 365.5, 'cy': 1797, 'r': 320}); 자막y = (설.get('자막_위', 862) - 20) * 2
뒤 = f'{여기}/찍은것/뒷화면.mp4'
소리 = f'{여기}/_소리_최종.wav'
결과 = f"{뿌리}/완성/{설.get('제목', '롱폼')}_최종_4K60.mp4"
os.makedirs(os.path.dirname(결과), exist_ok=True)

# 원 마스크
yy, xx = np.mgrid[0:2160, 0:3840]
d = np.sqrt((xx - 원['cx']) ** 2 + (yy - 원['cy']) ** 2)
m = np.clip((원['r'] - .2 - d) / 1.2 + .5, 0, 1)
Image.fromarray((m * 255).astype(np.uint8)).save(f'{여기}/얼굴마스크4k.png')

# 자막(11/7 대표: 문장 단위 두 줄 · 귀 높이 · 정가운데 · 특별한 곳만 빨강·노랑) — 자막/그림/NNNN.png(3840×300) 을 시각대로 이어 붙임
import json
줄 = json.load(open(f'{여기}/자막/줄.json', encoding='utf-8')); 칸 = f'{여기}/자막/그림/빈칸.png'; 목록 = []; now = 0.0
for i, c in enumerate(줄):
    a0, b0 = c['t0'], min(c['t1'], 총)
    if b0 <= a0: continue
    if a0 > now + .001: 목록 += [f"file '{칸}'", f'duration {a0 - now:.3f}']
    목록 += [f"file '{여기}/자막/그림/{i:04d}.png'", f'duration {b0 - a0:.3f}']; now = b0
if now < 총: 목록 += [f"file '{칸}'", f'duration {총 - now:.3f}']
목록.append(f"file '{칸}'")
open(f'{여기}/자막/_자막목록.txt', 'w', encoding='utf-8').write(chr(10).join(목록))
필터 = (f"[1:v]format=rgba[얼원];[2:v]format=gray[마];[얼원][마]alphamerge[얼];"
        f"[0:v]fps=60,format=rgba[뒷];[뒷][얼]overlay=0:0:shortest=1[합];[4:v]fps=60,format=rgba[자];[합][자]overlay=0:{자막y}:eof_action=pass,format=yuv420p[out]")
subprocess.run(['ffmpeg', '-v', 'error', '-stats', '-y', '-i', 뒤, '-i', 대표, '-loop', '1', '-i', f'{여기}/얼굴마스크4k.png', '-i', 소리, '-f', 'concat', '-safe', '0', '-i', f'{여기}/자막/_자막목록.txt',
                '-filter_complex', 필터, '-map', '[out]', '-map', '3:a',
                '-c:v', 'hevc_nvenc', '-preset', 'p6', '-tune', 'hq', '-rc', 'vbr', '-cq', '18', '-b:v', '0', '-maxrate', '70M', '-bufsize', '140M', '-tag:v', 'hvc1',
                '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
                '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', str(총), 결과], check=True)
print('끝', 결과)
