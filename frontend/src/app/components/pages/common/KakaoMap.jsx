"use client";

import TimeList from "../part-timer/TimeList.jsx";
import AlbaList from "../manager/AlbaList.jsx";
import DatePickerModule from "./DatePicker.jsx";
import StoreCard from "./StoreCard.jsx";

import { useRouter } from "next/navigation.js";
import { useEffect, useState } from "react";

const KakaoMap = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState({});
  const [markers, setMarkers] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const storeData = [
    {
      storeName: "투썸플레이스 대전한밭대점",
      franchiseName: "투썸플레이스",
      zipCode: 34159,
      roadAddress: "대전 유성구 학하서로121번길 81",
      detailedAddress: "1층",
      latitude: 36.3504,
      longitude: 127.2978,
    },
    {
      storeName: "투썸플레이스 유성점",
      franchiseName: "투썸플레이스",
      zipCode: 34159,
      roadAddress: "대전 유성구 학하서로121번길 87",
      detailedAddress: "1층",
      latitude: 36.35,
      longitude: 127.2978,
    },
    {
      storeName: "투썸플레이스 학하점",
      franchiseName: "투썸플레이스",
      zipCode: 34159,
      roadAddress: "대전 유성구 학하서로121번길 71-10",
      detailedAddress: "1층",
      latitude: 36.3502,
      longitude: 127.2977,
    },
    {
      storeName: "투썸플레이스 봉명점",
      franchiseName: "투썸플레이스",
      zipCode: 34159,
      roadAddress: "대전 유성구 학하서로121번길 55-13",
      detailedAddress: "3층",
      latitude: 36.3497,
      longitude: 127.2987,
    },
    {
      storeName: "투썸플레이스 덕명점",
      franchiseName: "투썸플레이스",
      zipCode: 34159,
      roadAddress: "대전 유성구 학하서로121번길 51",
      detailedAddress: "1층",
      latitude: 36.3497,
      longitude: 127.298,
    },
    {
      storeName: "투썸플레이스 수통골점",
      franchiseName: "투썸플레이스",
      zipCode: 34158,
      roadAddress: "대전 유성구 동서대로 125",
      detailedAddress: "1층",
      latitude: 36.3452,
      longitude: 127.3052,
    },
    {
      storeName: "투썸플레이스 한밭대남문점",
      franchiseName: "투썸플레이스",
      zipCode: 34153,
      roadAddress: "대전 유성구 동서대로 130",
      detailedAddress: "1층",
      latitude: 36.351,
      longitude: 127.2971,
    },
    {
      storeName: "투썸플레이스 한밭대북문점",
      franchiseName: "투썸플레이스",
      zipCode: 34154,
      roadAddress: "대전 유성구 동서대로 138",
      detailedAddress: "2층",
      latitude: 36.3503,
      longitude: 127.2967,
    },
  ];

  // 지도 스크립트 로드
  useEffect(() => {
    // 이미 로드된 경우 처리
    if (window.kakao && window.kakao.maps) {
      setLoaded(true);
      return;
    }

    try {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          setLoaded(true);
        });
      };

      script.onerror = (error) => {
        setError(new Error("카카오맵 스크립트 로드 실패"));
      };

      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    } catch (error) {
      setError(error);
    }
  }, []);

  const setupMarkerEvents = (marker, markerObj, MARKER_IMAGES, map) => {
    let selectedMarker = null;

    kakao.maps.event.addListener(marker, "click", () => {
      if (selectedMarker) {
        selectedMarker.setImage(MARKER_IMAGES.normal);
      }
      marker.setImage(MARKER_IMAGES.selected);
      selectedMarker = marker;
      
      setSelectedStore(markerObj.store);
      map.panTo(marker.getPosition());
    });

    kakao.maps.event.addListener(marker, "mouseover", () => {
      if (!selectedMarker || selectedMarker !== marker) {
        marker.setImage(MARKER_IMAGES.hover);
      }
    });

    kakao.maps.event.addListener(marker, "mouseout", () => {
      if (!selectedMarker || selectedMarker !== marker) {
        marker.setImage(MARKER_IMAGES.normal);
      }
    });
  };

  // 지도 및 마커 초기화
  useEffect(() => {
    if (!loaded || !window.kakao || !window.kakao.maps) return;

    try {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(
          storeData[0].latitude,
          storeData[0].longitude
        ),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      setMapInstance(map);
      setSelectedStore(storeData[0]);

      // 마커 이미지 객체들을 상수로 분리
      const MARKER_IMAGES = {
        selected: new kakao.maps.MarkerImage(
          "/Location_red.png",
          new kakao.maps.Size(24, 24),
          { offset: new kakao.maps.Point(12, 35) }
        ),
        normal: new kakao.maps.MarkerImage(
          "/Location_blue.png",
          new kakao.maps.Size(24, 24),
          { offset: new kakao.maps.Point(12, 35) }
        ),
        hover: new kakao.maps.MarkerImage(
          "/Location_blue.png",
          new kakao.maps.Size(30, 30),
          { offset: new kakao.maps.Point(12, 35) }
        )
      };

      const createdMarkers = storeData.map((store, index) => {
        const marker = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(store.latitude, store.longitude),
          image: index === 0 ? MARKER_IMAGES.selected : MARKER_IMAGES.normal,
        });

        const markerObj = { store, marker };
        setupMarkerEvents(marker, markerObj, MARKER_IMAGES, map);
        
        return markerObj;
      });

      setMarkers(createdMarkers);

      return () => {
        createdMarkers.forEach(({ marker }) => {
          marker.setMap(null);
        });
      };
    } catch (error) {
      setError(error);
      console.error("Error initializing map:", error);
    }
  }, [loaded]);

  const handleStoreClick = (store) => {
    try {
      if (!markers || !window.kakao) return;

      // 이전 마커 초기화
      if (selectedStore) {
        const prevSelected = markers.find(
          (m) => m.store.storeName === selectedStore.storeName
        );
        if (prevSelected) {
          const normalImage = new window.kakao.maps.MarkerImage(
            "/Location_blue.png",
            new window.kakao.maps.Size(24, 24),
            { offset: new window.kakao.maps.Point(12, 35) }
          );
          prevSelected.marker.setImage(normalImage);
        }
      }

      // 새로운 마커 선택
      const selected = markers.find((m) => m.store.storeName === store.storeName);
      if (selected) {
        const selectedImage = new window.kakao.maps.MarkerImage(
          "/Location_red.png",
          new window.kakao.maps.Size(24, 24),
          { offset: new window.kakao.maps.Point(12, 35) }
        );
        selected.marker.setImage(selectedImage);
        mapInstance?.panTo(selected.marker.getPosition());
      }

      setSelectedStore(store);
    } catch (error) {
      console.error("Error handling store click:", error);
    }
  };

  if (error) {
    return <div>지도를 불러오는 중 오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className="flex">
      <nav className="w-1/4 border-r-2">
        <section className="ml-5 mt-5">
          <DatePickerModule
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        </section>
        <hr className="text-black my-3 w-full" />
        <div className="mx-5 ">
          <StoreCard
            stores={storeData}
            onSelectStore={handleStoreClick}
            selectedStore={selectedStore}
          />
        </div>
      </nav>
      <article className="w-3/4">
        <section className="mb-10 ml-5 mt-10">
          <AlbaList
            selectedStore={selectedStore}
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
          />
          <TimeList
            selectedStore={selectedStore}
            selectedDate={selectedDate}
            workStartTime={startTime}
            workEndTime={endTime}
          />
        </section>
        <div className="bg-[#eee] p-3">
          <div
            id="map"
            style={{ width: "100%", height: "500px", borderRadius: "10px" }}
          ></div>
        </div>
      </article>
    </div>
  );
};

export default KakaoMap;