// components/LocalFooter.js
const React = require("react");

function LocalFooter() {
  return (
    <footer className="local-footer">
      <div className="footer-row">
        <strong>상호</strong>: 세리지에르 | <strong>대표</strong>: 이혜은 |{" "}
        <strong>개인정보관리책임자</strong>: 이혜은
      </div>
      <div className="footer-row">
        <strong>전화</strong>: 010-0000-0000 |{" "}
        <strong>이메일</strong>: hannalee413@gmail.com
      </div>
      <div className="footer-row">
        <strong>주소</strong>: 서울시 강동구 둔촌동
      </div>
      <div className="footer-row">
        <strong>사업자등록번호</strong>: 757-16-02269
      </div>
      <div className="footer-row" style={{ marginTop: 12, color: "#999" }}>
        © {new Date().getFullYear()} CERISIER. All rights reserved.
      </div>
    </footer>
  );
}

module.exports = LocalFooter;
