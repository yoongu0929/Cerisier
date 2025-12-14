// components/LocalFooter.js
const React = require("react");

function LocalFooter() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <>
      <footer className="local-footer">
        <div className="local-footer-inner">
          <span className="local-footer-line">
            <strong>상호</strong>: 세리지에르 | <strong>대표</strong>: 이혜은 |{" "}
            <strong>개인정보관리책임자</strong>: 이혜은 | <strong>전화</strong>: 010-0000-0000
            | <strong>이메일</strong>: hannalee413@gmail.com
          </span>

          <span className="local-footer-line">
            <strong>주소</strong>: 서울시 강동구 둔촌동 | <strong>사업자등록번호</strong>: 757-16-02269
          </span>

          {/* 링크는 아직 기능 없어도 스타일만 맞춰둠 */}
          <div className="local-footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>
              이용약관
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              개인정보처리방침
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              사업자정보확인
            </a>
          </div>

          <div className="local-footer-bottom">© {year} CERISIER</div>
        </div>
      </footer>

      <button
        className={"local-top-btn" + (visible ? " is-visible" : "")}
        onClick={scrollTop}
        aria-label="scroll to top"
      >
        TOP
      </button>
    </>
  );
}

module.exports = LocalFooter;
