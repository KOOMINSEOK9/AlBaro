import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, ChevronLeft, Clock, MapPin, X, Plus } from 'lucide-react';

const Notice = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readNotices, setReadNotices] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const notices = [
    {
      id: 1,
      title: "긴급 대타 구함 - 강남점",
      date: "2025.02.13",
      time: "오후 2시 - 오후 9시",
      location: "서울 강남구 테헤란로 123",
      content: "금일 오후 근무자 갑작스러운 병가로 대타 구합니다. 바리스타 경력 1년 이상, 동일 프랜차이즈 근무 경험자 우대. 시급 15,000원\n\n필요 인원: 1명\n근무 시간: 오후 2시 - 오후 9시\n업무 내용: 음료 제조, 매장 관리\n연락처: 점장 (010-1234-5678)"
    },
    {
      id: 2,
      title: "2월 신메뉴 출시 및 레시피 교육 안내",
      date: "2025.02.12",
      location: "각 지점 해당",
      content: "2월 밸런타인 시즌 신메뉴 3종이 출시됩니다. 아래 레시피 교육에 필수 참석 부탁드립니다.\n\n신메뉴:\n1. 초콜릿 로즈 라떼\n2. 스트로베리 하트 프라페\n3. 러브레터 티\n\n레시피 교육일시: 2025년 2월 15일 오전 10시\n교육 방식: 온라인 실시간 교육 (링크는 당일 공지)\n\n* 모든 매장은 15일부터 판매 시작해주시기 바랍니다."
    },
    {
      id: 3,
      title: "월간 위생 점검 일정 안내",
      date: "2025.02.11",
      content: "2월 정기 위생 점검이 진행됩니다. 아래 체크리스트를 참고하여 사전 점검 부탁드립니다.\n\n점검 항목:\n1. 매장 청결도\n2. 식자재 보관 상태\n3. 직원 위생 상태\n4. 시설물 관리 상태\n\n* 상세 체크리스트는 매뉴얼 7장을 참고해주세요.\n* 지점별 점검 일정은 추후 개별 공지 예정입니다."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({
      title: '',
      content: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [isAnimating]);

  const openNotice = (notice) => {
    setIsAnimating(true);
    setSelectedNotice(notice);
    setReadNotices(prev => new Set([...prev, notice.id]));
  };

  const closeNotice = () => {
    setIsAnimating(false);
    setSelectedNotice(null);
  };

  return (
    <div className="relative h-full bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm overflow-hidden">
      {/* 공지사항 목록 */}
      <div className={`h-full transition-transform duration-300 ease-out ${selectedNotice || showForm ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className="p-4 bg-white border-b shadow-sm h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold">
              공지사항
            </h2>
          </div>
          <button
            className="p-2 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="group relative p-4 cursor-pointer transition-transform duration-300 bg-white hover:shadow-lg rounded-xl border border-gray-200 transform hover:-translate-y-1"
              onClick={() => openNotice(notice)}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className={`text-base font-bold truncate ${readNotices.has(notice.id) ? 'text-gray-500' : 'text-gray-800'}`}>
                    {notice.title}
                  </h3>
                  <span className="text-sm text-gray-400">{notice.date}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {notice.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 공지사항 상세 */}
      <div
        className={`absolute top-0 left-full h-full w-full bg-white transform transition-transform duration-300 ease-out ${selectedNotice ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {selectedNotice && (
          <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
            <div className="px-4 py-4 border-b bg-white shadow-sm">
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 mb-4 transition-colors group"
                onClick={closeNotice}
              >
                <ChevronLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">목록으로</span>
              </button>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedNotice.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedNotice.time || selectedNotice.date}</span>
                  </div>
                  {selectedNotice.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedNotice.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 bg-white m-4 rounded-xl shadow-sm">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedNotice.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 공지사항 작성 폼 */}
      <div
        className={`absolute top-0 left-full h-full w-full bg-gradient-to-br from-white to-gray-50 transform transition-transform duration-300 ease-out ${showForm ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {showForm && (
          <div className="h-full flex flex-col">
            <div className="px-4 py-4 border-b bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group"
                  onClick={() => setShowForm(false)}
                >
                  <ChevronLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">목록으로</span>
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 transform hover:rotate-90 transition-transform"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">새 공지사항 작성</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="공지사항 제목을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      내용
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="공지사항 내용을 입력하세요"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    등록
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;