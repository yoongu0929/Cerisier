// // pages/index.js
// import { useEffect, useMemo, useState } from "react";

// const CATEGORIES = ["all", "top", "bottom", "outer", "accessories"];
// const SORT_OPTIONS = [
//   { value: "popular", label: "인기순" },
//   { value: "priceAsc", label: "가격 낮은순" },
//   { value: "priceDesc", label: "가격 높은순" },
//   { value: "nameAsc", label: "이름순" },
// ];

// function inferCategory(name = "") {
//   const n = name.toLowerCase();
//   if (/(jacket|coat|cardigan|outer)/.test(n)) return "outer";
//   if (/(skirt)/.test(n)) return "bottom";
//   if (/(denim|jean|pants|trouser)/.test(n)) return "bottom";
//   if (/(knit|turtleneck|sweater|top|tee|shirt|blouse)/.test(n)) return "top";
//   if (/(muffler|scarf|beanie|hat|bag|cap|belt|acc)/.test(n))
//     return "accessories";
//   return "top";
// }

// const FAVORITES_KEY = "draperyFavorites";
// const CART_KEY = "draperyCart";

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [category, setCategory] = useState("all");
//   const [sortKey, setSortKey] = useState("popular");

//   const [visibleCount, setVisibleCount] = useState(12);

//   const [favorites, setFavorites] = useState([]);
//   const [cart, setCart] = useState([]);

//   // 1) API 호출
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch("/api/products");
//         if (!res.ok) throw new Error("API Error");
//         const data = await res.json();
//         setProducts(data.products || []);
//       } catch (e) {
//         console.error(e);
//         setError("상품을 불러오는 중 문제가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   // 2) localStorage 초기화
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const fav = window.localStorage.getItem(FAVORITES_KEY);
//       const ct = window.localStorage.getItem(CART_KEY);
//       if (fav) setFavorites(JSON.parse(fav));
//       if (ct) setCart(JSON.parse(ct));
//     } catch (e) {
//       console.warn(e);
//     }
//   }, []);

//   // local 저장
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
//   }, [favorites]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
//   }, [cart]);

//   // 3) 카테고리/정렬 적용
//   const processed = useMemo(() => {
//     const withCat = products.map((p) => ({
//       ...p,
//       category: inferCategory(p.name),
//     }));

//     let filtered =
//       category === "all"
//         ? withCat
//         : withCat.filter((p) => p.category === category);

//     let sorted = [...filtered];

//     switch (sortKey) {
//       case "priceAsc":
//         sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
//         break;
//       case "priceDesc":
//         sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
//         break;
//       case "nameAsc":
//         sorted.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "popular":
//       default:
//         break;
//     }

//     return sorted;
//   }, [products, category, sortKey]);

//   const totalCount = processed.length;

//   // 4) 무한 스크롤
//   useEffect(() => {
//     setVisibleCount(12);
//   }, [category, sortKey, totalCount]);

//   useEffect(() => {
//     function onScroll() {
//       if (
//         window.innerHeight + window.scrollY >
//         document.body.offsetHeight - 300
//       ) {
//         setVisibleCount((prev) => Math.min(prev + 12, totalCount));
//       }
//     }
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [totalCount]);

//   const visibleProducts = processed.slice(0, visibleCount);

//   // 5) 즐겨찾기/장바구니
//   const toggleFavorite = (id) => {
//     setFavorites((prev) => {
//       const set = new Set(prev);
//       if (set.has(id)) set.delete(id);
//       else set.add(id);
//       return Array.from(set);
//     });
//   };

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const existing = prev.find((p) => p.id === product.id);
//       if (!existing) {
//         return [...prev, { ...product, qty: 1 }];
//       }
//       return prev.map((p) =>
//         p.id === product.id ? { ...p, qty: p.qty + 1 } : p
//       );
//     });
//   };

//   const favoritesCount = favorites.length;
//   const cartCount = cart.reduce((sum, p) => sum + (p.qty || 0), 0);

//   // --------------------------------------------------
//   // UI 렌더링 (Tailwind 없이 inline-style)
//   // --------------------------------------------------
//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <header style={styles.header}>
//         <div style={styles.logo}>Cerisier</div>

//         <nav style={styles.nav}>
//           <span style={styles.navItem}>Notice</span>
//           <span style={styles.navItem}>Shop</span>
//           <span style={styles.navItem}>Q&A</span>
//           <span style={styles.navItem}>Review</span>
//         </nav>

//         <div style={{ display: "flex", gap: "16px" }}>
//           <div style={styles.headerRightItem}>♥ {favoritesCount}</div>
//           <div style={styles.headerRightItem}>🛒 {cartCount}</div>
//         </div>
//       </header>

//       {/* FILTERS */}
//       <div style={styles.filterBar}>
//         <div style={styles.filterText}>총 {totalCount}개 상품</div>

//         <select
//           style={styles.sortSelect}
//           value={sortKey}
//           onChange={(e) => setSortKey(e.target.value)}
//         >
//           {SORT_OPTIONS.map((s) => (
//             <option key={s.value} value={s.value}>
//               {s.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       <main style={styles.main}>
//         {/* LEFT CATEGORY */}
//         <aside style={styles.sidebar}>
//           {CATEGORIES.map((c) => (
//             <div
//               key={c}
//               onClick={() => setCategory(c)}
//               style={{
//                 ...styles.categoryItem,
//                 ...(c === category ? styles.categoryActive : {}),
//               }}
//             >
//               {c}
//             </div>
//           ))}
//         </aside>

//         {/* PRODUCT GRID */}
//         <section style={styles.grid}>
//           {loading && <p>로딩중...</p>}
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           {visibleProducts.map((p, idx) => {
//             const isFav = favorites.includes(p.id);

//             return (
//               <div
//                 key={p.id}
//                 style={{
//                   ...styles.card,
//                   ...(idx === 0 ? styles.cardLarge : {}),
//                 }}
//               >
//                 {/* 즐겨찾기 버튼 */}
//                 <button
//                   onClick={() => toggleFavorite(p.id)}
//                   style={styles.favBtn}
//                 >
//                   {isFav ? "♥" : "♡"}
//                 </button>

//                 <a
//                   href={`/product/${p.id}`}
//                   style={{ textDecoration: "none", color: "inherit" }}
//                 >
//                   <div style={styles.imageWrap}>
//                     {p.image ? (
//                       <img src={p.image} loading="lazy" style={styles.image} />
//                     ) : (
//                       <div style={styles.imagePlaceholder} />
//                     )}
//                   </div>

//                   {p.soldOut && <div style={styles.soldOut}>SOLD OUT</div>}

//                   <div style={styles.cardTextArea}>
//                     <div style={styles.cardName}>{p.name}</div>

//                     <div style={{ display: "flex", gap: "6px" }}>
//                       {p.price && (
//                         <span style={styles.cardPrice}>
//                           {p.price.toLocaleString()}원
//                         </span>
//                       )}
//                       {p.originalPrice && (
//                         <span style={styles.cardOriginalPrice}>
//                           {p.originalPrice.toLocaleString()}원
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </a>

//                 <button
//                   onClick={() => addToCart(p)}
//                   style={styles.cartBtn}
//                 >
//                   담기
//                 </button>
//               </div>
//             );
//           })}
//         </section>
//       </main>
//     </div>
//   );
// }

// //
// // --------------- STYLE OBJECTS ---------------
// //
// const styles = {
//   page: {
//     fontFamily: "system-ui, sans-serif",
//     background: "#fff",
//     minHeight: "100vh",
//     color: "#111",
//   },

//   header: {
//     padding: "24px 60px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   logo: {
//     fontSize: "28px",
//     letterSpacing: "0.25em",
//   },

//   nav: {
//     display: "flex",
//     gap: "24px",
//     fontSize: "14px",
//     textTransform: "uppercase",
//   },

//   navItem: {
//     cursor: "pointer",
//   },

//   headerRightItem: {
//     fontSize: "13px",
//   },

//   filterBar: {
//     padding: "0px 60px 8px",
//     display: "flex",
//     justifyContent: "space-between",
//     color: "#666",
//     fontSize: "12px",
//   },

//   sortSelect: {
//     border: "1px solid #ccc",
//     fontSize: "12px",
//     padding: "4px 8px",
//   },

//   filterText: {
//     fontSize: "12px",
//     color: "#999",
//   },

//   main: {
//     display: "flex",
//     padding: "10px 60px 60px",
//     gap: "40px",
//   },

//   sidebar: {
//     width: "120px",
//   },

//   categoryItem: {
//     padding: "6px 0",
//     fontSize: "14px",
//     color: "#bbb",
//     cursor: "pointer",
//     textTransform: "capitalize",
//   },

//   categoryActive: {
//     color: "#111",
//     fontWeight: 600,
//   },

//   grid: {
//     flex: 1,
//     display: "grid",
//     gridTemplateColumns: "repeat(4, 1fr)",
//     gap: "24px",
//   },

//   card: {
//     position: "relative",
//     cursor: "pointer",
//   },

//   cardLarge: {
//     gridRow: "span 2",
//   },

//   favBtn: {
//     position: "absolute",
//     top: "8px",
//     right: "8px",
//     background: "white",
//     border: "1px solid #ddd",
//     borderRadius: "50%",
//     padding: "4px 8px",
//     zIndex: 10,
//     cursor: "pointer",
//   },

//   imageWrap: {
//     background: "#f3f3f3",
//     overflow: "hidden",
//   },

//   image: {
//     width: "100%",
//     display: "block",
//     objectFit: "cover",
//   },

//   imagePlaceholder: {
//     width: "100%",
//     paddingBottom: "140%",
//     background: "#ddd",
//   },

//   soldOut: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     fontSize: "11px",
//     letterSpacing: "0.1em",
//   },

//   cardTextArea: {
//     paddingTop: "8px",
//     fontSize: "13px",
//   },

//   cardName: {
//     fontSize: "14px",
//     textTransform: "lowercase",
//   },

//   cardPrice: {
//     color: "#c38b52",
//     fontSize: "13px",
//   },

//   cardOriginalPrice: {
//     fontSize: "12px",
//     color: "#bbb",
//     textDecoration: "line-through",
//   },

//   cartBtn: {
//     marginTop: "6px",
//     padding: "6px 10px",
//     border: "1px solid #ddd",
//     borderRadius: "999px",
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: "11px",
//   },
// };


// pages/index.js
export default function Home() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/local",
      permanent: false, // 유지보수 시 true 가능
    },
  };
}
