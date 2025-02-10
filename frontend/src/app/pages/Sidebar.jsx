"use client";

import SidebarMenu from "../components/pages/common/SidebarMenu.jsx";

const Sidebar = () => {
  return (
    <div className="flex h-full w-full">
      <section className="h-full bg-[#222831]">
        <SidebarMenu />
      </section>
    </div>
  );
};

export default Sidebar;
