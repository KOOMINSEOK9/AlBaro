const DropDownMenu = () => {
  return (
    <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-l text-gray-800 overflow-hidden">
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">마이페이지</li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">로그아웃</li>
    </ul>
  );
};

export default DropDownMenu;
