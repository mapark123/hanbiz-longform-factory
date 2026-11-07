"""실제 사례 캡처 → 개인정보 가린 사본(재료/실제사례_가림/). 원본은 건드리지 않는다.
가림 = 픽셀 모자이크(8px) + 흐림 두 번 → 확대해도 글자·얼굴 복원 안 됨. 영상에는 이 폴더만 쓴다.
사용: python -X utf8 재료/_도구/가리기.py"""
import os, shutil
from PIL import Image, ImageFilter, ImageDraw

여기 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
원 = os.path.join(여기, '실제사례'); 곳 = os.path.join(여기, '실제사례_가림')
os.makedirs(곳, exist_ok=True)
# 번호: [(x0, y0, x1, y1, 무엇)]  — 좌표는 원본 픽셀
가림 = {
 '01': [(96, 266, 166, 287, '페이지명(수신줄) — 글자 픽셀로 잰 자리'), (250, 266, 375, 287, '수강생 이메일(수신줄)'),
        (148, 329, 212, 349, '권리자 이름(본문)'), (396, 609, 484, 630, '페이지명(본문)'),
        (590, 836, 684, 858, '페이지명 칸'), (555, 878, 684, 900, '페이지 ID 칸'),
        (625, 920, 684, 942, '권리자 칸'), (530, 961, 684, 984, '수신 이메일 칸')],
 '03': [(12, 40, 62, 90, '프로필 사진'), (150, 46, 194, 67, '이름(156~188)'), (164, 71, 256, 92, '페이지명'),
        (10, 372, 64, 430, '프로필 사진(둘째)'), (150, 380, 196, 400, '이름(둘째 · y384~395 실측)'), (60, 400, 214, 499, '메일 캡처 사진')],
 '11': [(12, 0, 62, 46, '프로필 사진'), (142, 0, 186, 19, '이름(147~179)'), (12, 177, 62, 225, '프로필 사진'), (142, 179, 186, 199, '이름')],
 '12': [(12, 44, 62, 94, '프로필 사진'), (142, 50, 186, 70, '이름')],
 '16': [(68, 348, 566, 370, '업체명')],
 '15': [(20, 86, 72, 137, '로고'), (74, 112, 154, 134, '회사 이름')],
 '10': [(122, 144, 314, 168, '대표 회사 이름')],
}
def 모자이크(im, box):
    x0, y0, x1, y1 = box
    조 = im.crop(box)
    w, h = 조.size
    작 = 조.resize((max(1, w // 8), max(1, h // 8)), Image.BILINEAR)
    조 = 작.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(3)).filter(ImageFilter.GaussianBlur(2))
    im.paste(조, (x0, y0))

for f in sorted(os.listdir(원)):
    if not f.lower().endswith('.png'): continue
    n = f[:2]
    새이름 = f.replace('_원본_가릴것있음', '').replace('_원본_이름가릴것', '').replace('_원본_업체명가릴것', '')
    if n in 가림:
        im = Image.open(os.path.join(원, f)).convert('RGB')
        for *box, _ in 가림[n]: 모자이크(im, tuple(box))
        새이름 = 새이름.replace('.png', '_가림.png')
        im.save(os.path.join(곳, 새이름))
        print('가림', 새이름, len(가림[n]), '곳')
    else:
        shutil.copy2(os.path.join(원, f), os.path.join(곳, 새이름))
        print('그대로', 새이름)

# 확인판: 가린 사본만 2배로 키워 한 장에(가린 칸에 빨간 테두리)
판들 = []
for f in sorted(os.listdir(곳)):
    if '_가림' not in f: continue
    im = Image.open(os.path.join(곳, f)).convert('RGB')
    im2 = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
    d = ImageDraw.Draw(im2)
    for *b, _ in 가림[f[:2]]:
        d.rectangle([b[0] * 2 - 2, b[1] * 2 - 2, b[2] * 2 + 2, b[3] * 2 + 2], outline=(230, 30, 30), width=3)
    판들.append(im2)
W = max(p.width for p in 판들); H = sum(p.height for p in 판들) + 20 * len(판들)
판 = Image.new('RGB', (W, H), (40, 40, 40)); y = 0
for p in 판들: 판.paste(p, (0, y)); y += p.height + 20
판.save(os.path.join(여기, '_가림확인판.jpg'), quality=85)
print('확인판', 판.size)
