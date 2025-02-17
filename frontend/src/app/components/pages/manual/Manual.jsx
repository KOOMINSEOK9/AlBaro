import React, { useState } from 'react';
import { Book, Search, ChevronLeft, X } from 'lucide-react';

const Manual = () => {
  const items = [
    { name: '아메리카노', image: 'americano.png' },
    { name: '카페 라떼', image: 'cafelatte.png' },
    { name: '티라미수 라떼', image: 'tiramisu_latte.png' },
    { name: '카푸치노', image: 'cappuccino.png' },
    { name: '플랫 화이트', image: 'flatwhite.png' },
    { name: '카라멜 마키아토', image: 'caramelmacchiato.png' },
    { name: '화이트 모카', image: 'whitemoca.png' },
    { name: '콜드브루', image: 'coldbrew.png' },
    { name: '바닐라 콜드 브루', image: 'vanillacoldbrew.png' },
    { name: '콜드 브루 쉐이크', image: 'coldbrewshake.png' },
    { name: '자바 칩 프라페', image: 'javachipfrappe.png' },
    { name: '카라멜 프라페', image: 'caramelfrappe.png' },
    { name: '초콜릿 시그니처', image: 'chocolatesignature.png' },
    { name: '망고 바나나 스무디', image: 'mangobanana.png' },
    { name: '베리 블렌드', image: 'berryblend.png' },
    { name: '민트 티 블렌드', image: 'mintteablend.png' },
    { name: '밀크티', image: 'milktea.png' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemsPerPage = 9;

  // 검색 필터링
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative h-full bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm overflow-hidden">
      {/* 메뉴얼 목록 */}
      <div className={`h-full flex flex-col transition-transform duration-300 ease-out ${selectedItem ? '-translate-x-full' : 'translate-x-0'}`}>
        {/* 헤더 영역 */}
        <div className="h-20 min-h-[5rem] flex items-center justify-between px-8 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Book className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">
              메뉴얼
            </h2>
          </div>
          <button
            className="p-2 rounded-full bg-white border border-gray-300 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* 검색 영역 */}
        <div
          className={`absolute top-20 left-0 w-full p-4 bg-white border-b shadow-sm z-10 transition-all duration-300 ease-in-out transform ${isSearchOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="메뉴 검색..."
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSearchTerm('');
                setIsSearchOpen(false);
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 그리드 */}
          <div className="grid grid-cols-3 gap-4">
            {currentItems.map((item, index) => (
              <div key={index} className="group">
                <div
                  className="bg-white rounded-xl overflow-hidden cursor-pointer shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative pt-[100%]">
                    <img
                      src={`/cafe/${item.image}`}
                      alt={item.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-2 py-1.5">
                    <span className="block text-center text-xs font-semibold text-gray-800 line-clamp-2">
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors
                    ${currentPage === page
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-500 bg-white shadow hover:shadow-md'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 레시피 상세 */}
      <div
        className={`absolute top-0 left-full h-full w-full bg-white transform transition-transform duration-300 ease-out ${selectedItem ? '-translate-x-full' : 'translate-x-0'
          }`}
      >
        {selectedItem && (
          <div className="h-full flex flex-col">
            <div className="px-8 py-6 border-b bg-white shadow-sm">
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 mb-4 transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">목록으로</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedItem.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <img
                src={`/cafe/${selectedItem.image}`}
                alt={selectedItem.name}
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg mb-8"
              />
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">레시피 정보</h3>
                <p className="text-gray-600">
                  레시피 정보는 추후 추가될 예정입니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manual;