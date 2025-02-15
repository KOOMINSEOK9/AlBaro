import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const AlbaCard = ({ selectedDate, startTime, endTime, albas }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [filteredAlba, setFilteredAlba] = useState([]); // filteredAlba 상태 추가

  const userId = 2;

  useEffect(() => {
    // console.log("albacard: ", selectedDate, " ", startTime);

    const selectedDateTime = new Date(selectedDate).setHours(0, 0, 0, 0);
    const startTimeTime = startTime
      ? new Date(`${selectedDate}T${startTime}`).getTime()
      : null;
    const endTimeTime = endTime
      ? new Date(`${selectedDate}T${endTime}`).getTime()
      : null;

    const filtered = albas.filter((alba) => {
      const albaDate = new Date(alba.scheduleDate).setHours(0, 0, 0, 0); // 날짜만 비교
      const albaStartTime = new Date(
        `${alba.scheduleDate}T${alba.scheduleStartTime}`
      ).getTime();
      const albaEndTime = new Date(
        `${alba.scheduleDate}T${alba.scheduleEndTime}`
      ).getTime();

      return (
        albaDate === selectedDateTime && // 날짜 비교
        (!startTimeTime || albaStartTime >= startTimeTime) &&
        (!endTimeTime || albaEndTime <= endTimeTime)
      );
    });

    // 계산된 filteredAlba를 상태로 설정
    setFilteredAlba(filtered);
  }, [selectedDate, startTime, endTime, albas]); // 이 배열의 값이 변경될 때마다 useEffect가 실행됩니다.

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleButtonClick = (alba) => {
    // 대타 구하기 버튼 클릭 시 처리할 로직
    // console.log(alba);
    if (
      confirm(`${alba.scheduleDate} ${alba.scheduleStartTime} ~ ${alba.scheduleEndTime}까지
      ${alba.userName}님께 대타 요청을 하시겠습니까?`)
    ) {
      const formattedDate = new Date(
        new Date(selectedDate).getTime() + 9 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      const formattedStartTime = new Date(
        new Date(startTime).getTime() + 9 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(11, 19);
      const formattedEndTime = new Date(
        new Date(endTime).getTime() + 9 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(11, 19);

      const queryParams = new URLSearchParams({
        userId,
        userName: alba.userName,
        workDate: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      }).toString();

      axios
        .post(
          `http://localhost:8080/api/substitute/workerRequest?${queryParams}`
        )
        .then((res) => {
          alert(`${alba.userName}님께 대타를 요청했습니다.`);
        })
        .catch((err) => {
          alert("오류가 발생했습니다. 다시 시도해주세요.");
          console.log("알바->알바 대타 요청 실패: ", err);
        });
    }
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <div className="flex flex-nowrap gap-4">
        {filteredAlba.map((alba, index) => (
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
            </div>

            {/* Hover 시 오버레이와 버튼 추가 */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
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
