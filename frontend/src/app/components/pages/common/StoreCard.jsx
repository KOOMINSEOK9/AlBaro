import React from "react";

const StoreCard = ({ stores, onSelectStore, selectedStore }) => {
  return (
    <div className="h-full max-h-full overflow-y-auto">
      <div className="flex flex-col gap-4">
        {stores.map((store, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow cursor-pointer transition
           ${selectedStore?.storeName === store.storeName
                ? "border-2 border-black shadow-xl"
                : "bg-white hover:bg-gray-200"
              }`}
            onClick={() => onSelectStore(store)}
          >
            <h3 className="text-lg font-semibold">{store.storeName}</h3>
            <p className="text-xs text-gray-600">
              {store.roadAddress} {store.detailedAddress}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreCard;
