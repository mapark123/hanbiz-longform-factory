"""_미리/뒷화면/*.jpg 를 얼굴 원 자리를 그려 한 장으로 모은다. 사용: python -X utf8 _도구/미리판.py [시작초 끝초] → _미리/판.jpg"""
import glob, os, sys
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # 어디서 실행해도 화면/ 기준
from PIL import Image, ImageDraw
fs = sorted(glob.glob('_미리/뒷화면/*.jpg'))
if len(sys.argv) > 2:
    a, b = float(sys.argv[1]), float(sys.argv[2]); fs = [f for f in fs if a <= int(os.path.basename(f)[:-4]) / 10 <= b]
열 = 4; w = 640; h = 360
판 = Image.new('RGB', (열 * w, ((len(fs) + 열 - 1) // 열) * (h + 26)), (30, 30, 30)); d = ImageDraw.Draw(판)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((w, h)); dd = ImageDraw.Draw(im)
    k = w / 1920; dd.ellipse([22 * k, 738 * k, 342 * k, 1058 * k], outline=(0, 255, 120), width=2)
    x, y = (i % 열) * w, (i // 열) * (h + 26); 판.paste(im, (x, y + 26)); d.text((x + 6, y + 4), f'{int(os.path.basename(f)[:-4]) / 10:.1f}s', fill=(255, 255, 0))
판.save('_미리/판.jpg', quality=82); print(판.size, len(fs))
