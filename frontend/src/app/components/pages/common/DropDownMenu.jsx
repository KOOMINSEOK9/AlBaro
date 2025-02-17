import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Link from "next/link";

const DropDownMenu = () => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState(null);
  const [loginUserRole, setLoginUserRole] = useState(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      const decoded = jwtDecode(token);

      setLoginUserRole(decoded.role);
    }
  }, []);

  const logout = async () => {
    try {
      // 백엔드에 로그아웃 요청
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      // 로컬 스토리지의 토큰 제거
      localStorage.removeItem("accessToken");

      // 쿠키 삭제
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 로그인 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-l text-gray-800 overflow-hidden">
      {loginUserRole === "staff" ? (
        <Link href="/part-timer/mypage">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            마이페이지
          </li>
        </Link>
      ) : loginUserRole === "manager" ? (
        <Link href="/manager/mypage">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            마이페이지
          </li>
        </Link>
      ) : null}

      {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">마이페이지</li> */}

      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={logout}
      >
        로그아웃
      </li>
    </ul>
  );
};

export default DropDownMenu;
