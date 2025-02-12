"use client";

import TimeList from "../part-timer/TimeList.jsx";
import AlbaList from "../manager/AlbaList.jsx";
import DatePickerModule from "./DatePicker.jsx";
import StoreCard from "./StoreCard.jsx";

import { useRouter } from "next/navigation.js";
import { useEffect, useState } from "react";
import axios from "axios";

const KakaoMap = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState({});
  const [markers, setMarkers] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // const [storeData, setStoreData] = useState([]);

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

  // console.log(router);
  const userId = 1;

  // // 반경 내 지점 리스트 받아오기
  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:8080/api/substitute/nearby-stores`, {
  //       params: { userId },
  //     })
  //     .then((res) => {
  //       console.log("res: ", res.data);
  //       setStoreData(res.data);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // }, []);

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
  useEffect(() => {
    if (loaded && window.kakao && window.kakao.maps) {
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
        selected, // 기존 마커 이미지 URL
        new kakao.maps.Size(24, 24), // 마커 크기
        { offset: new kakao.maps.Point(12, 35) } // 마커 중심 점 설정
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
          // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 오버 이미지로 변경합니다
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

      // storeData.forEach((store) => {
      //   const latitude = store.latitude;
      //   const longitude = store.longitude;
      //   let coords = new kakao.maps.LatLng(latitude, longitude);

      //   let marker = new kakao.maps.Marker({
      //     map: map,
      //     position: coords,
      //     image: normalMarkerImage, // 기본 이미지 설정
      //   });

      //   // 마커 호버 이벤트(확대)
      //   kakao.maps.event.addListener(marker, "mouseover", function () {
      //     // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
      //     // 마커의 이미지를 오버 이미지로 변경합니다
      //     if (!selectedMarker || selectedMarker !== marker) {
      //       marker.setImage(hoverMarkerImage);
      //     }
      //   });

      //   kakao.maps.event.addListener(marker, "mouseout", function () {
      //     if (!selectedMarker || selectedMarker !== marker) {
      //       marker.setImage(normalMarkerImage);
      //     }
      //   });

      //   // 마커 클릭 이벤트
      //   kakao.maps.event.addListener(marker, "click", function () {
      //     // 클릭된 마커가 없다면 클릭한 마커 이미지 변경
      //     if (!selectedMarker || selectedMarker !== marker) {
      //       if (selectedMarker) {
      //         selectedMarker.setImage(normalMarkerImage); // 이전 마커 기본 이미지로 변경
      //       }
      //       marker.setImage(redMarkerImage); // 현재 클릭된 마커는 빨간색으로 변경
      //       selectedMarker = marker; // 선택된 마커로 설정

      //       map.panTo(marker.getPosition());
      //     }
      //   });
      // });
    }
  }, [loaded]);

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    const storeId = store.storeId;

    console.log("Sending request with storeId:", storeId);

    // axios
    //   .get(`http://localhost:8080/api/substitute/available-stores`, {
    //     params: { storeId },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

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
