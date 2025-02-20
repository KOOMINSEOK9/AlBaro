// src/app/components/common/DropDownMenu.jsx
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserCircle, LogOut } from 'lucide-react';

const DropDownMenu = ({ isOpen }) => {
  const router = useRouter();
  const [loginUserRole, setLoginUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        setLoginUserRole(decoded.role);
      }
    }
  }, []);

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 backdrop-blur-sm bg-white/90 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-[dropDown_0.3s_ease-in-out] z-50">
      <style jsx>{`
        @keyframes dropDown {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="py-2 px-1">
        {loginUserRole && (
          <Link
            href={loginUserRole === "manager" ? "/manager/mypage" : "/part-timer/mypage"}
            className="group flex w-full items-center px-3 py-2.5 text-sm text-gray-600 rounded-lg transition-all duration-200 mx-1 hover:bg-gray-100/80 hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserCircle
              size={18}
              className="mr-2.5 text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <span className="font-medium">마이페이지</span>
          </Link>
        )}

        <div className="my-1.5 border-t border-gray-100/70" />

        <button
          onClick={logout}
          className="group flex w-full items-center px-3 py-2.5 text-sm text-gray-600 rounded-lg transition-all duration-200 mx-1 hover:bg-red-50/80 hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut
            size={18}
            className="mr-2.5 text-gray-400 group-hover:text-red-500 transition-colors"
          />
          <span className="font-medium group-hover:text-red-500">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default DropDownMenu;