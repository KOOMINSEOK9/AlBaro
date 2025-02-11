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
    // ... 다른 매장 데이터
  ];

  // 지도 스크립트 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      if (typeof window === "undefined" || window.kakao) return;

      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          setLoaded(true);
          initializeMap();
        });
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

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

      // 마커 이미지 설정
      const selected = "/Location_red.png";
      const unselected = "/Location_blue.png";

      const redMarkerImage = new window.kakao.maps.MarkerImage(
        selected,
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 35) }
      );

      const normalMarkerImage = new window.kakao.maps.MarkerImage(
        unselected,
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 35) }
      );

      const hoverMarkerImage = new window.kakao.maps.MarkerImage(
        unselected,
        new window.kakao.maps.Size(30, 30),
        { offset: new window.kakao.maps.Point(12, 35) }
      );

      let selectedMarker = null;

      const createdMarkers = storeData.map((store, index) => {
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(store.latitude, store.longitude),
          image: index === 0 ? redMarkerImage : normalMarkerImage,
        });

        if (index === 0) {
          selectedMarker = marker;
        }

        window.kakao.maps.event.addListener(marker, "click", function () {
          if (selectedMarker) {
            selectedMarker.setImage(normalMarkerImage);
          }
          marker.setImage(redMarkerImage);
          selectedMarker = marker;

          setSelectedStore(store);
          map.panTo(marker.getPosition());
        });

        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(hoverMarkerImage);
          }
        });

        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalMarkerImage);
          }
        });

        return { store, marker };
      });

      setMarkers(createdMarkers);
    };

    loadKakaoMap();
  }, []);

  const handleStoreClick = (store) => {
    if (!window.kakao || !mapInstance) return;

    setSelectedStore(store);

    // 이전 선택 마커 초기화
    if (markers && selectedStore) {
      const prevSelected = markers.find(
        (m) => m.store.storeName === selectedStore.storeName
      );
      if (prevSelected) {
        const newMarkerImage = new window.kakao.maps.MarkerImage(
          "/Location_blue.png",
          new window.kakao.maps.Size(24, 24)
        );
        prevSelected.marker.setImage(newMarkerImage);
      }
    }

    // 새로운 마커 선택
    const selected = markers.find((m) => m.store.storeName === store.storeName);
    if (selected) {
      const newMarkerImage = new window.kakao.maps.MarkerImage(
        "/Location_red.png",
        new window.kakao.maps.Size(24, 24)
      );
      selected.marker.setImage(newMarkerImage);
      mapInstance.panTo(selected.marker.getPosition());
    }
  };

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
        <div className="mx-5">
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