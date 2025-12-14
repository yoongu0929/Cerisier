# Drapery-style Shop Clone

DRAPERY 쇼핑몰 느낌으로 만든 간단한 정적 쇼핑몰 클론입니다.
크롤링이나 결제 기능 없이, 리스트 페이지와 상품 상세 페이지 레이아웃만 구성되어 있습니다.

## 기능

- `/` : 상품 리스트 페이지
  - 좌측 카테고리 메뉴 (All, top, bottom, outer, accessories)
  - DRAPERY 느낌의 4열 그리드 카드 레이아웃
  - SOLD OUT 뱃지, 세일가/정가 표시
- `/product/[id]` : 상품 상세 페이지
  - 좌측 큰 이미지 영역 (현재는 플레이스홀더)
  - 우측 상품명, 가격, 배송비 안내, 컬러 선택, 품절 안내, 버튼 영역

이미지 파일은 `/public/images/product1.jpg` ~ `product8.jpg` 로 들어 있으며,
모두 회색 플레이스홀더입니다. 원하시는 사진으로 동일한 파일명을 교체하면 됩니다.

## 사용 방법

1. 의존성 설치

```bash
npm install
```

2. 개발 서버 실행

```bash
npm run dev
```

3. 브라우저에서 접속

```text
http://localhost:3000
```

## 이미지 교체

- `/public/images/product1.jpg` ~ `product8.jpg` 파일을
  본인이 준비한 상품 이미지로 덮어쓰기 하면 됩니다.
- 혹은 `data/products.js` 의 `image` 필드를 수정하여
  다른 파일명을 사용할 수도 있습니다.
