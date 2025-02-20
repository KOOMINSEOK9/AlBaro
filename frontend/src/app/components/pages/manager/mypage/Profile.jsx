"use client";
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState('/default-profile.png');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError('로그인이 필요합니다.');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        // 병렬로 두 요청을 처리
        const [userInfoResponse, profileImageResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-work/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUserInfo(userInfoResponse.data);
        if (profileImageResponse.data && profileImageResponse.data.filePath) {
          setProfileImage(profileImageResponse.data.filePath);
        }
        setError(null);
      } catch (err) {
        setError('정보를 불러오는데 실패했습니다.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md flex items-center justify-center">
      <p>로딩 중...</p>
    </div>;
  }

  if (error) {
    return <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  return (
    <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md">
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center justify-center h-full p-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative border border-gray-100 shadow-sm">
          <Image
            src={profileImage}
            alt="프로필 이미지"
            fill
            sizes="(max-width: 96px) 100vw"
            className="object-cover"
            priority
          />
        </div>
        <h2 className="text-xl font-bold text-center">{userInfo?.userName || '이름 없음'}</h2>
        <div className="flex items-center justify-center text-gray-600 mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{userInfo?.storeName || '지점 정보 없음'}</span>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full flex items-center p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-gray-100 overflow-hidden relative">
            <Image
              src={profileImage}
              alt="프로필 이미지"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{userInfo?.userName || '이름 없음'}</h2>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{userInfo?.storeName || '지점 정보 없음'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
