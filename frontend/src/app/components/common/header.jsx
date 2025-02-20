"use client";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";
import axios from 'axios';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: null,
    role: null
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        console.log('Decoded token:', decoded); // 토큰 내용 확인

        // API를 통해 사용자 정보 가져오기
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-work/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserInfo({
          name: response.data.userName,
          role: decoded.role // 토큰의 role 값을 직접 사용
        });

      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (typeof window !== "undefined") {
      fetchUserInfo();
    }
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="bg-[#1a2236] text-white py-2 px-6 flex justify-between items-center relative border-b border-gray-700 shadow-sm">
      <Link href="/" className="flex items-center">
        <span className="font-['Freesentation-9Black'] text-2xl">AlBaro</span>
      </Link>

      <div className="relative dropdown-container">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium mt-0.5">
            {userInfo.name}님
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full ${userInfo.role === 'manager'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/20'
              }`}
          >
            {userInfo.role === 'manager' ? '점장' : '직원'}
          </span>
        </button>
        <DropDownMenu isOpen={isDropdownOpen} />
      </div>
    </header>
  );
};

export default Header;