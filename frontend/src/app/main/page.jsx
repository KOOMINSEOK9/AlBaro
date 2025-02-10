// pages/_app.js (Next.js 12) 또는 app/layout.js (Next.js 13 이상)
// import "././globals.css";
import Header from "../components/common/header.jsx";
import Footer from "../components/common/footer.jsx";
import Main from "../pages/Main.jsx";
import Sidebar from "../pages/Sidebar.jsx";

export default function App({ Component, pageProps }) {
  return (
    <div>
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex w-full">
        {/* 메인 콘텐츠 */}
        <section className="w-2/3 bg-[#76ABAE]">
          <Main />
        </section>

        {/* 사이드바 */}
        <section className="w-1/3">
          <Sidebar />
        </section>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
