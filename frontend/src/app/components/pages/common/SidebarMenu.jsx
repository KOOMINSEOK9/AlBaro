'use client';

import React, { useState } from "react";
import ChatRoom from "../chat/ChatRoom";
import Notice from "../notice/Notice";
import Manual from "../manual/Manual";
import { MessageSquare, Bell, Book } from 'lucide-react';

const SidebarMenu = () => {
  const [activeComponent, setActiveComponent] = useState(<ChatRoom />);
  const [activeMenu, setActiveMenu] = useState('Chat');

  const handleMenuClick = (component, menuName) => {
    setActiveComponent(component);
    setActiveMenu(menuName);
  };

  return (
    <div className="flex h-full bg-white">
      {/* 사이드바 메뉴 */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-6">
        <div
          className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeMenu === 'Chat'
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-500 hover:bg-gray-100'
            }`}
          onClick={() => handleMenuClick(<ChatRoom />, 'Chat')}
        >
          <MessageSquare size={20} />
        </div>
        <div
          className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeMenu === 'Notice'
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-500 hover:bg-gray-100'
            }`}
          onClick={() => handleMenuClick(<Notice />, 'Notice')}
        >
          <Bell size={20} />
        </div>
        <div
          className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeMenu === 'Manual'
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-500 hover:bg-gray-100'
            }`}
          onClick={() => handleMenuClick(<Manual />, 'Manual')}
        >
          <Book size={20} />
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1">
        {activeComponent}
      </div>
    </div>
  );
};

export default SidebarMenu;