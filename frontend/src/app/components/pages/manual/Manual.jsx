import React, { useState } from "react";
import { Book, Search, ChevronLeft, X } from "lucide-react";

const RecipeSection = ({ recipe, imageName }) => {
  if (!recipe)
    return (
      <p className="text-gray-600">레시피 정보는 추후 추가될 예정입니다.</p>
    );

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* 이미지와 설명 */}
        <div className="mb-8 pb-8 border-b">
          {/* 이미지 섹션 */}
          <div className="w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden bg-pink-100">
            <img
              src={`/cafe/${imageName}`}
              alt="음료 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          {/* 설명 섹션 */}
          <p className="text-gray-700 text-center whitespace-pre-line w-64 mx-auto">
            {recipe.description}
          </p>
        </div>

        {/* 재료 정보 */}
        <div className="mb-8 pb-8 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">재료</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700 flex-1">{ingredient.name}</span>
                <span className="text-gray-500">{ingredient.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 제조 방법 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">제조 방법</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="text-lg font-bold text-blue-500 flex-shrink-0">
                  {index + 1}.
                </span>
                <span className="text-gray-700 whitespace-pre-wrap">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const Manual = () => {
  const items = [
    {
      name: "아메리카노",
      image: "americano.png",
      recipe: {
        description:
          "깊은 에스프레소의 풍미와 뜨거운 물의 조화로운 클래식 커피",
        ingredients: [
          { name: "에스프레소 더블샷", amount: "30ml" },
          { name: "뜨거운 물", amount: "180ml" },
          { name: "얼음 (아이스 전용)", amount: "150g" },
        ],
        steps: [
          "에스프레소 더블샷을 추출합니다. \n(18-21g 원두 사용)",
          "잔에 에스프레소를 먼저 붓습니다.",
          "뜨거운 물(92-96°C)을 천천히 부어 크레마가 섞이도록 합니다.",
          "아이스의 경우 얼음 위에 에스프레소를 붓고 차가운 물을 추가합니다.",
        ],
      },
    },
    {
      name: "카페 라떼",
      image: "cafelatte.png",
      recipe: {
        description:
          "부드러운 우유 거품 위로 풍부한 에스프레소를 부어낸 시그니처 음료",
        ingredients: [
          { name: "에스프레소 더블샷", amount: "30ml" },
          { name: "우유", amount: "200ml" },
        ],
        steps: [
          "스팀 피처로 우유를 섞으면서 60-65°C로 데웁니다.",
          "데운 우유를 잔에 따르고 에스프레소를 가운데에 부어냅니다.",
          "아트를 그려 마무리합니다.",
        ],
      },
    },
    {
      name: "티라미수 라떼",
      image: "tiramisu_latte.png",
      recipe: {
        description:
          "에스프레소와 달콤한 티라미수 시럽, 우유가 조화를 이루는 달콤한 음료",
        ingredients: [
          { name: "에스프레소", amount: "30ml" },
          { name: "티라미수 시럽", amount: "20ml" },
          { name: "우유", amount: "180ml" },
          { name: "코코아 파우더", amount: "1g" },
        ],
        steps: [
          "잔에 티라미수 시럽을 넣습니다.",
          "에스프레소를 추출하여 시럽 위에 부어 섞어줍니다.",
          "따뜻한 우유를 천천히 부어 층을 만듭니다.",
          "코코아 파우더로 토핑을 올려 완성합니다.",
        ],
      },
    },
    {
      name: "카푸치노",
      image: "cappuccino.png",
      recipe: {
        description:
          "에스프레소 위에 벨벳처럼 부드러운 우유 거품을 얹어 부드럽고 달콤한 맛을 전해주는 커피",
        ingredients: [
          { name: "에스프레소 더블샷", amount: "30ml" },
          { name: "우유", amount: "140ml" },
          { name: "얼음 (아이스 전용)", amount: "100g" },
        ],
        steps: [
          "60-65°C 정도로 데운 우유를 섞어가며 부드러운 거품을 만듭니다.",
          "잔에 에스프레소를 먼저 따릅니다.",
          "에스프레소 위에 우유 거품이 층을 만들도록 부드럽게 따라냅니다.",
          "시나몬 파우더로 가니쉬하여 완성합니다.",
        ],
      },
    },
    {
      name: "플랫 화이트",
      image: "flatwhite.png",
      recipe: {
        description:
          "벨벳 텍스처의 스팀 밀크 위에 에스프레소의 풍부한 풍미를 느낄 수 있는 커피",
        ingredients: [
          { name: "에스프레소 더블샷", amount: "30ml" },
          { name: "우유", amount: "120ml" },
        ],
        steps: [
          "60-65°C 정도의 온도로 우유를 데워 매끄러운 텍스처로 만듭니다.",
          "에스프레소 더블샷을 추출합니다.",
          "잔에 우유를 3/4 정도 채운 후 에스프레소를 가운데에 부어냅니다.",
          "거품은 1cm 미만으로 얇게 올려 완성합니다.",
        ],
      },
    },
    {
      name: "카라멜 마키아토",
      image: "caramelmacchiato.png",
      recipe: {
        description:
          "달콤한 카라멜 소스와 우유, 그 위에 에스프레소를 부어 눈과 입을 즐겁게 해주는 음료",
        ingredients: [
          { name: "에스프레소", amount: "30ml" },
          { name: "카라멜 소스", amount: "30ml" },
          { name: "우유", amount: "200ml" },
        ],
        steps: [
          "잔 바닥에 카라멜 소스를 넣습니다.",
          "소스 위에 따뜻하게 데운 우유를 부어줍니다.",
          "잔 위에 에스프레소를 부어 층을 만들어 줍니다.",
          "카라멜 드리즐로 장식하여 완성합니다.",
        ],
      },
    },
    {
      name: "화이트 모카",
      image: "whitemoca.png",
      recipe: {
        description:
          "달콤한 화이트 초콜릿 소스와 에스프레소, 부드러운 우유가 만나 감미로운 맛을 주는 모카",
        ingredients: [
          { name: "에스프레소 싱글샷", amount: "30ml" },
          { name: "화이트 초콜릿 소스", amount: "30ml" },
          { name: "우유", amount: "180ml" },
          { name: "휘핑크림", amount: "15ml" },
        ],
        steps: [
          "잔에 화이트 초콜릿 소스와 에스프레소를 넣고 잘 섞어줍니다.",
          "데운 우유를 부어줍니다.",
          "휘핑크림을 올려 완성합니다.",
        ],
      },
    },
    {
      name: "콜드브루",
      image: "coldbrew.png",
      recipe: {
        description: "차가운 물에 장시간 우려내 깊고 부드러운 맛을 내는 커피",
        ingredients: [
          { name: "콜드브루 원액", amount: "100ml" },
          { name: "물", amount: "100ml" },
          { name: "얼음", amount: "200g" },
        ],
        steps: [
          "잔에 콜드브루 원액을 넣습니다.",
          "여과수나 생수를 1:1 비율로 부어 섞어줍니다.",
          "얼음을 채워 시원하게 즐깁니다.",
        ],
      },
    },
    {
      name: "바닐라 콜드 브루",
      image: "vanillacoldbrew.png",
      recipe: {
        description:
          "부드러운 바닐라 향이 더해져 깔끔하면서도 달콤하게 즐길 수 있는 콜드브루",
        ingredients: [
          { name: "콜드브루 원액", amount: "100ml" },
          { name: "바닐라 시럽", amount: "30ml" },
          { name: "물", amount: "100ml" },
          { name: "얼음", amount: "200g" },
        ],
        steps: [
          "잔에 콜드브루 원액과 바닐라 시럽을 넣고 잘 섞어줍니다.",
          "여과수나 생수를 1:1 비율로 부어 섞어줍니다.",
          "얼음을 가득 채워 시원하게 즐깁니다.",
        ],
      },
    },
    {
      name: "콜드 브루 쉐이크",
      image: "coldbrewshake.png",
      recipe: {
        description:
          "콜드브루를 쉐이크한 시원한 프라페로 더욱 깊고 진한 맛을 느낄 수 있는 음료",
        ingredients: [
          { name: "콜드브루 원액", amount: "100ml" },
          { name: "우유", amount: "150ml" },
          { name: "바닐라 아이스크림", amount: "100g" },
          { name: "에스프레소 콩 크러쉬", amount: "1 scoop" },
        ],
        steps: [
          "콜드브루 원액, 우유, 바닐라 아이스크림을 블렌더에 넣고 갈아줍니다.",
          "잔에 얼음을 채웁니다.",
          "갈아놓은 재료를 부어줍니다.",
          "에스프레소 콩을 으깨어 크러쉬를 만들어 토핑으로 뿌려 완성합니다.",
        ],
      },
    },
    {
      name: "자바 칩 프라페",
      image: "javachipfrappe.png",
      recipe: {
        description: "달콤한 초콜릿칩이 입안 가득 느껴지는 시원한 프라페",
        ingredients: [
          { name: "에스프레소", amount: "30ml" },
          { name: "초콜릿 칩", amount: "20g" },
          { name: "초코 소스", amount: "30ml" },
          { name: "우유", amount: "200ml" },
          { name: "휘핑크림", amount: "30ml" },
        ],
        steps: [
          "에스프레소를 추출하여 식혀둡니다.",
          "블렌더에 식힌 에스프레소, 초코 소스, 우유, 얼음을 넣고 갈아줍니다.",
          "잔에 갈은 재료를 넣고 휘핑크림을 토핑합니다.",
          "초콜릿 칩을 뿌려 완성합니다.",
        ],
      },
    },
    {
      name: "카라멜 프라페",
      image: "caramelfrappe.png",
      recipe: {
        description:
          "카라멜의 달콤함과 얼음의 시원함이 어우러지는 배리에이션 프라페",
        ingredients: [
          { name: "에스프레소", amount: "30ml" },
          { name: "우유", amount: "180ml" },
          { name: "카라멜 소스", amount: "30ml" },
          { name: "얼음", amount: "200g" },
          { name: "휘핑크림", amount: "30ml" },
        ],
        steps: [
          "에스프레소를 추출하여 식힙니다.",
          "블렌더에 에스프레소, 카라멜 소스, 우유, 얼음을 넣고 갈아줍니다.",
          "잔에 갈은 재료를 부은 뒤 휘핑크림을 올립니다.",
          "카라멜 소스로 드리즐해 완성합니다.",
        ],
      },
    },
    {
      name: "초콜릿 시그니처",
      image: "chocolatesignature.png",
      recipe: {
        description:
          "진한 초콜릿과 부드러운 에스프레소의 조화로 달콤 쌉싸름한 맛을 즐길 수 있는 음료",
        ingredients: [
          { name: "다크초콜릿 소스", amount: "30ml" },
          { name: "에스프레소 더블샷", amount: "30ml" },
          { name: "스팀 밀크", amount: "180ml" },
          { name: "휘핑크림", amount: "30ml" },
          { name: "다크초콜릿 그레이팅", amount: "2g" },
        ],
        steps: [
          "잔 바닥에 다크초콜릿 소스를 넣습니다.",
          "에스프레소를 추출하여 초콜릿 소스와 잘 섞이도록 부어줍니다.",
          "스팀 밀크를 부드럽게 부어 섞어줍니다.",
          "휘핑크림과 다크초콜릿 그레이팅으로 토핑하여 완성합니다.",
        ],
      },
    },
    {
      name: "망고 바나나 스무디",
      image: "mangobanana.png",
      recipe: {
        description: "달콤한 망고와 부드러운 바나나가 블렌딩된 트로피컬 스무디",
        ingredients: [
          { name: "망고", amount: "100g" },
          { name: "바나나", amount: "100g" },
          { name: "우유", amount: "150ml" },
          { name: "플레인 요거트", amount: "100g" },
          { name: "얼음", amount: "200g" },
        ],
        steps: [
          "망고와 바나나의 껍질을 제거하고 깍둑 썰기 합니다.",
          "블렌더에 우유, 요거트, 얼음을 넣고 갈아줍니다.",
          "갈아놓은 재료에 망고, 바나나를 넣고 다시 한번 갈아줍니다.",
          "잔에 담고 장식용 과일로 토핑하여 완성합니다.",
        ],
      },
    },
    {
      name: "베리 블렌드",
      image: "berryblend.png",
      recipe: {
        description:
          "상큼한 여러가지 베리가 블렌딩되어 달콤 상큼한 맛을 즐길 수 있는 스무디",
        ingredients: [
          { name: "냉동 딸기", amount: "100g" },
          { name: "냉동 블루베리", amount: "50g" },
          { name: "냉동 라즈베리", amount: "50g" },
          { name: "바나나", amount: "1개" },
          { name: "우유", amount: "200ml" },
          { name: "플레인 요거트", amount: "100g" },
        ],
        steps: [
          "냉동 베리류의 반은 해동합니다.",
          "블렌더에 해동시킨 베리, 우유, 요거트, 바나나를 넣고 갈아줍니다.",
          "나머지 냉동 베리를 추가로 넣고 살짝만 갈아줍니다.",
          "잔에 담고 생 베리를 올려 장식하면 완성됩니다.",
        ],
      },
    },
    {
      name: "민트 티 블렌드",
      image: "mintteablend.png",
      recipe: {
        description: "상쾌한 민트와 녹차, 카모마일의 조화로운 블렌드 티",
        ingredients: [
          { name: "민트잎", amount: "10g" },
          { name: "녹차", amount: "5g" },
          { name: "카모마일", amount: "5g" },
          { name: "꿀", amount: "10g" },
          { name: "뜨거운 물", amount: "500ml" },
        ],
        steps: [
          "민트잎, 녹차, 카모마일을 티 필터에 넣어줍니다.",
          "90-95°C 정도의 뜨거운 물을 부어줍니다.",
          "3-5분간 우려낸 후 꿀을 넣고 잘 저어줍니다.",
          "따뜻할 때 드시면 좋습니다.",
        ],
      },
    },
    {
      name: "밀크티",
      image: "milktea.png",
      recipe: {
        description:
          "깊고 진한 홍차에 우유와 타피오카 펄로 고소함을 더한 밀크티",
        ingredients: [
          { name: "홍차 티백", amount: "2개" },
          { name: "물", amount: "200ml" },
          { name: "우유", amount: "100ml" },
          { name: "설탕 시럽", amount: "30ml" },
          { name: "달콤한 타피오카 펄", amount: "50g" },
        ],
        steps: [
          "80°C 정도의 물에 홍차 티백을 풀어 3-4분간 우려냅니다.",
          "설탕 시럽과 우유를 넣고 잘 저어줍니다.",
          "얼음을 가득 채운 잔에 우린 차를 따라내고 타피오카 펄을 넣어줍니다.",
          "빨대로 펄과 함께 밀크티를 즐깁니다.",
        ],
      },
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemsPerPage = 9;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative h-full bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm overflow-hidden">
      {/* 메뉴얼 목록 */}
      <div
        className={`h-full flex flex-col transition-transform duration-300 ease-out ${
          selectedItem ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* 헤더 영역 */}
        <div className="h-20 min-h-[5rem] flex items-center justify-between px-8 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Book className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">메뉴얼</h2>
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
          className={`absolute top-20 left-0 w-full p-4 bg-white border-b shadow-sm z-10 transition-all duration-300 ease-in-out transform ${
            isSearchOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
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
                setSearchTerm("");
                setIsSearchOpen(false);
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {currentItems.map((item, index) => (
              <div key={index} className="group">
                <div
                  className="bg-white rounded-xl overflow-hidden cursor-pointer shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative pt-[100%] rounded-2xl overflow-hidden">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors
                    ${
                      currentPage === page
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-500 bg-white shadow hover:shadow-md"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* 레시피 상세 */}
      <div
        className={`absolute top-0 left-full h-full w-full bg-white transform transition-transform duration-300 ease-out ${
          selectedItem ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {selectedItem && (
          <div className="h-full flex flex-col">
            {/* 상단 헤더 영역 */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="relative flex items-center justify-center">
                <button
                  className="absolute left-0 p-2 text-gray-600 hover:text-blue-500 transition-colors"
                  onClick={() => setSelectedItem(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                  <span className="bg-yellow-200">{selectedItem.name}</span>
                </h1>
              </div>
            </div>

            {/* 레시피 컴포넌트 */}
            <RecipeSection
              recipe={selectedItem.recipe}
              imageName={selectedItem.image}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Manual;
