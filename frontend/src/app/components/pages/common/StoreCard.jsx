import React from "react";

const StoreCard = ({ stores, onSelectStore, selectedStore }) => {
  return (
    <div className="overflow-y-auto whitespace-nowrap">
      {stores.map((store, index) => (
        <div
          key={index}
          className={`p-4 mb-3 rounded-lg shadow cursor-pointer 
           ${
             selectedStore?.storeName === store.storeName
               ? "border-2 border-solid border-black shadow-xl"
               : "bg-white hover:bg-gray-200"
           }`}
          onClick={() => onSelectStore(store)}
        >
          <h3 className="text-lg font-semibold">{store.storeName}</h3>
          <p className="text-sm text-gray-600">
            {store.roadAddress} {store.detailedAddress}
          </p>
          <p className="text-xs text-gray-500"></p>
        </div>
      ))}
    </div>
  );
};

export default StoreCard;
