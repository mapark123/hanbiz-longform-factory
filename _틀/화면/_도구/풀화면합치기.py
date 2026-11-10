"""완본: 효과음 섞기 → 4K 겹침 층 나눠 찍기 → 원본 위에 합치기 → 검사.
이미 찍은 조각은 건너뛴다(끊겨도 이어서). 사용: python -X utf8 화면/_도구/전체합치기.py"""
import json, os, re, subprocess, sys, time
import numpy as np
import os, sys
_p = os.path.abspath(__file__)
while not os.path.exists(os.path.join(_p, '_공용', '_귀.py')) and os.path.dirname(_p) != _p: _p = os.path.dirname(_p)
sys.path.insert(0, os.path.join(_p, '_공용'))
import 경로
설 = 경로.설정(__file__); os.chdir(설['프로젝트'])  # 모든 경로는 프로젝트 폴더 기준
import 인코더
여기 = 설['프로젝트']
영상 = 설['기준영상']
D = json.loads(open('화면/풀화면데이터.js', encoding='utf-8').read().replace('window.D=', '').rstrip(';\n'))
길이 = D['길이']
env = {**os.environ, 'HANBIZ_SFX_LIB': 설['효과음라이브러리']}
t0 = time.time()
화면만 = '--화면만' in sys.argv
if not 화면만:
    섞기 = subprocess.run([sys.executable, '-X', 'utf8', '화면/_도구/효과음섞기.py'], capture_output=True, text=True, encoding='utf-8', env=env)
    if 섞기.returncode != 0: raise SystemExit('효과음 섞기 실패 — 렌더 중단\n' + 섞기.stderr[-800:])  # 옛 소리로 몰래 넘어가지 않는다
    print(섞기.stdout[-300:], flush=True)
곳 = '화면/찍은것/_완본'; os.makedirs(곳, exist_ok=True)
N = 5; 조각 = 30.0; 개수 = int(np.ceil(길이 / 조각))
할일 = [k for k in range(개수) if not os.path.exists(f'{곳}/{k:03d}.done')]
도는 = {}
while 할일 or 도는:
    while 할일 and len(도는) < N:
        k = 할일.pop(0); a, b = k * 조각, min(길이, (k + 1) * 조각)
        도는[k] = subprocess.Popen(['node', '화면/풀화면찍기.cjs', str(a), str(b), f'{곳}/{k:03d}.mov', '2'], stdout=subprocess.DEVNULL)
    time.sleep(3)
    for k, p in list(도는.items()):
        if p.poll() is None: continue
        if p.returncode: raise SystemExit(f'찍기 실패 {k}')
        open(f'{곳}/{k:03d}.done', 'w').close(); 도는.pop(k)
        print(f'조각 {k + 1}/{개수} · {round(time.time() - t0)}초', flush=True)
print('찍기 끝', round(time.time() - t0), '초', flush=True)
open(f'{곳}/목록.txt', 'w', encoding='utf-8').write('\n'.join(f"file '{여기}/{곳}/{k:03d}.mov'" for k in range(개수)))


def io(a, d):
    u = f'clip((t-{a:.3f})/{d},0,1)'
    return f'if(lt({u},0.5),4*pow({u},3),1-pow(-2*{u}+2,3)/2)'


항 = '+'.join(f"({io(p['열기'], .72)})*(1-({io(p['닫기'], .62)}))" for p in D['판'])
밀기 = f"-140*min(1,{항})"
필터 = f"[0:v]fps=60,format=yuv420p[v];color=c=black:s=3840x2160:r=60[k];[k][v]overlay=x='{밀기}':y=0:shortest=1[b];[b][1:v]overlay=0:0:format=auto,format=yuv420p[o]"
open(f'{곳}/필터.txt', 'w', encoding='utf-8').write(필터)
os.makedirs('완성', exist_ok=True)
결과 = f"완성/{설['제목']}_화면검수용.mp4" if 화면만 else f"완성/{설['제목']}_완본_4K60.mp4"
subprocess.run(['ffmpeg', '-v', 'error', '-stats', '-y', '-i', 영상, '-f', 'concat', '-safe', '0', '-i', f'{곳}/목록.txt', '-i', '화면/_소리_최종.wav',
                '-/filter_complex', f'{곳}/필터.txt', '-map', '[o]', '-map', '2:a', *인코더.최종옵션(), '-r', '60', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
                '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-t', str(길이), 결과], check=True)
print('합치기 끝', round(time.time() - t0), '초', flush=True)
print(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,nb_read_frames:format=duration,size', '-of', 'compact', 결과], capture_output=True, text=True).stdout[:400], flush=True)
