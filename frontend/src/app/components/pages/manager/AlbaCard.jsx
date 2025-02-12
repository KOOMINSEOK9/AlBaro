import React, { useState } from "react";
import Image from "next/image";

const AlbaCard = ({ albas }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleButtonClick = (alba) => {
    // 대타 구하기 버튼 클릭 시 처리할 로직
    console.log(alba);
    if (
      confirm(`${alba.scheduleDate} ${alba.scheduleStartTime} ~ ${alba.scheduleEndTime}까지
      ${alba.userName}님께 대타 요청을 하시겠습니까?`)
    ) {
      alert(`${alba.userName}님께 대타를 요청했습니다.`);
    }
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <div className="flex flex-nowrap gap-4">
        {albas.map((alba, index) => (
          <div
            key={index}
            className="bg-[#eee] p-4 mb-3 rounded-lg cursor-pointer flex min-w-[200px] relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <Image
                src="/profile.png"
                alt="profileimg"
                width={50}
                height={50}
              />
            </div>
            <div className="align-middle ml-1 mt-1">
              <h3 className="text-lg font-semibold">{alba.userName}</h3>
              <p className="text-sm text-gray-600">시급:</p>
            </div>

            {/* Hover 시 오버레이와 버튼 추가 */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <button
                  className="z-10 bg-white text-black m-2 px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white"
                  onClick={() => handleButtonClick(alba)}
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

export default AlbaCard;
