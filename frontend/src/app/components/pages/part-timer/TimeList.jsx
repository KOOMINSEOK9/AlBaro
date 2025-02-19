import React, { useEffect } from "react";
import TimeCard from "./TimeCard.jsx";

// const times = [
//   {
//     workDate: "2025-02-01",
//     startTime: "2025-02-01T08:00:00",
//     endTime: "2025-02-01T12:00:00",
//   },
//   {
//     workDate: "2025-02-01",
//     startTime: "2025-02-01T14:00:00",
//     endTime: "2025-02-01T18:00:00",
//   },
//   {
//     workDate: "2025-02-02",
//     startTime: "2025-02-02T09:00:00",
//     endTime: "2025-02-02T13:00:00",
//   },
//   {
//     workDate: "2025-02-02",
//     startTime: "2025-02-02T15:00:00",
//     endTime: "2025-02-02T19:00:00",
//   },
//   {
//     workDate: "2025-02-03",
//     startTime: "2025-02-03T07:00:00",
//     endTime: "2025-02-03T11:00:00",
//   },
//   {
//     workDate: "2025-02-03",
//     startTime: "2025-02-03T13:00:00",
//     endTime: "2025-02-03T17:00:00",
//   },
//   {
//     workDate: "2025-02-04",
//     startTime: "2025-02-04T08:30:00",
//     endTime: "2025-02-04T12:30:00",
//   },
//   {
//     workDate: "2025-02-04",
//     startTime: "2025-02-04T16:00:00",
//     endTime: "2025-02-04T20:00:00",
//   },
//   {
//     workDate: "2025-02-05",
//     startTime: "2025-02-05T09:30:00",
//     endTime: "2025-02-05T13:30:00",
//   },
//   {
//     workDate: "2025-02-05",
//     startTime: "2025-02-05T14:30:00",
//     endTime: "2025-02-05T18:30:00",
//   },
// ];

const TimeList = ({
  selectedStore,
  selectedDate,
  workStartTime,
  workEndTime,
  times,
}) => {
  const selectedDateString = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;

  const filteredTime = times.filter((time) => {
    console.log(time);
    const timeStartTime = new Date(`${time.workDate}T${time.startTime}`);
    const timeEndTime = new Date(`${time.workDate}T${time.endTime}`);

    return (
      time.store.storeId === selectedStore.storeId &&
      time.workDate === selectedDateString && // 날짜 비교 (문자열 비교)
      (!workStartTime || workStartTime <= timeStartTime) &&
      (!workEndTime || workEndTime >= timeEndTime)
    );
  });

  return (
    <div>
      <h2 className="font-semibold text-xl">{selectedStore.storeName} </h2>
      <p className="mt-3">
        {selectedStore.roadAddress} {selectedStore.detailedAddress}
      </p>
      {filteredTime.length > 0 ? (
        <TimeCard times={filteredTime} selectedStore={selectedStore} />
      ) : (
        <p className="mt-3">해당 시간대에 대타 가능한 쉬프트가 없어요:(</p>
      )}
    </div>
  );
};

export default TimeList;
