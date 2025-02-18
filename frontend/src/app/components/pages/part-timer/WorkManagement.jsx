"use client";
import React, { useState, useEffect } from "react";
import {
  CalendarRange,
  CalendarOff,
  CalendarClock,
  CalendarDays,
  Plus,
  Pencil,
  X,
  ChevronDown,
  Clock,
  ChevronUp,
  ListFilter,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { useScheduleChangeStore } from "@/store/scheduleChangeStore";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import styles from "@/styles/scrollbar.module.css";
import { ko } from "date-fns/locale";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function WorkManagement() {
  const [missedShifts, setMissedShifts] = useState([]);
  const [additionalShifts, setAdditionalShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeSlot, setTimeSlot] = useState({
    workDate: "",
    startTime: "",
    endTime: "",
  });
  const [availableDates, setAvailableDates] = useState([]);
  const [showAllDates, setShowAllDates] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3; // 처음에 보여줄 칩의 개수
  const [showListModal, setShowListModal] = useState(false);
  const DISPLAY_COUNT = 2; // 표시할 칩 개수
  const [isClosing, setIsClosing] = useState(false);
  const [loginUserUserId, setLoginUserUserId] = useState(null);
  const [loginUserStoreId, setLoginUserStoreId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      const decoded = jwtDecode(token);

      setLoginUserUserId(decoded.userId);
      setLoginUserStoreId(decoded.storeId);
    }
  }, []);

  useEffect(() => {
    if (loginUserUserId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-work/absent/${loginUserUserId}`
        )
        .then((response) => {
          //   console.log("알바 마이페이지 결근 정보", response.data);
          setMissedShifts(response.data);
        })
        .catch((error) =>
          console.error("알바 마이페이지 결근 정보 err:", error)
        );
    }
  }, [loginUserUserId]);

  useEffect(() => {
    if (loginUserUserId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-work/substituted/${loginUserUserId}`
        )
        .then((response) => {
          //   console.log("알바 마이페이지 추가 근무 정보", response.data);
          setAdditionalShifts(response.data);
        })
        .catch((error) =>
          console.error("알바 마이페이지 추가 근무 정보 err:", error)
        );
    }
  }, [loginUserUserId]);

  useEffect(() => {
    if (loginUserUserId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/schedule-references/user/${loginUserUserId}`
        )
        .then((response) => {
          // console.log("알바 마이페이지 추가 근무 가능 어쩌구", response.data);
          setAvailableDates(response.data);
        })
        .catch((error) =>
          console.error("Error fetching work management data:", error)
        );
    }
  }, [loginUserUserId]);

  const currentMonth = new Date();
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateClick = (date) => {
    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) return; // 과거 날짜는 선택 불가능
    setSelectedDate(date);
    const existingSlot = availableDates.find(
      (slot) =>
        format(slot.scheduleDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    if (existingSlot) {
      //   console.log("기존 슬롯", existingSlot);
      setTimeSlot({
        startTime: existingSlot.scheduleStartTime,
        endTime: existingSlot.scheduleEndTime,
      });
    } else {
      setTimeSlot({ startTime: "", endTime: "" });
    }
    setShowTimeModal(true);
  };
  const handleTimeUpdate = (date) => {
    const scheduleData = {
      userId: loginUserUserId,
      storeId: loginUserStoreId,
      scheduleDate: format(selectedDate, "yyyy-MM-dd"),
      scheduleStartTime: timeSlot.startTime,
      scheduleEndTime: timeSlot.endTime,
    };

    const existingSlot = availableDates.find(
      (slot) =>
        format(slot.scheduleDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule-references/${existingSlot.scheduleReferenceId}`,
        scheduleData
      )
      .then((res) => {
        // console.log("수정하기", res);
        setShowTimeModal(false);
        location.reload(true);
      })
      .catch((err) => {
        alert("오류가 발생했습니다. 다시 시도해주세요");
        console.log("수정하기 err: ", err);
      });
  };

  const handleTimeSubmit = () => {
    const scheduleData = {
      userId: loginUserUserId,
      storeId: loginUserStoreId,
      scheduleDate: format(selectedDate, "yyyy-MM-dd"),
      scheduleStartTime: timeSlot.startTime,
      scheduleEndTime: timeSlot.endTime,
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule-references`,
        scheduleData
      )
      .then((res) => {
        // console.log("등록하기 API 호출 성공", res);
        setShowTimeModal(false);
        location.reload(true);
      })
      .catch((err) => {
        console.log("등록하기 API 호출 실패", err);
        alert("오류가 발생했습니다. 다시 시도해주세요");
      });
  };

  const handleTimeDelete = () => {
    const newDates = availableDates.filter(
      (slot) =>
        format(slot.scheduleDate, "yyyy-MM-dd") !==
        format(selectedDate, "yyyy-MM-dd")
    );
    setAvailableDates(newDates);
    setShowTimeModal(false);
  };

  const ScheduleCard = ({ item, type }) => (
    <div className="group flex items-center gap-3 p-3 bg-gray-50 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`absolute inset-0 ${
              type === "missed" ? "bg-red-400" : "bg-blue-400"
            } rounded-full opacity-20 animate-[ping_1.5s_ease-in-out_infinite]`}
          />
          <div
            className={`relative w-2 h-2 rounded-full ${
              type === "missed" ? "bg-red-500" : "bg-blue-500"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <p className="font-medium text-sm text-gray-900 group-hover:text-gray-700 transition-colors">
              {item.branch}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <CalendarRange className="w-3.5 h-3.5 shrink-0" />
              <span>
                {format(new Date(item.workDate), "M월 d일(eee)", {
                  locale: ko,
                })}{" "}
                {formatTime(item.startTime)} ~ {formatTime(item.endTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 시간 포맷팅 함수 수정
  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
  };

  // 근무시간 계산 함수 개선
  const calculateWorkHours = (start, end) => {
    if (!start || !end) return "";
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;

    if (hours < 0) hours += 24;
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }

    const hourText = hours > 0 ? `${hours}시간` : "";
    const minuteText = minutes > 0 ? `${minutes}분` : "";

    return `${hourText} ${minuteText}`.trim();
  };

  // 정렬된 날짜 데이터
  const sortedDates = availableDates.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const DateChip = ({ slot }) => (
    <div className="group relative">
      <div
        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 
                        px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
      >
        <CalendarClock className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-blue-600 font-medium whitespace-nowrap">
          {format(slot.scheduleDate, "M월 d일(eee)", { locale: ko })}
        </span>
        <div className="text-xs text-blue-500 whitespace-nowrap">
          {formatTime(slot.startTime)} ~ {formatTime(slot.endTime)}
        </div>

        {/* 호버 시 나타나는 버튼들 */}
        <div
          className="absolute right-0 top-0 h-full opacity-0 
                            group-hover:opacity-100 transition-opacity duration-200 
                            flex items-center"
        >
          <div className="flex gap-1 bg-white shadow-lg rounded-full p-1 -mr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(slot.scheduleDate);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Pencil className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(slot.scheduleDate);
                handleTimeDelete();
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowListModal(false);
      setIsClosing(false);
    }, 200); // 애니메이션 시간과 동일하게 설정
  };

  return (
    <div className="h-[370px] bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="h-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* 근무 취소 섹션 */}
          <div className="h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarOff className="w-5 h-5 text-red-500" />
                <h3 className="text-[15px] font-medium text-gray-800">
                  근무 취소
                </h3>
              </div>
              <span className="text-sm text-gray-500">
                {missedShifts?.length || 0}건
              </span>
            </div>
            <div
              className={`h-[calc(100%-2rem)] overflow-y-auto space-y-2 pr-2 ${styles.customScrollbar}`}
            >
              {missedShifts?.map((item, index) => (
                <div
                  key={item.scheduleId}
                  className="opacity-0 translate-y-2 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ScheduleCard item={item} type="missed" />
                </div>
              ))}
            </div>
          </div>

          {/* 근무 추가 섹션 */}
          <div className="h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-500" />
                <h3 className="text-[15px] font-medium text-gray-800">
                  근무 추가
                </h3>
              </div>
              <span className="text-sm text-gray-500">
                {additionalShifts?.length || 0}건
              </span>
            </div>
            <div
              className={`h-[calc(100%-2rem)] overflow-y-auto space-y-2 pr-2 ${styles.customScrollbar}`}
            >
              {additionalShifts?.map((item, index) => (
                <div
                  key={item.scheduleId}
                  className="opacity-0 translate-y-2 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ScheduleCard item={item} type="additional" />
                </div>
              ))}
            </div>
          </div>

          {/* 근무 가능 일정 섹션 */}
          <div className="h-full overflow-hidden relative">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-green-500" />
              <h3 className="text-[15px] font-medium text-gray-800">
                근무 가능 일정
              </h3>
            </div>

            {/* 캘린더와 칩 영역 */}
            <div className="space-y-4">
              {/* 컴팩트한 캘린더 */}
              <div
                className="bg-gray-50 rounded-lg p-3"
                style={{ height: "300px" }}
              >
                <div className="grid grid-cols-7 gap-1">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-center text-center text-xs font-medium text-gray-500 py-1"
                      style={{ height: "40px", width: "40px" }}
                    >
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => {
                    const isCurrentMonth =
                      format(day, "M") === format(currentMonth, "M");
                    const hasTimeSlot = availableDates.some(
                      (slot) =>
                        format(slot.scheduleDate, "yyyy-MM-dd") ===
                        format(day, "yyyy-MM-dd")
                    );
                    const isToday =
                      format(day, "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd");
                    const isPast =
                      new Date(day) < new Date().setHours(0, 0, 0, 0);
                    const isSelected =
                      selectedDate &&
                      format(selectedDate, "yyyy-MM-dd") ===
                        format(day, "yyyy-MM-dd");

                    return (
                      <div
                        key={index}
                        onClick={() => !isPast && handleDateClick(day)}
                        className={`
                                                    flex items-center justify-center
                                                    relative p-1 text-center cursor-pointer text-sm
                                                    transition-all duration-200 ease-in-out
                                                    ${
                                                      !isCurrentMonth
                                                        ? "text-gray-300"
                                                        : isPast
                                                        ? "text-gray-400"
                                                        : "text-gray-700"
                                                    }
                                                    ${
                                                      hasTimeSlot
                                                        ? "border-2 border-green-500 bg-green-100 text-green-700"
                                                        : ""
                                                    }
                                                    ${
                                                      isToday
                                                        ? "border-2 border-gray-500 bg-gray-100 text-gray-700"
                                                        : ""
                                                    }
                                                    ${
                                                      isPast
                                                        ? "cursor-not-allowed"
                                                        : ""
                                                    }
                                                `}
                        style={{
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                        }}
                      >
                        {format(day, "d")}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 슬라이드 오버 패널 */}
            {showListModal && (
              <>
                {/* 배경 오버레이 */}
                <div
                  className={`absolute inset-0 bg-gray-900/5 backdrop-blur-[1px] z-10
                                              ${
                                                isClosing
                                                  ? "animate-fadeOut"
                                                  : "animate-fadeIn"
                                              }`}
                  onClick={handleClose}
                />

                <div
                  className={`absolute inset-0 z-20 
                                              ${
                                                isClosing
                                                  ? "animate-slideOverPanelClose"
                                                  : "animate-slideOverPanel"
                                              }`}
                >
                  <div className="h-full bg-white flex flex-col">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleClose}
                          className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                          <h3 className="text-[15px] font-semibold text-gray-900">
                            전체 근무 가능 일정
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            총 {sortedDates.length}개의 일정
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 리스트 */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <div className="space-y-3">
                        {sortedDates.map((slot, index) => (
                          <div
                            key={index}
                            className="group relative bg-white border border-gray-100 rounded-xl 
                                                                     shadow-sm hover:shadow-md transition-all duration-200
                                                                     animate-fadeInUp"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-10 h-10 flex items-center justify-center 
                                                                              bg-blue-50 rounded-lg border border-blue-100"
                                >
                                  <CalendarClock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="text-sm font-medium text-gray-900">
                                    {format(slot.scheduleDate, "M월 d일(eee)", {
                                      locale: ko,
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {formatTime(slot.startTime)} ~{" "}
                                      {formatTime(slot.endTime)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDateClick(slot.date)}
                                  className="p-2 text-gray-400 hover:text-blue-600 
                                                                             hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedDate(slot.scheduleDate);
                                    handleTimeDelete();
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-600 
                                                                             hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* 호버 시 나타나는 하이라이트 효과 */}
                            <div
                              className="absolute inset-0 border-2 border-transparent
                                                                      group-hover:border-blue-100 rounded-xl
                                                                      transition-colors duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Time Slot Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[380px] shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {availableDates.some(
                  (slot) =>
                    format(slot.scheduleDate, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                )
                  ? "근무 가능 시간 수정"
                  : "근무 가능 시간 등록"}
              </h3>
              <button
                onClick={() => setShowTimeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-600" />
                <span>
                  {format(selectedDate, "yyyy년 M월 d일(eee)", { locale: ko })}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      시작 시간
                    </label>
                    <select
                      value={
                        timeSlot.startTime
                          ? timeSlot.startTime.substring(0, 5)
                          : ""
                      }
                      onChange={(e) =>
                        setTimeSlot({
                          ...timeSlot,
                          startTime: e.target.value + ":00",
                        })
                      }
                      className="w-full appearance-none bg-gray-50 border border-gray-300 
                                                     rounded-lg py-2.5 px-3 text-gray-800 leading-tight 
                                                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white"
                    >
                      <option value="" disabled={timeSlot.startTime}>
                        선택해주세요
                      </option>
                      {Array.from({ length: 48 }).map((_, i) => {
                        const hour = Math.floor(i / 2)
                          .toString()
                          .padStart(2, "0");
                        const minute = i % 2 === 0 ? "00" : "30";
                        const timeStr = `${hour}:${minute}`;
                        const isPastTime =
                          new Date(
                            `${format(selectedDate, "yyyy-MM-dd")}T${timeStr}`
                          ) < new Date();

                        return (
                          <option
                            key={timeStr}
                            value={timeStr}
                            disabled={isPastTime}
                          >
                            {formatTime(timeStr)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      종료 시간
                    </label>
                    <select
                      value={
                        timeSlot.endTime ? timeSlot.endTime.substring(0, 5) : ""
                      }
                      onChange={(e) =>
                        setTimeSlot({
                          ...timeSlot,
                          endTime: e.target.value + ":00",
                        })
                      }
                      className="w-full appearance-none bg-gray-50 border border-gray-300 
                                                     rounded-lg py-2.5 px-3 text-gray-800 leading-tight 
                                                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white"
                    >
                      <option value="">선택해주세요</option>
                      {Array.from({ length: 48 }).map((_, i) => {
                        const hour = Math.floor(i / 2)
                          .toString()
                          .padStart(2, "0");
                        const minute = i % 2 === 0 ? "00" : "30";
                        const timeStr = `${hour}:${minute}`;
                        const isPastTime =
                          new Date(
                            `${format(selectedDate, "yyyy-MM-dd")}T${timeStr}`
                          ) < new Date();

                        return (
                          <option
                            key={timeStr}
                            value={timeStr}
                            disabled={isPastTime}
                          >
                            {formatTime(timeStr)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {timeSlot.startTime && timeSlot.endTime && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>총 근무 시간: </span>
                      <span className="font-medium text-gray-800">
                        {calculateWorkHours(
                          timeSlot.startTime,
                          timeSlot.endTime
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {availableDates.some(
                  (slot) =>
                    format(slot.scheduleDate, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                ) ? (
                  <button
                    onClick={() => handleTimeUpdate(selectedDate)}
                    className="flex-1 bg-gray-800 text-white rounded-lg py-2.5 
                                               hover:bg-gray-900 transition-colors font-medium shadow-md"
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    onClick={handleTimeSubmit}
                    className="flex-1 bg-gray-800 text-white rounded-lg py-2.5 
                                               hover:bg-gray-900 transition-colors font-medium shadow-md"
                  >
                    등록하기
                  </button>
                )}

                <button
                  onClick={() => setShowTimeModal(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-600 rounded-lg py-2.5 
                                             hover:bg-gray-100 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
