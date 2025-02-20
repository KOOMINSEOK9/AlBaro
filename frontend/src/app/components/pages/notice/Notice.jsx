import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft, Clock, X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const Notice = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readNotices, setReadNotices] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({
    notificationTitle: '',
    notificationContent: ''
  });

  // API 기본 설정
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // access 토큰에서 storeId 추출하는 함수
  const getStoreIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).storeId;
  };

  // 공지사항 목록 조회
  const fetchNotices = async () => {
    try {
      const storeId = getStoreIdFromToken();
      if (!storeId) throw new Error('Invalid access token');

      const response = await api.get(`/notifications/store/${storeId}`);
      setNotices(response.data.map(notice => ({
        id: notice.notificationId,
        title: notice.notificationTitle,
        content: notice.notificationContent,
        date: new Date(notice.createdTime).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '.').slice(0, -1)
      })));
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
    }
  };

  // 공지사항 상세 조회
  const fetchNoticeDetail = async (id) => {
    try {
      const response = await api.get(`/notifications/${id}`);
      const notice = response.data;
      setSelectedNotice({
        id: notice.notificationId,
        title: notice.notificationTitle,
        content: notice.notificationContent,
        date: new Date(notice.createdTime).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '.').slice(0, -1)
      });
    } catch (error) {
      console.error('공지사항 상세 조회 실패:', error);
    }
  };

  // 공지사항 작성
  const createNotice = async () => {
    try {
      const storeId = getStoreIdFromToken();
      if (!storeId) throw new Error('Invalid access token');

      const userId = getStoreIdFromToken();
      await api.post(`/notifications/${userId}`, formData);

      await fetchNotices();
      setShowForm(false);
      setFormData({
        notificationTitle: '',
        notificationContent: ''
      });
    } catch (error) {
      console.error('공지사항 작성 실패:', error);
    }
  };

  // 공지사항 삭제 
  const deleteNotice = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      await fetchNotices();
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [isAnimating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNotice();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openNotice = async (notice) => {
    setIsAnimating(true);
    await fetchNoticeDetail(notice.id);
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
              className="relative rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* 컨텐츠 영역 */}
              <div className="relative group overflow-hidden rounded-2xl">
                {/* 메인 컨텐츠 */}
                <div
                  className="p-5 cursor-pointer bg-white transform transition-all duration-300 ease-out group-hover:-translate-x-16 group-hover:pl-8"
                  onClick={() => openNotice(notice)}
                >
                  <div className="flex flex-col space-y-2.5">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-base font-semibold truncate ${readNotices.has(notice.id) ? 'text-gray-500' : 'text-gray-800'} transition-colors duration-200`}>
                        {notice.title}
                      </h3>
                      <span className="text-sm text-gray-400 font-medium">{notice.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                      {notice.content}
                    </p>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <div className="absolute right-0 top-0 h-full w-16 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-out">
                  <button
                    type="button"
                    className="h-full w-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 hover:shadow-lg active:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 삭제 전 애니메이션 
                      const element = e.currentTarget.closest('.relative.rounded-2xl');
                      element.style.transform = 'translateX(-100%)';
                      element.style.opacity = '0';
                      element.style.transition = 'all 0.3s ease-out';

                      // 애니메이션 완료 후 실제 삭제
                      setTimeout(() => {
                        deleteNotice(notice.id);
                      }, 300);
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-white transform transition-transform duration-200 group-hover:scale-110" />
                  </button>
                </div>
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
                    <span>{selectedNotice.date}</span>
                  </div>
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
                      name="notificationTitle"
                      value={formData.notificationTitle}
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
                      name="notificationContent"
                      value={formData.notificationContent}
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