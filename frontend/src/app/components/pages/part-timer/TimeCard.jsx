import React from "react";
import Image from "next/image";

const TimeCard = ({ times }) => {
  console.log(times);

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <div className="flex flex-nowrap gap-2">
        {times.map((time, index) => (
          <div
            key={index}
            className="border rounded-full mt-5 p-2 cursor-pointer min-w-[150px] min-h-[50px] text-center align-middle pt-2"
          >
            {new Date(time.startTime).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}{" "}
            <span>-</span>{" "}
            {new Date(time.endTime).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeCard;
