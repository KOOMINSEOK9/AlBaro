"use client";
import React, { useState } from "react";
import {
  ClipboardX,
  ClipboardCheck,
  ClipboardList,
  CalendarRange,
} from "lucide-react";
import styles from "@/styles/scrollbar.module.css";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function ShiftList({
  isVacantList,
  myStoreDetaList,
  notMyStoreDetaList,
}) {
  // console.log(isVacantList);
  // console.log(myStoreDetaList);
  // console.log(notMyStoreDetaList);

  const [activeTab, setActiveTab] = useState("vacancy");

  const tabs = [
    { id: "vacancy", label: "우리 지점 공석", icon: ClipboardX, color: "red" },
    {
      id: "ourStore",
      label: "우리 지점 대타",
      icon: ClipboardCheck,
      color: "blue",
    },
    {
      id: "otherStore",
      label: "타지점 대타",
      icon: ClipboardList,
      color: "green",
    },
  ];

  const getShiftsByType = (type) => {
    switch (type) {
      case "vacancy":
        return isVacantList;
      case "ourStore":
        return myStoreDetaList;
      case "otherStore":
        return notMyStoreDetaList;
      default:
        return [];
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
  };

  const ShiftCard = ({ shift }) => (
    <div className="group flex items-center gap-3 p-3 bg-gray-50 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gray-400 rounded-full opacity-20 animate-[ping_1.5s_ease-in-out_infinite]" />
          <div className="relative w-2 h-2 rounded-full bg-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <p className="font-medium text-sm text-gray-900 group-hover:text-gray-700 transition-colors truncate">
              {shift.userName}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <CalendarRange className="w-3.5 h-3.5 shrink-0" />
              <span>
                {format(new Date(shift.workDate), "M월 d일(eee)", {
                  locale: ko,
                })}{" "}
                {formatTime(shift.startTime)} ~ {formatTime(shift.endTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop Layout */}
      <div className="h-full hidden lg:grid grid-cols-3 gap-6 p-6">
        {tabs.map((tab, index) => (
          <div key={index} className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <tab.icon
                  className={`w-5 h-5 text-${tab.color}-500 shrink-0`}
                />
                <h3 className="text-[15px] font-medium text-gray-800">
                  {tab.label}
                </h3>
              </div>
              <span className="text-sm text-gray-500 shrink-0">
                {getShiftsByType(tab.id).length}명
              </span>
            </div>
            <div
              className={`h-[calc(100%-2rem)] overflow-y-auto space-y-2 pr-2 ${styles.customScrollbar}`}
            >
              {getShiftsByType(tab.id).map((shift, index) => (
                <div
                  key={index}
                  className="opacity-0 translate-y-2 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ShiftCard shift={shift} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Tab Menu */}
        <div className="relative flex px-2 py-3 gap-2 border-b border-gray-100">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-full text-sm font-medium
                            transition-all duration-300 ease-out active:scale-95
                            ${activeTab === tab.id
                  ? `bg-${tab.color}-50 text-${tab.color}-600 ring-1 ring-${tab.color}-200 shadow-sm`
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="truncate">
                {tab.label.replace("우리 지점 ", "")}
              </span>
              <span
                className={`text-xs ${activeTab === tab.id
                    ? `text-${tab.color}-500`
                    : "text-gray-400"
                  }`}
              >
                {getShiftsByType(tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className={`flex-1 h-[calc(100%-56px)] overflow-y-auto p-3 ${styles.customScrollbar}`}
        >
          <div className="space-y-2">
            {getShiftsByType(activeTab).map((shift, index) => (
              <div
                key={index}
                className="opacity-0 translate-y-2 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ShiftCard shift={shift} />
              </div>
            ))}
            {getShiftsByType(activeTab).length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                목록이 없습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
