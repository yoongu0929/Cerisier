// pages/local/index.js
const React = require("react");
const { useEffect, useState } = React;
const localProducts = require("../../data/localProducts");
const LocalFooter = require("../../components/LocalFooter");


const FAVORITES_KEY = "draperyLocalFavorites";

function LocalProductList() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const arr = Array.from(set);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
      }
      return arr;
    });
  };

  return React.createElement(
    "div",
    { style: styles.page },
    // HEADER
    React.createElement(
      "header",
      { style: styles.header },
      React.createElement("div", { style: styles.logo }, "Cerisier"),
    //   React.createElement(
    //     "div",
    //     { style: { fontSize: 14 } },
    //     "로컬 버전 (이미지 파일 프로젝트 내)"
    //   )
    ),
    // MAIN
    React.createElement(
      "main",
      { style: styles.main },
      React.createElement(
        "aside",
        { style: styles.sidebar },
        React.createElement("div", { style: styles.menuTitle }, "All"),
        React.createElement(
          "div",
          { style: styles.menuItemDisabled },
          "top"
        ),
        React.createElement(
          "div",
          { style: styles.menuItemDisabled },
          "bottom"
        ),
        React.createElement(
          "div",
          { style: styles.menuItemDisabled },
          "outer"
        ),
        React.createElement(
          "div",
          { style: styles.menuItemDisabled },
          "accessories"
        )
      ),
      React.createElement(
        "section",
        { style: styles.grid },
        localProducts.map((p) =>
          React.createElement(
            "div",
            { key: p.id, style: styles.card },
            React.createElement(
              "a",
              {
                href: `/local/product/${p.id}`,
                style: {
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                },
              },
              React.createElement(
                "div",
                { style: styles.imageWrap },
                p.image
                  ? React.createElement("img", {
                      src: p.image,
                      style: styles.image,
                      loading: "lazy",
                      alt: p.name,
                    })
                  : React.createElement("div", {
                      style: styles.imagePlaceholder,
                    })
              ),
              p.soldOut &&
                React.createElement(
                  "div",
                  { style: styles.soldOut },
                  "SOLD OUT"
                ),
              React.createElement(
                "div",
                { style: styles.cardTextArea },
                React.createElement(
                  "div",
                  { style: styles.cardName },
                  p.name
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 6 } },
                  p.price != null &&
                    React.createElement(
                      "span",
                      { style: styles.cardPrice },
                      p.price.toLocaleString(),
                      "원"
                    ),
                  p.originalPrice != null &&
                    React.createElement(
                      "span",
                      { style: styles.cardOriginalPrice },
                      p.originalPrice.toLocaleString(),
                      "원"
                    )
                )
              )
            ),
            React.createElement(
              "button",
              {
                style: Object.assign(
                  {},
                  styles.favBtn,
                  favorites.includes(p.id) ? styles.favBtnActive : {}
                ),
                onClick: () => toggleFavorite(p.id),
              },
              favorites.includes(p.id) ? "♥" : "♡"
            )
          )
        )
      )
    ),
    React.createElement(LocalFooter)
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
  main: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    padding: "10px 60px 200px",
    gap: "40px",
  },
  sidebar: {
    fontSize: 13,
  },
  menuTitle: {
    marginBottom: 16,
    cursor: "pointer",
  },
  menuItemDisabled: {
    marginBottom: 8,
    color: "#aaa",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "24px",
  },
  card: {
    position: "relative",
  },
  imageWrap: {
    width: "100%",
    background: "#f4f4f4",
  },
  image: {
    width: "100%",
    display: "block",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    paddingBottom: "140%",
    background: "#eee",
  },
  soldOut: {
    position: "absolute",
    top: 8,
    left: 8,
    padding: "2px 6px",
    fontSize: 10,
    background: "#000",
    color: "#fff",
    letterSpacing: "0.1em",
  },
  cardTextArea: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 1.4,
  },
  cardName: {
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 13,
    color: "#c38b52",
  },
  cardOriginalPrice: {
    fontSize: 11,
    color: "#aaa",
    textDecoration: "line-through",
  },
  favBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    lineHeight: "24px",
    textAlign: "center",
  },
  favBtnActive: {
    borderColor: "#c38b52",
    color: "#c38b52",
  },
};

module.exports = LocalProductList;
