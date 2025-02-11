'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 토큰 관리를 위한 유틸리티 함수들
const tokenUtils = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
};

// axios 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신을 위한 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenUtils.getRefreshToken();
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        });

        const { accessToken } = response.data;
        tokenUtils.setTokens(accessToken, refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenUtils.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default function Login() {
  const router = useRouter();
  const [focused, setFocused] = useState({
    username: false,
    password: false
  });
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const accessToken = tokenUtils.getAccessToken();
    if (accessToken) {
      router.push('/main');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', credentials);
      const { accessToken, refreshToken } = response.data;

      tokenUtils.setTokens(accessToken, refreshToken);
      router.push('/main');
    } catch (err) {
      const errorMessage = err.response?.data?.message || '사원번호 또는 비밀번호가 올바르지 않습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold mb-12 text-center">Albaro</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <div className="relative mb-6">
                <div className="absolute left-0 top-[45%] -translate-y-1/2">
                  <Image
                    src="/id.jpg"
                    alt="ID Icon"
                    width={24}
                    height={24}
                    className="opacity-70"
                  />
                </div>
                <input
                  type="text"
                  className="w-full pb-2 pl-8 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                  style={{
                    borderColor: error ? '#ef4444' : ''
                  }}
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  onFocus={() => setFocused(prev => ({ ...prev, username: true }))}
                  onBlur={() => {
                    if (!credentials.username) {
                      setFocused(prev => ({ ...prev, username: false }))
                    }
                  }}
                  disabled={isLoading}
                />
                <span
                  className={`absolute left-0 transition-all duration-300 ${focused.username || credentials.username
                    ? '-top-5 text-[0.60rem] text-gray-600'
                    : 'top-[45%] -translate-y-1/2 left-8 text-sm text-gray-400'
                    }`}
                >
                  사원번호
                </span>
              </div>

              <div className="relative mb-6">
                <div className="absolute left-0 top-[45%] -translate-y-1/2">
                  <Image
                    src="/password.jpg"
                    alt="Password Icon"
                    width={24}
                    height={24}
                    className="opacity-70"
                  />
                </div>
                <input
                  type="password"
                  className="w-full pb-2 pl-8 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                  style={{
                    borderColor: error ? '#ef4444' : ''
                  }}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  onFocus={() => setFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => {
                    if (!credentials.password) {
                      setFocused(prev => ({ ...prev, password: false }))
                    }
                  }}
                  disabled={isLoading}
                />
                <span
                  className={`absolute left-0 transition-all duration-300 ${focused.password || credentials.password
                    ? '-top-5 text-[0.60rem] text-gray-600'
                    : 'top-[45%] -translate-y-1/2 left-8 text-sm text-gray-400'
                    }`}
                >
                  비밀번호
                </span>
                {error && (
                  <div className="absolute text-xs text-red-500 mt-1">
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 mt-2 text-white bg-black hover:bg-gray-800 transition-colors rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <div className="fixed w-[50vw] h-screen">
          <Image
            src="/cafe.avif"
            alt="Coffee"
            fill
            className="object-fit"
            style={{ objectPosition: 'center' }}
            priority
            sizes="50vw"
          />
        </div>
      </div>
    </div>
  );
}
