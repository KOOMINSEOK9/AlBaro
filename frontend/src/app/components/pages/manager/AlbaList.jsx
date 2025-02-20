import React, { useEffect } from "react";
import Image from "next/image";
import AlbaCard from "./AlbaCard.jsx";
import axios from "axios";
import Login from "@/app/page.jsx";

// const Alba = [
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-01",
//     scheduleStartTime: "2025-02-01T08:00:00",
//     scheduleEndTime: "2025-02-01T12:00:00",
//   },
//   {
//     userName: "이싸피",
//     scheduleDate: "2025-02-01",
//     scheduleStartTime: "2025-02-01T14:00:00",
//     scheduleEndTime: "2025-02-01T18:00:00",
//   },
//   {
//     userName: "최최피",
//     scheduleDate: "2025-02-02",
//     scheduleStartTime: "2025-02-02T09:00:00",
//     scheduleEndTime: "2025-02-02T13:00:00",
//   },
//   {
//     userName: "박싸피",
//     scheduleDate: "2025-02-02",
//     scheduleStartTime: "2025-02-02T15:00:00",
//     scheduleEndTime: "2025-02-02T19:00:00",
//   },
//   {
//     userName: "유유피",
//     scheduleDate: "2025-02-03",
//     scheduleStartTime: "2025-02-03T08:30:00",
//     scheduleEndTime: "2025-02-03T12:30:00",
//   },
//   {
//     userName: "민싸피",
//     scheduleDate: "2025-02-03",
//     scheduleStartTime: "2025-02-03T13:30:00",
//     scheduleEndTime: "2025-02-03T17:30:00",
//   },
//   {
//     userName: "강싸피",
//     scheduleDate: "2025-02-04",
//     scheduleStartTime: "2025-02-04T07:00:00",
//     scheduleEndTime: "2025-02-04T11:00:00",
//   },
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-04",
//     scheduleStartTime: "2025-02-04T16:00:00",
//     scheduleEndTime: "2025-02-04T20:00:00",
//   },
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-05",
//     scheduleStartTime: "2025-02-05T10:00:00",
//     scheduleEndTime: "2025-02-05T14:00:00",
//   },
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-05",
//     scheduleStartTime: "2025-02-05T18:00:00",
//     scheduleEndTime: "2025-02-05T22:00:00",
//   },
// ];
// const Alba = [
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-01",
//     scheduleStartTime: "2025-02-01T08:00:00",
//     scheduleEndTime: "2025-02-01T12:00:00",
//   },
//   {
//     userName: "이싸피",
//     scheduleDate: "2025-02-01",
//     scheduleStartTime: "2025-02-01T14:00:00",
//     scheduleEndTime: "2025-02-01T18:00:00",
//   },
//   {
//     userName: "최최피",
//     scheduleDate: "2025-02-02",
//     scheduleStartTime: "2025-02-02T09:00:00",
//     scheduleEndTime: "2025-02-02T13:00:00",
//   },
//   {
//     userName: "박싸피",
//     scheduleDate: "2025-02-02",
//     scheduleStartTime: "2025-02-02T15:00:00",
//     scheduleEndTime: "2025-02-02T19:00:00",
//   },
//   {
//     userName: "유유피",
//     scheduleDate: "2025-02-03",
//     scheduleStartTime: "2025-02-03T08:30:00",
//     scheduleEndTime: "2025-02-03T12:30:00",
//   },
//   {
//     userName: "민싸피",
//     scheduleDate: "2025-02-03",
//     scheduleStartTime: "2025-02-03T13:30:00",
//     scheduleEndTime: "2025-02-03T17:30:00",
//   },
//   {
//     userName: "강싸피",
//     scheduleDate: "2025-02-04",
//     scheduleStartTime: "2025-02-04T07:00:00",
//     scheduleEndTime: "2025-02-04T11:00:00",
//   },
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-04",
//     scheduleStartTime: "2025-02-04T16:00:00",
//     scheduleEndTime: "2025-02-04T20:00:00",
//   },
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-05",
//     scheduleStartTime: "2025-02-05T10:00:00",
//     scheduleEndTime: "2025-02-05T14:00:00",
//   },
//   {
//     userName: "김싸피",
//     scheduleDate: "2025-02-05",
//     scheduleStartTime: "2025-02-05T18:00:00",
//     scheduleEndTime: "2025-02-05T22:00:00",
//   },
// ];

const AlbaList = ({
  selectedStore,
  selectedDate,
  startTime,
  endTime,
  canDetaAlbaList,
}) => {
  // const userId = 1;

  const filteredAlba = canDetaAlbaList.filter((alba) => {

    // console.log(alba);

    const albaDate = new Date(alba.scheduleDate);

    const albaStartTime = new Date(
      `${alba.scheduleDate}T${alba.scheduleStartTime}`
    );
    const albaEndTime = new Date(
      `${alba.scheduleDate}T${alba.scheduleEndTime}`
    );

    return (
      albaDate.toDateString() === selectedDate.toDateString() &&
      (!startTime || albaStartTime <= startTime) &&
      (!endTime || albaEndTime >= endTime)
      // alba.storeId === selectedStore.storeId
    );
  });

  // console.log(canDetaAlbaList);

  return (
    <div>
      <div className="flex mb-5">
        <Image
          src="/icons/Recent Actors.png"
          alt="alba icon"
          width={30}
          height={20}
        />
        <h2 className="font-semibold text-xl">
          {selectedStore.storeName} 대타 가능한 알바생
        </h2>
      </div>
      {filteredAlba.length > 0 ? (
        <AlbaCard
          albas={filteredAlba}
          selectedDate={selectedDate}
          startTime={startTime}
          endTime={endTime}
        />
      ) : (
        <p>해당 시간대에 대타 가능한 알바생이 없어요:(</p>
      )}
    </div>
  );
};

export default AlbaList;
