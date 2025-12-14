// data/localProducts.js

// 여기 image 경로는 public 폴더 기준입니다.
// 예: public/images/products/faux-fur-hooded-jacket.jpg 이런 식으로 넣어두면 됨.

const localProducts = [
  {
    id: "essential-wool-turtleneck",
    name: "essential-wool-turtleneck",
    price: 159600,
    originalPrice: 168000,
    image: "/images/product_1.jpeg",
    images: [
      "/images/product_detail_1.jpeg",
      "/images/product_detail_2.jpeg",
    ],
    soldOut: false,
  }
];

module.exports = localProducts;
