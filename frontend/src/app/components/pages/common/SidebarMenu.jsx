"use client";

import { useState } from "react";
import Chat from "./Chat.jsx";
import Notice from "./Notice.jsx";
import Menual from "./Menual.jsx";

const SidebarMenu = () => {
  const [activeComponent, setActiveComponent] = useState(<Chat />); // 초기 화면 설정

  return (
    <div style={{ display: "flex" }}>
      {/* 사이드바 메뉴 */}
      <div className="text-white-50 p-5">
        <div className="py-7" onClick={() => setActiveComponent(<Chat />)}>
          Chat
        </div>
        <div className="py-7" onClick={() => setActiveComponent(<Notice />)}>
          Notice
        </div>
        <div className="py-7" onClick={() => setActiveComponent(<Menual />)}>
          Menual
        </div>
      </div>

      {/* 선택한 화면 출력 */}
      <div className="w-full h-full bg-[#eee] p-20 text-black">
        {activeComponent}
      </div>
    </div>
  );
};

export default SidebarMenu;
