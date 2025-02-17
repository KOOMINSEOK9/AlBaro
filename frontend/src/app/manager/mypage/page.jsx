"use client";

import React from "react";
import Profile from "@/app/components/pages/manager/mypage/Profile";
import AlbaList from "@/app/components/pages/manager/mypage/AlbaList";
import Notifications from "@/app/components/pages/manager/mypage/Notifications";
import ShiftList from "@/app/components/pages/manager/mypage/ShiftList";
import { Menu } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

import Header from "@/app/components/common/header";

export default function ManagerPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [loginUserUserId, setLoginUserUserId] = useState(null);
  const [loginUserStoreId, setLoginUserStoreId] = useState(null);

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

  // 유저 이름, 스토어 정보 받아오기
  const [userName, setUserName] = useState(null);
  const [userStore, setUserStore] = useState(null);

  useEffect(() => {
    if (loginUserUserId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/manager/user/${loginUserUserId}`
        )
        .then((res) => {
          //   console.log(res);
          setUserName(res.data.userName);
          setUserStore(res.data.storeName);
        })
        .catch((err) => {
          console.log("매니저 유저 정보 조회 에러: ", err);
        });
    }
  }, [loginUserUserId]);

  // 알람
  const [notificationList, setNotificationList] = useState([]);
  useEffect(() => {
    if (loginUserUserId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/alarms/${loginUserUserId}`
        )
        .then((res) => {
          //   console.log("alarm", res.data);
          setNotificationList(res.data);
        })
        .catch((err) => [console.log(err)]);
    }
  });

  // 우리 지점 공석 근무 정보 조회
  const [isVacantList, setIsVacantList] = useState([]);

  useEffect(() => {
    if (loginUserStoreId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/manager/vacant/${loginUserStoreId}`
        )
        .then((res) => {
          //   console.log("우리 지점 공석", res.data);
          setIsVacantList(res.data);
        });
    }
  }, [loginUserStoreId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="lg:h-[calc(100vh-6rem)] pt-16 lg:pt-8 pb-16">
        <div className="mx-auto px-4 lg:px-24">
          {/* Top Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-24 lg:gap-5">
              {/* Profile - Full width on mobile */}
              <div className="lg:col-span-5">
                <div className="lg:h-[230px]">
                  <Profile userName={userName} userStore={userStore} />
                </div>
              </div>

              {/* Alba List - Full width on mobile */}
              <div className="lg:col-span-10">
                <div className="lg:h-[230px]">
                  <AlbaList />
                </div>
              </div>

              {/* Notifications - Full width on mobile */}
              <div className="lg:col-span-9">
                <div className="lg:h-[230px]">
                  <Notifications notificationList={notificationList} />
                </div>
              </div>
            </div>
          </div>

          {/* Shift List - Full width on mobile */}
          <div className="lg:h-[370px]">
            <ShiftList isVacantList={isVacantList} />
          </div>
        </div>

        {/* Mobile Navigation - Fixed bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
          <div className="flex justify-around items-center h-16">
            <button className="flex flex-col items-center justify-center w-full py-2 text-blue-500">
              <span className="block h-6 w-6 mb-1">🏠</span>
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center w-full py-2">
              <span className="block h-6 w-6 mb-1">👥</span>
              <span className="text-xs">Staff</span>
            </button>
            <button className="flex flex-col items-center justify-center w-full py-2">
              <span className="block h-6 w-6 mb-1">📅</span>
              <span className="text-xs">Schedule</span>
            </button>
            <button className="flex flex-col items-center justify-center w-full py-2">
              <span className="block h-6 w-6 mb-1">⚙️</span>
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}
