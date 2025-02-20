import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

const AlbaCard = ({ selectedDate, startTime, endTime, albas }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [accessToken, setAccessToken] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      const decoded = jwtDecode(token);

      setLoginUserId(decoded.userId);
    }
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleButtonClick = (alba) => {
    // 대타 구하기 버튼 클릭 시 처리할 로직

    const startTimeConfirm = new Date(
      new Date(startTime).getTime() + 9 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(11, 16);

    const endTimeConfirm = new Date(
      new Date(endTime).getTime() + 9 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(11, 16);

    if (
      confirm(
        `${alba.userName}님께 대타 요청을 하시겠습니까? \n근무 정보: ${alba.scheduleDate} ${startTimeConfirm} ~ ${endTimeConfirm} `
      )
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
        userId: loginUserId,
        userName: alba.userName,
        workDate: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      }).toString();

      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/managerRequest?${queryParams}`
          // `http://localhost:8080/api/substitute/managerRequest?${queryParams}`
        )
        .then((res) => {
          alert(`${alba.userName}님께 대타를 요청했습니다.`);
        })
        .catch((err) => {
          console.log(err);
          alert(`오류가 발생했습니다. 대타 요청에 실패하였습니다.`);
        });
    }
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <div className="flex flex-nowrap gap-4">
        {albas.map((alba, index) => (
          <div
            key={index}
            className="bg-[#eee] p-4 mb-3 rounded-lg cursor-pointer flex min-w-[160px] relative align-middle"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <Image
                src={alba.filePath}
                alt="profileimg"
                width={50}
                height={50}
                className="w-[45px] h-[45px] rounded-full"
              />
            </div>

            <div className=" ml-1 mt-1">
              <h3 className="text-lg font-semibold ml-2 mt-2">
                {alba.userName}
              </h3>
              {/* <p className="text-sm text-gray-600">시급:</p> */}
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
