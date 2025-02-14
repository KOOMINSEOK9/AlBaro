"use client";

// import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import KakaoMap from "./KakaoMap.jsx";
import Header from "../components/common/header.jsx";
import Footer from "../components/common/footer.jsx";

const Map = () => {
  const router = useRouter();
  const [eventData, setEventData] = useState(null);

  const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    return isMounted;
  };

  // const searchParams = useSearchParams();
  // const getScheduleId = searchParams.get("scheduleId");
  // const getDate = searchParams.get("date");
  // const getStart = searchParams.get("start");
  // const getEnd = searchParams.get("end");

  // 클라이언트에서만 Suspense를 적용하기 위해 useIsMounted 사용
  const isMounted = useIsMounted();

  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-[#eee] text-black">
      {/* 헤더 */}
      <Header />

      {/* 본문 (스크롤 가능) */}
      <section className="flex-1 flex-grow overflow-hidden bg-[#fff]">
        {isMounted ? (
          <Suspense fallback={<div>Loading...</div>}>
            <KakaoMap
            // scheduleId={getScheduleId}
            // date={getDate}
            // start={getStart}
            // end={getEnd}
            />
          </Suspense>
        ) : (
          <div>Loading...</div>
        )}
      </section>

      {/* 푸터 (필요 시 활성화) */}
      {/* <Footer /> */}
    </div>
  );
};

export default Map;
