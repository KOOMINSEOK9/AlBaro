"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KakaoMap from "../components/pages/common/KakaoMap.jsx";
import Header from "../components/common/header.jsx";
import Footer from "../components/common/footer.jsx";

const Map = () => {
  const router = useRouter();
  const [eventData, setEventData] = useState(null);

  // const { date, start, end } = router.query;
  console.log(router.query);

  return (
    <div className="bg-[#eee] text-black">
      <Header />

      <section className="bg-[#fff]">
        <KakaoMap />
      </section>
      <Footer />
    </div>
  );
};

export default Map;
