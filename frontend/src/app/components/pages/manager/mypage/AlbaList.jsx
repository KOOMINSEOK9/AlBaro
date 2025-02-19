"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import Image from "next/image";

export default function AlbaList({ albaList }) {
  //   const [albaList] = useState([
  //     { id: 1, name: "박보영", hourlyWage: 10000, image: "/boyoung.jpg" },
  //     { id: 2, name: "이지은", hourlyWage: 10000, image: "/iu.jpg" },
  //     { id: 3, name: "권지용", hourlyWage: 10000, image: "/gd.jpg" },
  //   ]);

  //   const [albaList, setAlbaList] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % albaList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + albaList.length) % albaList.length);
  };

  // 스와이프 기능
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  // 마우스 드래그 기능
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;

    const distance = startX - e.pageX;
    const minSwipeDistance = 50;

    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseUpOutside = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUpOutside);
    return () => {
      window.removeEventListener("mouseup", handleMouseUpOutside);
    };
  }, []);

  return (
    <div className="h-[230px] lg:h-full bg-white rounded-lg shadow-md">
      <div className="mb-4 px-3 pt-3">
        <h3 className="text-[15px] font-medium text-gray-700 flex items-center">
          <Users className="w-5 h-5 text-gray-500 mr-2" />
          우리 지점 알바생 리스트
          <span className="ml-2 text-sm text-gray-400 font-normal">
            {albaList.length}명
          </span>
        </h3>
      </div>

      {/* Desktop & Mobile Carousel */}
      <div className="relative h-[calc(100%-4rem)]">
        <div
          ref={carouselRef}
          className="flex items-center justify-center h-full px-10 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative w-full h-32">
            {albaList.map((alba, index) => {
              const isActive = index === currentIndex;
              const isPrev =
                index ===
                (currentIndex - 1 + albaList.length) % albaList.length;
              const isNext = index === (currentIndex + 1) % albaList.length;

              if (!isActive && !isPrev && !isNext) return null;

              return (
                <div
                  key={index}
                  className={`absolute top-0 w-32 cursor-grab active:cursor-grabbing`}
                  style={{
                    transform: `translate(${
                      isActive
                        ? "-50%, 0"
                        : isPrev
                        ? "calc(-125% - 2rem), 0"
                        : "calc(25% + 2rem), 0"
                    }) scale(${isActive ? 1 : 0.95})`,
                    left: "50%",
                    opacity: isActive ? 1 : 0.8,
                    transition: isDragging
                      ? "none"
                      : "all 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                    zIndex: isActive ? 20 : 10,
                    willChange: "transform, opacity",
                  }}
                >
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-xl overflow-hidden shadow-sm relative">
                      <Image
                        src={alba.filePath}
                        alt={alba.userName}
                        fill
                        className="object-cover"
                        draggable="false"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3
                                                lg:bg-black lg:bg-opacity-50 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300`}
                      >
                        <p className="text-white font-medium text-sm text-center">
                          {alba.userName}
                        </p>
                        <p className="text-white/80 text-xs text-center">
                          시급 10,030원
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label="이전"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            aria-label="다음"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
            {albaList.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-500 w-3" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
