"""효과음마다 실제로 들어간 크기를 잰다: 목표 최대치 대비 얼마나 눌렸는가 + 그 순간 목소리 크기.
목소리 차이도 효과음섞기와 같은 방식으로 전체를 읽어 다시 잰다."""
import json, subprocess
import numpy as np, soundfile as sf
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__); os.chdir(설['프로젝트'])  # 모든 경로는 프로젝트 폴더 기준
영상 = 설['기준영상']
SR = 48000
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', 영상, '-vn', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
목 = np.frombuffer(r, np.float32).reshape(-1, 2)
합, _ = sf.read('화면/_소리_최종.wav', dtype='float32'); 효, _ = sf.read('화면/_효과음만.wav', dtype='float32')
n = min(len(목), len(합))
print('길이', len(목), len(합), '· 목소리 차이 최대', float(np.abs(합[:n] - 효[:n] - 목[:n]).max()))
print('목소리 0dB 넘는 샘플', int((np.abs(목) > 1).sum()), '· -1dB 넘는 샘플', int((np.abs(목) > 10 ** (-1 / 20)).sum()), '/', len(목) * 2)
배 = json.load(open('화면/배치도.json', encoding='utf-8'))
print('시각 / 실제 크기dB / 그 순간 목소리 최대dB / 이름')
for e in 배[0]['효과음']:
    a = int(e['t'] * SR); b = a + int(.35 * SR)
    pk = 20 * np.log10(np.abs(효[a:b]).max() + 1e-9); mv = 20 * np.log10(np.abs(목[a:b]).max() + 1e-9)
    print(f"{e['t']:7.2f} {pk:7.1f} {mv:7.1f}  {e['이름']}")
