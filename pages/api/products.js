// pages/api/products.js
import puppeteer from "puppeteer";

const SHOP_URL = "https://drapery.co.kr/shop";

export default async function handler(req, res) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(SHOP_URL, {
      waitUntil: "networkidle2",
      timeout: 60_000,
    });

    // 상품 카드가 로드될 때까지 대기
    await page.waitForSelector(".shopProductWrapper", { timeout: 30_000 });

    const products = await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll(".shopProductWrapper")
      );

      const list = [];

      for (const card of cards) {
        // ───────── ID / URL ─────────
        const linkEl = card.querySelector('a[href^="/product/"]');
        if (!linkEl) continue;

        const href = linkEl.getAttribute("href") || "";
        if (!href) continue;

        const key = href.split("?")[0]; // /product/xxxx
        const id = key.replace("/product/", "");

        // ───────── NAME ─────────
        const nameEl = card.querySelector(".shopProduct.productName");
        const name = nameEl
          ? nameEl.textContent.trim()
          : "";

        // ───────── PRICE ─────────
        // 할인된 가격이 있으면 그걸 우선 사용, 없으면 원가만 있는 구조
        const discountEl = card.querySelector(".productDiscountPriceSpan");
        const priceEl =
          discountEl || card.querySelector(".productPriceSpan");

        const originalEl =
          discountEl && card.querySelector(".productPriceWithDiscountSpan");

        const parsePrice = (el) => {
          if (!el) return null;
          const txt = el.textContent.replace(/[^\d]/g, "");
          if (!txt) return null;
          return parseInt(txt, 10);
        };

        const price = parsePrice(priceEl);
        const originalPrice = parsePrice(originalEl);

        // ───────── IMAGE ─────────
        let imageUrl = "";

        const thumbDiv =
          card.querySelector(".thumb.img") ||
          card.querySelector(".thumbDiv .thumb");

        if (thumbDiv) {
          // 1순위: imgsrc 속성
          imageUrl =
            thumbDiv.getAttribute("imgsrc") ||
            thumbDiv.getAttribute("data-src") ||
            thumbDiv.getAttribute("data-original") ||
            "";

          // 2순위: background-image 스타일
          if (!imageUrl) {
            let bg = thumbDiv.style.backgroundImage;
            if (!bg) {
              bg = window.getComputedStyle(thumbDiv).backgroundImage;
            }
            if (bg && bg.startsWith("url")) {
              const m = bg.match(/url\(["']?(.*?)["']?\)/);
              if (m && m[1]) {
                imageUrl = m[1];
              }
            }
          }
        }

        // 상대 경로 → 절대 경로
        if (imageUrl.startsWith("//")) {
          imageUrl = "https:" + imageUrl;
        } else if (imageUrl.startsWith("/")) {
          imageUrl = "https://contents.sixshop.com" + imageUrl;
        }

        // ───────── SOLD OUT ─────────
        const soldOutBadge = card.querySelector(".soldOutBadge span");
        const soldOut =
          !!soldOutBadge &&
          /sold out/i.test(soldOutBadge.textContent || "");

        list.push({
          id,
          name,
          price,
          originalPrice,
          image: imageUrl || null,
          url: new URL(href, window.location.origin).href,
          soldOut,
        });
      }

      return list;
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
