// pages/local/product/[id].js
const React = require("react");
const { useRouter } = require("next/router");
const { useEffect, useState } = React;
const localProducts = require("../../../data/localProducts");

const FAVORITES_KEY = "draperyLocalFavorites";
const CART_KEY = "draperyLocalCart";

function LocalProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const product = localProducts.find((p) => p.id === id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const favRaw = window.localStorage.getItem(FAVORITES_KEY);
      const cartRaw = window.localStorage.getItem(CART_KEY);
      if (favRaw) setFavorites(JSON.parse(favRaw));
      if (cartRaw) setCart(JSON.parse(cartRaw));
    } catch (e) {}
  }, [mounted]);

  const isFav = favorites.includes(id);

  const toggleFavorite = () => {
    if (!id || !mounted) return;
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const arr = Array.from(set);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
      return arr;
    });
  };

  const addToCart = () => {
    if (!product || !mounted) return;
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((p) =>
          p.id === product.id ? { ...p, qty: (p.qty || 0) + 1 } : p
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images && product.images[0],
            qty: 1,
          },
        ];
      }
      window.localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  if (!mounted) return null;

  if (!product) {
    return React.createElement(
      "div",
      { style: { padding: 40 } },
      React.createElement("p", null, "상품을 찾을 수 없습니다."),
      React.createElement(
        "button",
        { onClick: () => router.push("/local") },
        "← 리스트로"
      )
    );
  }

  const { name, price, originalPrice, images, soldOut } = product;
  const mainImage = images && images.length > 0 ? images[mainImageIndex] : null;

  return React.createElement(
    "div",
    { style: styles.page },
    React.createElement(
      "header",
      { style: styles.header },
      React.createElement("div", { style: styles.logo }, "Cerisier"),
      React.createElement(
        "button",
        { style: styles.backBtn, onClick: () => router.push("/local") },
        "← 리스트로 돌아가기"
      )
    ),
    React.createElement(
      "main",
      { style: styles.main },
      // LEFT
      React.createElement(
        "div",
        { style: styles.left },
        React.createElement(
          "div",
          { style: styles.mainImageBox },
          mainImage
            ? React.createElement("img", {
                src: mainImage,
                style: styles.mainImage,
                alt: name,
              })
            : React.createElement("div", { style: styles.mainImagePlaceholder }),
          soldOut &&
            React.createElement(
              "div",
              { style: styles.soldOutTag },
              "SOLD OUT"
            )
        ),
        images &&
          images.length > 1 &&
          React.createElement(
            "div",
            { style: styles.thumbRow },
            images.map((src, idx) =>
              React.createElement(
                "button",
                {
                  key: src,
                  onClick: () => setMainImageIndex(idx),
                  style: Object.assign(
                    {},
                    styles.thumbButton,
                    idx === mainImageIndex ? styles.thumbButtonActive : {}
                  ),
                },
                React.createElement("img", {
                  src,
                  style: styles.thumbImage,
                  alt: `${name} ${idx + 1}`,
                })
              )
            )
          )
      ),
      // RIGHT
      React.createElement(
        "div",
        { style: styles.right },
        React.createElement("h1", { style: styles.name }, name),
        React.createElement(
          "div",
          { style: styles.priceBox },
          price != null &&
            React.createElement(
              "div",
              { style: styles.price },
              price.toLocaleString(),
              "원"
            ),
          originalPrice != null &&
            React.createElement(
              "div",
              { style: styles.originalPrice },
              originalPrice.toLocaleString(),
              "원"
            )
        ),
        React.createElement("div", { style: styles.line }),
        React.createElement(
          "div",
          { style: { marginBottom: 16 } },
          React.createElement(
            "button",
            { style: styles.favBtn, onClick: toggleFavorite },
            isFav ? "♥ 즐겨찾기 해제" : "♡ 즐겨찾기"
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "button",
            {
              style: styles.cartBtn,
              onClick: addToCart,
              disabled: soldOut,
            },
            soldOut ? "품절된 상품입니다" : "장바구니 담기"
          )
        ),
        React.createElement(
          "div",
          { style: styles.infoBox },
          React.createElement(
            "p",
            null,
            "📦 배송비 3,000원 (8만원 이상 무료배송)"
          ),
          React.createElement(
            "p",
            null,
            "🚚 제주·도서 지역 추가 3,000원"
          )
        )
      )
    )
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    padding: "24px 60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 26,
    letterSpacing: "0.25em",
  },
  backBtn: {
    border: "none",
    background: "transparent",
    fontSize: 14,
    cursor: "pointer",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    padding: "20px 60px 60px",
    gap: "60px",
  },
  left: {},
  right: {
    paddingTop: 20,
  },
  mainImageBox: {
    position: "relative",
    background: "#f3f3f3",
  },
  mainImage: {
    width: "100%",
    display: "block",
    objectFit: "cover",
  },
  mainImagePlaceholder: {
    width: "100%",
    paddingBottom: "140%",
    background: "#eee",
  },
  soldOutTag: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: "4px 8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: 11,
    letterSpacing: "0.1em",
  },
  thumbRow: {
    marginTop: 16,
    display: "flex",
    gap: 8,
    overflowX: "auto",
  },
  thumbButton: {
    border: "1px solid #ddd",
    padding: 0,
    background: "#fff",
    cursor: "pointer",
  },
  thumbButtonActive: {
    border: "2px solid #222",
  },
  thumbImage: {
    width: 70,
    height: 90,
    objectFit: "cover",
    display: "block",
  },
  name: {
    fontSize: 22,
    marginBottom: 16,
    textTransform: "lowercase",
  },
  priceBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#c38b52",
  },
  originalPrice: {
    fontSize: 14,
    textDecoration: "line-through",
    color: "#aaa",
  },
  line: {
    height: 1,
    background: "#eee",
    margin: "18px 0",
  },
  favBtn: {
    padding: "10px 16px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  cartBtn: {
    padding: "12px 16px",
    borderRadius: 20,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    fontSize: 14,
  },
  infoBox: {
    marginTop: 24,
    fontSize: 13,
    lineHeight: 1.6,
    color: "#555",
  },
};

module.exports = LocalProductDetail;
