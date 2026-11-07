"""WPE 울림 제거(30초씩 겹쳐 처리). 사용: python 울림줄이기.py 입력.wav 출력.wav (48k 모노)"""
import sys, numpy as np, soundfile as sf
from nara_wpe.wpe import wpe
from nara_wpe.utils import stft, istft
x, sr = sf.read(sys.argv[1], dtype='float32')
if x.ndim > 1: x = x.mean(1)
size, shift = 1024, 256
덩 = sr * 30; 겹 = sr
out = np.zeros(len(x), dtype=np.float32); w = np.zeros(len(x), dtype=np.float32)
for s in range(0, len(x), 덩 - 겹):
    c = x[s:s + 덩]
    if len(c) < 2048: break
    Y = stft(c[None], size=size, shift=shift).transpose(2, 0, 1)
    Z = wpe(Y, taps=int(sys.argv[3]) if len(sys.argv) > 3 else 10, delay=3, iterations=3, statistics_mode='full').transpose(1, 2, 0)
    z = istft(Z, size=size, shift=shift)[0][:len(c)]
    r = np.ones(len(z), dtype=np.float32); k = min(겹, len(z) // 2)
    r[:k] = np.linspace(0, 1, k); r[-k:] = np.linspace(1, 0, k)
    out[s:s + len(z)] += z * r; w[s:s + len(z)] += r
sf.write(sys.argv[2], out / np.maximum(w, 1e-3), sr, subtype='PCM_24')
