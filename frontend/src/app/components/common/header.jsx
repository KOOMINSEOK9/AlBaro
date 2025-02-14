"use client";

import Link from "next/link";
import DropDownMenu from "../pages/common/DropDownMenu";
import { useState } from "react";

const Header = () => {
  const [view, setView] = useState(false);

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
          <span className="whitespace-nowrap">김싸피님 환영합니다.</span>
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
