"use client";

import { jwtDecode } from "jwt-decode";

import Link from "next/link";
import DropDownMenu from "../pages/common/DropDownMenu";
import { useEffect, useState } from "react";

const Header = () => {
  const [view, setView] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loginUserName, setLoginUserName] = useState(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      const decoded = jwtDecode(token);

      setLoginUserName(decoded.username);
    }
  }, []);

  return (
    <header className="bg-[#222831] text-white py-3 px-6 flex justify-between items-center relative">
      <Link href="/main" className="text-2xl font-bold">
        AlBaro
      </Link>
      <div className="relative">
        <button
          onClick={() => setView(!view)}
          className="flex items-center gap-2 px-4 py-2 rounded-md"
        >
          <span className="whitespace-nowrap">
            {loginUserName}님 환영합니다.
          </span>
          <span className="text-sm transition-transform duration-200 align-middle text-c">
            {view ? "︿" : "﹀"}
          </span>
        </button>
        {view && <DropDownMenu />}
      </div>
    </header>
  );
};

export default Header;
