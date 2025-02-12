import React, { useState } from "react";

const TimeCard = ({ times }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleButtonClick = (time) => {
    // 버튼 클릭 시 처리할 로직
    console.log(time);
    if (
      confirm(
        `${time.startTime} ~ ${time.endTime} 시간대에 대타를 요청하시겠습니까?`
      )
    ) {
      alert(`대타 요청을 완료했습니다.`);
    }
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <div className="flex flex-nowrap gap-2">
        {times.map((time, index) => (
          <div
            key={index}
            className="border rounded-full mt-5 p-2 cursor-pointer min-w-[150px] min-h-[50px] text-center align-middle pt-2 relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 시간 표시 */}
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
            {/* Hover 시 버튼 표시 */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <button
                  className="z-10 bg-white text-black m-2 px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white"
                  onClick={() => handleButtonClick(time)}
                >
                  대타 구하기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeCard;
