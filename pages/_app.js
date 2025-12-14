// pages/_app.js
import "../styles/global.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="app-root">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
