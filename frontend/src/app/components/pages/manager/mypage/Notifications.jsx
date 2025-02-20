"use client";
import React from "react";
import { Bell, UserCheck, Clock, AlertCircle, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import useNotificationStore from "@/store/notificationStore";
import styles from "@/styles/scrollbar.module.css";
import axios from "axios";

export default function Notifications({ notificationList }) {
  const { notifications, removeNotification } = useNotificationStore();
  const [removingId, setRemovingId] = React.useState(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const denyNotification = async (id, alarmContent) => {
    const regex = /(\d{4}-\d{2}-\d{2})일 (\d{2}:\d{2})~(\d{2}:\d{2})/;
    const match = alarmContent.match(regex);

    if (!match) {
      console.error("날짜와 시간 정보를 찾을 수 없습니다.");
      return;
    }

    const workDate = match[1];
    const startTime = match[2];
    const endTime = match[3];

    setRemovingId(id);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/reject-subRequest/${id}`,
        null,
        {
          params: {
            workDate: workDate,
            startTime: startTime,
            endTime: endTime,
          },
        }
      );
    } catch (err) {
      console.error("요청 처리 실패:", err);
      console.error("에러 세부 정보:", err.response?.data);
    } finally {
      setTimeout(() => {
        removeNotification(id);
      }, 300);
    }
  };

  const handleNotificationAction = async (id, alarmContent) => {
    setRemovingId(id);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/alarms/${id}`
      );
    } catch (err) {
      console.error("요청 처리 실패:", err);
      console.error("에러 세부 정보:", err.response?.data);
    } finally {
      setTimeout(() => {
        removeNotification(id);
      }, 300);
    }
  };

  const handleApproveNotificationAction = async (id, alarmContent) => {
    const regex = /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})~(\d{2}:\d{2})/;
    const match = alarmContent.match(regex);

    if (!match) {
      console.error("날짜와 시간 정보를 찾을 수 없습니다.");
      return;
    }

    const workDate = match[1];
    const startTime = match[2];
    const endTime = match[3];

    setRemovingId(id);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/approve/${id}`,
        null,
        {
          params: {
            workDate: workDate,
            startTime: startTime,
            endTime: endTime,
          },
        }
      );
    } catch (err) {
      console.error("요청 처리 실패:", err);
      console.error("에러 세부 정보:", err.response?.data);
    } finally {
      setTimeout(() => {
        removeNotification(id);
      }, 300);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "request":
        return <AlertCircle className="text-blue-500" size={18} />;
      case "schedule":
        return <Clock className="text-green-500" size={18} />;
      case "response":
        return <UserCheck className="text-purple-500" size={18} />;
      default:
        return <Bell className="text-gray-500" size={18} />;
    }
  };

  return (
    <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <h3 className="text-[15px] font-medium text-gray-700">
            알림
            {notificationList.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">
                {notificationList.length}개
              </span>
            )}
          </h3>
        </div>
      </div>

      <div
        className={`h-[calc(100%-3.5rem)] overflow-y-auto space-y-2 pr-2 snap-y snap-mandatory ${styles.customScrollbar}`}
      >
        {notificationList.map((noti) => (
          <div
            key={noti.alarmId}
            className={`bg-gray-50 rounded-lg p-3 relative group snap-start
                            transition-all duration-300 ease-in-out hover:shadow-sm
                            ${removingId === noti.alarmId
                ? "opacity-0 -translate-x-full"
                : "opacity-100 translate-x-0"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(noti.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black mb-1">
                  {noti.alarmContent}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {noti.alarmType === "SUBSTITUTION_REQUEST" ||
                  (noti.alarmType === "MANAGER_APPROVAL" && (
                    <>
                      <button
                        onClick={() =>
                          handleApproveNotificationAction(
                            noti.alarmId,
                            noti.alarmContent
                          )
                        }
                        className="h-9 w-9 bg-blue-500 text-white rounded-full
                                                hover:bg-blue-600 transition-transform hover:scale-105
                                                active:scale-95 duration-150 flex items-center justify-center shadow-md"
                        aria-label="수락"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() =>
                          denyNotification(noti.alarmId, noti.alarmContent)
                        }
                        className="h-9 w-9 border border-gray-300 rounded-full
                                                hover:bg-gray-100 transition-transform hover:scale-105
                                                active:scale-95 duration-150 flex items-center justify-center shadow-md"
                        aria-label="거절"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ))}
                {noti.alarmType !== "SUBSTITUTION_REQUEST" &&
                  noti.alarmType !== "MANAGER_APPROVAL" && (
                    <button
                      onClick={() => handleNotificationAction(noti.alarmId)}
                      className="px-4 py-2 text-xs text-white bg-gray-500 hover:bg-gray-600
                                            transition-transform hover:scale-105 active:scale-95 rounded-full shadow-md"
                    >
                      확인
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            새로운 알림이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
