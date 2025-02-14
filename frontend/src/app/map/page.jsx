"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import KakaoMap from "../components/pages/common/KakaoMap.jsx";
import Header from "../components/common/header.jsx";
import Footer from "../components/common/footer.jsx";

const Map = () => {
  const router = useRouter();
  const [eventData, setEventData] = useState(null);

  const searchParams = useSearchParams();
  const getScheduleId = searchParams.get("scheduleId");
  const getDate = searchParams.get("date");
  const getStart = searchParams.get("start");
  const getEnd = searchParams.get("end");

  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-[#eee] text-black">
      {/* 헤더 */}
      <Header />

      {/* 본문 (스크롤 가능) */}
      <section className="flex-1 flex-grow overflow-hidden bg-[#fff]">
        <Suspense fallback={<div>Loading map...</div>}>
          <KakaoMap
            scheduleId={getScheduleId}
            date={getDate}
            start={getStart}
            end={getEnd}
          />
        </Suspense>
      </section>

      {/* 푸터 (필요 시 활성화) */}
      {/* <Footer /> */}
    </div>
  );
};

export default Map;
