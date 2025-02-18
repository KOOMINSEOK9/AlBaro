"use client";

import TimeList from "../components/pages/part-timer/TimeList.jsx";
import AlbaList from "../components/pages/manager/AlbaList.jsx";
import DatePickerModule from "../components/pages/common/DatePicker.jsx";
import StoreCard from "../components/pages/common/StoreCard.jsx";

import { useRouter, useSearchParams } from "next/navigation.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { setDate } from "date-fns";
import { jwtDecode } from "jwt-decode";

// const KakaoMap = ({ scheduleId, date, start, end }) => {
const KakaoMap = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState({});
  const [markers, setMarkers] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);

  const [scheduleIdNum, setScheduleId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [storeData, setStoreData] = useState([]);

  const [canDetaTime, setcanDetaTime] = useState([]);

  const [canDetaAlbaList, setcanDetaAlbaList] = useState([]);

  const searchParams = useSearchParams();
  const getScheduleId = searchParams.get("scheduleId");
  const getDate = searchParams.get("date");
  const getStart = searchParams.get("start");
  const getEnd = searchParams.get("end");

  const [accessToken, setAccessToken] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [loginUserRole, setLoginUserRole] = useState(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      const decoded = jwtDecode(token);

      // console.log(decoded.userId);

      setLoginUserId(decoded.userId);
      setLoginUserRole(decoded.role);
    }
  }, []);

  // const userId = 1;
  // const role = "staff";

  useEffect(() => {
    if (getDate) {
      const parsedDate = new Date(
        new Date(getDate).getTime() - 9 * 60 * 60 * 1000
      );
      // console.log("Parsed Date:", parsedDate);
      setSelectedDate(parsedDate);
    }

    if (getStart) {
      // 한국 표준시(KST)로 출력
      const startInKST = new Date(
        new Date(getStart).getTime() - 9 * 60 * 60 * 1000
      );

      // console.log("Parsed Start in KST:", startInKST); // KST로 출력
      setStartTime(startInKST);
    }

    if (getEnd) {
      const endInKST = new Date(
        new Date(getEnd).getTime() - 9 * 60 * 60 * 1000
      );
      // console.log("Parsed End in KST:", endInKST); // KST로 출력
      setEndTime(endInKST);
    }

    if (getScheduleId) {
      setScheduleId(getScheduleId);
    }
  }, [getDate, getStart, getEnd, getScheduleId]);

  // 반경 내 지점 리스트 받아오기
  useEffect(() => {
    if (loginUserId) {
      // console.log("nearby-stores: ", loginUserId);

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/nearby-stores`,
          {
            // .get(`http://localhost:8080/api/substitute/nearby-stores`, {
            params: { userId: loginUserId },
          }
        )
        .then((res) => {
          // console.log("res: ", res.data);
          setStoreData(res.data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [loginUserId]);

  // 지도 출력
  useEffect(() => {
    if (typeof window !== "undefined" && !window.kakao) {
      const script = document.createElement("script");

      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          setLoaded(true); // SDK 로드 완료 후 상태 변경
        });
      };
    } else {
      setLoaded(true);
    }
  }, []);

  // 마커 출력
  // 지도 출력 useEffect
  useEffect(() => {
    if (
      !loaded ||
      !window.kakao ||
      !window.kakao.maps ||
      storeData.length === 0
    ) {
      return;
    }

    const container = document.getElementById("map");

    const options = {
      center: new window.kakao.maps.LatLng(
        storeData[0].latitude,
        storeData[0].longitude
      ),
      level: 3,
    };

    setSelectedStore(storeData[0]);
    const map = new window.kakao.maps.Map(container, options);
    setMapInstance(map);

    let selectedMarker = null; // 선택된 마커

    const selected = "/Location_red.png";
    const unselected = "/Location_blue.png";

    // 선택된 마커 이미지
    const redMarkerImage = new kakao.maps.MarkerImage(
      selected,
      new kakao.maps.Size(24, 24),
      { offset: new kakao.maps.Point(12, 35) }
    );

    // 기본 마커 이미지
    const normalMarkerImage = new kakao.maps.MarkerImage(
      unselected,
      new kakao.maps.Size(24, 24),
      { offset: new kakao.maps.Point(12, 35) }
    );

    // hover 마커 이미지(확대)
    const hoverMarkerImage = new kakao.maps.MarkerImage(
      unselected,
      new kakao.maps.Size(30, 30),
      { offset: new kakao.maps.Point(12, 35) }
    );

    const createdMarkers = storeData.map((store, index) => {
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(store.latitude, store.longitude),
        image: index === 0 ? redMarkerImage : normalMarkerImage,
      });

      if (index === 0) {
        selectedMarker = marker;
      }

      kakao.maps.event.addListener(marker, "click", function () {
        if (selectedMarker) {
          selectedMarker.setImage(normalMarkerImage);
        }
        marker.setImage(redMarkerImage);
        selectedMarker = marker;

        setSelectedStore(store);
        map.panTo(marker.getPosition());
      });

      kakao.maps.event.addListener(marker, "mouseover", function () {
        if (!selectedMarker || selectedMarker !== marker) {
          marker.setImage(hoverMarkerImage);
        }
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        if (!selectedMarker || selectedMarker !== marker) {
          marker.setImage(normalMarkerImage);
        }
      });

      return { store, marker };
    });

    setMarkers(createdMarkers);
  }, [loaded, storeData]);

  useEffect(() => {
    if (selectedStore) {
      handleStoreClick(selectedStore);
    }
  }, [selectedStore]); // selectedStore가 변경될 때 실행

  // 초기 selectedStore 설정 (storeData의 첫 번째 지점을 기본값으로 설정)
  useEffect(() => {
    if (storeData.length > 0) {
      setSelectedStore(storeData[0]); // 첫 번째 지점을 기본 선택
    }
  }, [storeData]); // storeData가 로드될 때 실행

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    const storeId = store.storeId;

    // 선택한 지점의 대타 가능 알바생 조회
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/available-workers`,
        {
          params: { storeId },
        }
      )
      .then((res) => {
        console.log("알바 리스트 출력; ", res.data);
        setcanDetaAlbaList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // 선택한 지점의 공석 확인(시간)
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/available-stores`,
        {
          params: { storeId },
        }
      )
      .then((res) => {
        setcanDetaTime(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // 이전에 선택된 마커의 이미지 초기화
    if (markers && selectedStore) {
      const prevSelected = markers.find(
        (m) => m.store.storeName === selectedStore.storeName
      );
      if (prevSelected) {
        const newMarkerImage = new kakao.maps.MarkerImage(
          "/Location_blue.png",
          new kakao.maps.Size(24, 24)
        );

        prevSelected.marker.setImage(newMarkerImage);
      }
    }

    // 새로 선택된 마커 이미지 변경
    const selected = markers.find((m) => m.store.storeName === store.storeName);

    if (selected) {
      const newMarkerImage = new kakao.maps.MarkerImage(
        "/Location_red.png", // 이미지 경로
        new kakao.maps.Size(24, 24) // 이미지 크기
      );

      selected.marker.setImage(newMarkerImage); // setImage()에 MarkerImage 객체 전달
      mapInstance.panTo(selected.marker.getPosition());
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* 왼쪽 네비게이션 (스크롤 가능) */}
      <nav className="w-1/4 border-r-2 h-full flex flex-col">
        <section className="ml-5 mt-5">
          <DatePickerModule
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            scheduleIdNum={scheduleIdNum}
          />
        </section>
        <hr className="text-black my-3 w-full" />
        <div className="mx-5 flex-grow overflow-y-auto">
          <StoreCard
            stores={storeData}
            onSelectStore={handleStoreClick}
            selectedStore={selectedStore}
          />
        </div>
      </nav>

      {/* 오른쪽 콘텐츠 (스크롤 가능) */}
      <article className="w-3/4 flex flex-col overflow-hidden">
        {/* 상단 리스트 영역 (스크롤 가능) */}
        <section className=" overflow-auto mb-5 ml-5 mt-10">
          {loginUserRole === "staff" ? (
            <TimeList
              selectedStore={selectedStore}
              selectedDate={selectedDate}
              workStartTime={startTime}
              workEndTime={endTime}
              times={canDetaTime}
            />
          ) : loginUserRole === "manager" ? (
            <AlbaList
              selectedStore={selectedStore}
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              canDetaAlbaList={canDetaAlbaList}
            />
          ) : null}
        </section>

        {/* 지도 영역 */}
        <div className="flex-grow bg-[#eee] p-3">
          {loaded ? (
            <div id="map" className="w-full h-full rounded-lg"></div>
          ) : (
            <div>Loading map...</div>
          )}{" "}
        </div>
      </article>
    </div>
  );
};

export default KakaoMap;
