// data/products.js
export const PRODUCTS = [
  {
    id: "faux-fur-hooded-jacket",
    name: "faux fur hooded jacket",
    price: 159600,
    originalPrice: 168000,
    category: "outer",
    soldOut: false,
    image: "/images/product1.jpg",
  },
  {
    id: "essential-wool-turtleneck",
    name: "essential wool turtleneck",
    price: 58900,
    originalPrice: 62000,
    category: "top",
    soldOut: true,
    image: "/images/product2.jpg",
  },
  {
    id: "soft-mohair-knit",
    name: "soft mohair knit",
    price: 63900,
    originalPrice: 69000,
    category: "top",
    soldOut: false,
    image: "/images/product3.jpg",
  },
  {
    id: "daily-straight-denim",
    name: "daily straight denim",
    price: 49900,
    originalPrice: 54900,
    category: "bottom",
    soldOut: false,
    image: "/images/product4.jpg",
  },
  {
    id: "wool-long-skirt",
    name: "wool long skirt",
    price: 55900,
    originalPrice: 59900,
    category: "bottom",
    soldOut: true,
    image: "/images/product5.jpg",
  },
  {
    id: "round-neck-cardigan",
    name: "round neck cardigan",
    price: 67900,
    originalPrice: 72000,
    category: "outer",
    soldOut: false,
    image: "/images/product6.jpg",
  },
  {
    id: "teddy-muffler",
    name: "teddy muffler",
    price: 29900,
    originalPrice: 32000,
    category: "accessories",
    soldOut: false,
    image: "/images/product7.jpg",
  },
  {
    id: "basic-wool-beanie",
    name: "basic wool beanie",
    price: 25900,
    originalPrice: 28000,
    category: "accessories",
    soldOut: false,
    image: "/images/product8.jpg",
  },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}
