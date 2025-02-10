import React from "react";
import Image from "next/image";

const AlbaCard = ({ albas }) => {
  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <div className="flex flex-nowrap gap-4">
        {albas.map((alba, index) => (
          <div
            key={index}
            className="bg-[#eee] p-4 mb-3 rounded-lg cursor-pointer flex min-w-[200px] hover:shadow-lg"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbaCard;
