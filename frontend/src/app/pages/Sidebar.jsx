"use client";

import SidebarMenu from "../components/pages/common/SidebarMenu.jsx";

const Sidebar = () => {
  return (
    <div className="h-full w-full bg-gradient-to-r from-gray-100 to-white pl-4">
      <section className="h-full">
        <SidebarMenu />
      </section>
    </div>
  );
};

export default Sidebar;