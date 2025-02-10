'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Login() {
  const [focused, setFocused] = useState({
    username: false,
    password: false
  });
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', credentials);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold mb-12 text-center">Albaro</h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-0 top-1/3 -translate-y-1/2">
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
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  onFocus={() => setFocused(prev => ({ ...prev, username: true }))}
                  onBlur={() => {
                    if (!credentials.username) {
                      setFocused(prev => ({ ...prev, username: false }))
                    }
                  }}
                />
                <span
                  className={`absolute left-0 transition-all duration-300 ${focused.username || credentials.username
                    ? '-top-5 text-[0.60rem] text-gray-600'
                    : 'top-1/3 -translate-y-1/2 left-8 text-sm text-gray-400'
                    }`}
                >
                  사원번호
                </span>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-1/3 -translate-y-1/2">
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
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  onFocus={() => setFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => {
                    if (!credentials.password) {
                      setFocused(prev => ({ ...prev, password: false }))
                    }
                  }}
                />
                <span
                  className={`absolute left-0 transition-all duration-300 ${focused.password || credentials.password
                    ? '-top-5 text-[0.60rem] text-gray-600'
                    : 'top-1/3 -translate-y-1/2 left-8 text-sm text-gray-400'
                    }`}
                >
                  비밀번호
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-12 text-white bg-black hover:bg-gray-800 transition-colors rounded-md"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-1/2 relative">
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