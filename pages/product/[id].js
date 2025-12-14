// pages/product/[id].js
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

const FAVORITES_KEY = "draperyFavorites";
const CART_KEY = "draperyCart";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  // ------------------------------
  // 1. API에서 전체 상품 불러오기
  // ------------------------------
  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("상품 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ------------------------------
  // 2. 로컬 저장된 즐겨찾기/카트 로드
  // ------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const favRaw = localStorage.getItem(FAVORITES_KEY);
    const cartRaw = localStorage.getItem(CART_KEY);
    if (favRaw) setFavorites(JSON.parse(favRaw));
    if (cartRaw) setCart(JSON.parse(cartRaw));
  }, []);

  const product = useMemo(() => {
    return products.find((p) => p.id == id);
  }, [products, id]);

  // ------------------------------
  // 3. 즐겨찾기 토글
  // ------------------------------
  const toggleFavorite = () => {
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const arr = Array.from(set);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
      return arr;
    });
  };

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === id);
      let updated;

      if (existing) {
        updated = prev.map((p) =>
          p.id === id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        updated = [...prev, { ...product, qty: 1 }];
      }

      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) return <p style={{ padding: 40 }}>로딩중…</p>;
  if (error) return <p style={{ padding: 40, color: "red" }}>{error}</p>;
  if (!product)
    return (
      <div style={{ padding: 40 }}>
        <p>상품을 찾을 수 없습니다.</p>
        <button onClick={() => router.push("/")}>← 홈으로</button>
      </div>
    );

  const isFav = favorites.includes(id);

  // -----------------------------------------------------------
  // 상세페이지 UI (DRAPERY 스타일 유사하게 구현)
  // -----------------------------------------------------------
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>Cerisier</div>
        <button onClick={() => router.push("/")} style={styles.backBtn}>
          ← 리스트로 돌아가기
        </button>
      </header>

      <main style={styles.main}>
        {/* LEFT: 상품 이미지 */}
        <div style={styles.left}>
          {product.image ? (
            <img
              src={product.image}
              loading="lazy"
              style={styles.productImage}
            />
          ) : (
            <div style={styles.imagePlaceholder} />
          )}
        </div>

        {/* RIGHT: 상품 정보 */}
        <div style={styles.right}>
          <h1 style={styles.name}>{product.name}</h1>

          <div style={styles.priceBox}>
            {product.price && (
              <div style={styles.price}>
                {product.price.toLocaleString()}원
              </div>
            )}
            {product.originalPrice && (
              <div style={styles.originalPrice}>
                {product.originalPrice.toLocaleString()}원
              </div>
            )}
          </div>

          <div style={styles.line} />

          {/* 즐겨찾기 */}
          <button onClick={toggleFavorite} style={styles.favBtn}>
            {isFav ? "♥ 즐겨찾기 해제" : "♡ 즐겨찾기"}
          </button>

          {/* 장바구니 */}
          <button onClick={addToCart} style={styles.cartBtn}>
            장바구니 담기
          </button>

          <div style={styles.infoBox}>
            <div>📦 배송비 3,000원 / 8만원 이상 무료배송</div>
            <div>🚚 제주/도서지역 +3,000원</div>
          </div>
        </div>
      </main>
    </div>
  );
}

//
// STYLE OBJECTS
//
const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    paddingBottom: "80px",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    padding: "30px 60px",
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "26px",
    letterSpacing: "0.25em",
  },
  backBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    padding: "40px 60px",
    gap: "60px",
  },
  left: {},
  right: {
    paddingTop: "20px",
  },
  productImage: {
    width: "100%",
    background: "#f4f4f4",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    paddingBottom: "140%",
    background: "#eee",
  },
  name: {
    fontSize: "22px",
    marginBottom: "20px",
    textTransform: "lowercase",
  },
  priceBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px",
    alignItems: "center",
  },
  price: {
    fontSize: "20px",
    color: "#c38b52",
  },
  originalPrice: {
    fontSize: "14px",
    textDecoration: "line-through",
    color: "#aaa",
  },
  line: {
    height: "1px",
    background: "#eee",
    margin: "20px 0",
  },
  favBtn: {
    padding: "10px 14px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    marginBottom: "10px",
  },
  cartBtn: {
    padding: "12px 14px",
    borderRadius: "20px",
    border: "1px solid #222",
    background: "#222",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "20px",
  },
  infoBox: {
    marginTop: "20px",
    lineHeight: 1.6,
    fontSize: "13px",
    color: "#666",
  },
};
