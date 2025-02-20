"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import timeGridPlugin from "@fullcalendar/timegrid";
import "react-datepicker/dist/react-datepicker.css";
import QrScanner from "qr-scanner"; // 라이브러리 import

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Image from "next/image";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AlbaListModal from "../part-timer/AlbaListModal";
import DatePicker from "react-datepicker";
import AlbaCard from "../part-timer/AlbaCard";
import "./Calendar.css";
import { QrCode, UserRoundSearch, Calendar, Clock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// FullCalendar는 클라이언트에서만 렌더링되므로 dynamic import 사용
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

const MyCalendar = () => {
  // 공통 스타일 정의
  const commonButtonStyle = "bg-[#F05A7E] hover:bg-[#d44d6d] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:shadow-sm px-6 py-3 flex items-center gap-2 font-semibold text-base transform hover:-translate-y-0.5 active:translate-y-0";
  const modalButtonStyle = "bg-[#1b3160] hover:bg-[#233d78] text-white px-4 py-2 rounded-lg transition-colors";
  const modalCloseButtonStyle = "absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors";
  const inputStyle = "border-b-2 text-center focus:border-[#14213d] focus:outline-none";



  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState(null);
  const [canDetaAlbatoAlba, setcanDetaAlbatoAlba] = useState({
    internalWorkers: [],
    externalWorkers: [],
  });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [workDate, setWorkDate] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loginUserAccountId, setLoginUserAccountId] = useState(null);
  const [loginUserUserId, setLoginUserUserId] = useState(null);
  const [loginUserStoreId, setLoginUserStoreId] = useState(null);
  const [loginUserRole, setLoginUserRole] = useState(null);
  // const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isFaceRecognitionOpen, setIsFaceRecognitionOpen] = useState(false);
  // const [qrCode, setQrCode] = useState("");
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  // JWT 토큰 처리
  useEffect(() => {
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      if (token) {
        const decoded = jwtDecode(token);
        setLoginUserUserId(decoded.userId);
        setLoginUserAccountId(decoded.accountId);
        setLoginUserStoreId(decoded.storeId);
        setLoginUserRole(decoded.role);
      }
    }
  }, []);

  // 근무 정보 조회
  useEffect(() => {
    if (loginUserStoreId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/work-information/${loginUserStoreId}`)
        .then((response) => {
          const updatedWorkSchedule = response.data.map((event) => {
            let backgroundColor = '';
            let textColor = '';
            let displayName = event.userName;
            let borderColor = 'transparent';  // 기본적으로 테두리 없음

            if (event.vacant || event.accountId !== event.realTimeWorker) {
              backgroundColor = '#FFFFFF';
              textColor = '#64748B';       // 공석만 회색 텍스트
              borderColor = '#E2E8F0';     // 공석 테두리
              displayName = event.vacant ? "공석" : event.userName.split(' ')[0];
            }
            // 2. 출근 예정
            else if (new Date(`${event.workDate}T${event.startTime}`) > new Date()) {
              backgroundColor = '#60A5FA';  // 블루
              textColor = '#FFFFFF';       // 흰색으로 변경
              displayName = event.userName.split(' ')[0];
            }
            // 3. 결근 + 지각
            else if (!event.checkInTime || event.checkInTime > event.startTime) {
              backgroundColor = '#F43F5E';  // 레드
              textColor = '#FFFFFF';       // 흰색으로 변경
              displayName = event.userName.split(' ')[0];
            }
            // 4. 출근 중
            else if (event.checkInTime && !event.checkOutTime) {
              backgroundColor = '#34D399';  // 그린
              textColor = '#FFFFFF';       // 흰색으로 변경
              displayName = event.userName.split(' ')[0];
            }
            // 5. 퇴근 완료
            else if (event.checkInTime && event.checkOutTime) {
              backgroundColor = '#9CA3AF';  // 그레이
              textColor = '#FFFFFF';       // 흰색으로 변경
              displayName = event.userName.split(' ')[0];
            }

            return {
              title: displayName,
              start: `${event.workDate}T${event.startTime}`,
              end: `${event.workDate}T${event.endTime}`,
              backgroundColor: backgroundColor,
              textColor: textColor,
              borderColor: borderColor,  // 테두리 색상 적용
              classNames: [
                'text-center',
                'font-medium',
                'transition-all',
                'hover:bg-opacity-90',
                'hover:shadow-md',
                'rounded-lg',
                'duration-200',
                'hover:shadow-lg',
                'hover:scale-[1.02]',
                'border',
                'border-[2px]',
                'hover:border-gray-200',
                'w-[calc(100%+8px)]',
                'mx-[-4px]',
              ],
              extendedProps: {
                accountId: event.accountId,
                scheduleId: event.scheduleId,
                userId: event.userId,
                isVacant: event.vacant,
                checkInTime: event.checkInTime,
                checkOutTime: event.checkOutTime,
                realTimeWorker: event.realTimeWorker,
                workDate: new Date(event.workDate),
              },
            };
          });

          setEvents(updatedWorkSchedule);
        })
        .catch((err) => {
          console.log("axios err: ", err);
        });
    }
  }, [loginUserStoreId]);

  // 대타 구하기 관련 함수들
  const gotoDeta = (info) => {
    const workDate = new Date(info.event.extendedProps.workDate.getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const startTime = new Date(info.event.start.getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(11, 16);
    const endTime = new Date(info.event.end.getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(11, 16);

    if (confirm(`${workDate} ${startTime} ~ ${endTime} 근무 대타를 구하시겠습니까?`)) {
      router.push(
        `/map?scheduleId=${info.event.extendedProps.scheduleId}&date=${info.event.extendedProps.workDate}&start=${info.event.start}&end=${info.event.end}`
      );
    }
  };

  const handleEventHover = (selectInfo) => {
    if (loginUserRole === "staff" &&
      selectInfo.event.extendedProps.realTimeWorker !== loginUserAccountId) {
      return;
    }

    const eventEl = selectInfo.el;
    let existingOverlay = eventEl.querySelector(".event-overlay");
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const overlay = document.createElement("div");
    overlay.className = "event-overlay absolute inset-0 bg-black/80 flex items-center justify-center";

    const button = document.createElement("button");
    button.className = "z-10 bg-white hover:bg-gray-100 text-[#1E2A3B] px-4 py-2 rounded-lg transition-colors";

    if (loginUserRole === "manager" && !selectInfo.event.extendedProps.isVacant) {
      button.innerText = "공석 만들기";
    } else {
      button.innerText = "대타 구하기";
    }

    button.addEventListener("click", () => {
      if (loginUserRole === "manager") {
        if (selectInfo.event.extendedProps.isVacant) {
          gotoDeta(selectInfo);
        } else {
          if (confirm("해당 근무를 공석으로 변경하시겠습니까?")) {
            axios
              .patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/work-information/${selectInfo.event.extendedProps.scheduleId}/vacant`
              )
              .then(() => {
                alert("해당 근무를 공석 처리했습니다.");
                location.reload(true);
              })
              .catch((err) => {
                alert("오류가 발생했습니다. 다시 시도해주세요.");
                console.log(err);
              });
          }
        }
      } else {
        // 알바생 -> 알바생 대타 구하기 로직
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/substitute/my-schedule`, {
            params: { userId: loginUserUserId },
          })
          .then((res) => {
            setcanDetaAlbatoAlba(res.data);

            if (selectInfo.event.extendedProps.isVacant) {
              const workDate = new Date(
                selectInfo.event.extendedProps.workDate.getTime() + 9 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0];

              const startTime = new Date(
                selectInfo.event.start.getTime() + 9 * 60 * 60 * 1000
              )
                .toISOString()
                .slice(11, 16);
              const endTime = new Date(
                selectInfo.event.end.getTime() + 9 * 60 * 60 * 1000
              )
                .toISOString()
                .slice(11, 16);

              if (confirm(
                `${workDate} ${startTime} ~ ${endTime} 근무 대타를 구하시겠습니까?`
              )) {
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/request`,
                    null,
                    {
                      params: {
                        senderId: loginUserUserId,
                        storeId: loginUserStoreId,
                        workDate: workDate,
                        startTime: startTime,
                        endTime: endTime,
                      },
                    }
                  )
                  .then(() => {
                    alert("대타 요청을 완료했습니다.");
                  })
                  .catch((err) => {
                    console.log("대타 요청 보내기 에러: ", err);
                  });
              }
            } else {
              setIsModalOpen(true);
              setEventInfo(selectInfo);
            }
          })
          .catch((err) => {
            console.log("알바->알바 axios err: ", err);
          });
      }
    });

    overlay.appendChild(button);
    eventEl.appendChild(overlay);

    eventEl.onmouseleave = () => {
      setTimeout(() => {
        overlay.remove();
      }, 100);
    };
  };

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    const filteredEvents = events.filter(
      (event) => event.workDate === selectedDate
    );
    selectInfo.view.calendar.changeView("timeGridDay", selectInfo.startStr);
  };

  // 모달 관련 함수들
  const closeModal = () => {
    setIsModalOpen(false);
    setEventInfo(null);
  };

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const openQRModal = () => {
    setIsQRModalOpen(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/generate`, {
        userId: loginUserUserId, // body로 userId를 직접 보냅니다
      })
      .then((res) => {
        // console.log(res);
        setQrCode(`data:image/png;base64,${res.data.qrCode}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const openFaceRecognition = () => {
    setIsFaceRecognitionOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById("video");
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const closeFaceRecognition = () => {
    setIsFaceRecognitionOpen(false);
    const video = document.getElementById("video");
    if (video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const captureQR = async () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    // 비디오 크기를 캔버스에 맞게 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오에서 이미지 캡처
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    console.log(
      "context.drawImage",
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
    );

    // 캔버스의 이미지를 Blob으로 변환
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Blob 변환 실패");
        return;
      }

      console.log("🔍 캡처된 Blob 데이터:", blob); // 디버깅용 로그 추가

      try {
        // QR 코드 디코딩 시도
        console.log("🔍 QR 코드 스캔 시작");
        const result = await QrScanner.scanImage(blob, {
          returnDetailedScanResult: true,
        });

        console.log("🔍 QR 코드 스캔 결과:", result);

        if (result && result.data) {
          console.log("✅ QR 코드 스캔 성공:", result.data);

          // 서버로 QR 코드 데이터 전송
          axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/verify`, {
              token: result.data, // QR 코드에서 추출한 token 값
              storeId: loginUserStoreId,
            })
            .then((response) => {
              console.log("✅ QR 인증 성공:", response.data);
              alert("정상적으로 본인 인증 되었습니다.");
              setIsFaceRecognitionOpen(false);
              location.reload(true);
            })
            .catch((error) => {
              console.error("❌ QR 인증 실패:", error);
              alert("오류가 발생했습니다. 다시 시도해주세요.");
              setIsFaceRecognitionOpen(false);
              location.reload(true);
            });
        } else {
          console.error("❌ QR 코드에서 데이터를 추출하지 못함");
        }
      } catch (error) {
        console.error("❌ QR 코드 스캔 오류:", error);
      }
    }, "image/png");
  };

  const captureImage = () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      try {
        const result = await QrScanner.scanImage(blob, {
          returnDetailedScanResult: true,
        });

        if (result && result.data) {
          console.log("QR 코드 스캔 성공:", result.data);

          axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/verify`, {
              token: result.data,
              storeId: loginUserStoreId,
            })
            .then((response) => {
              console.log("QR 인증 성공:", response.data);
              alert("QR 인증이 완료되었습니다.");
              closeFaceRecognition();
            })
            .catch((error) => {
              console.error("QR 인증 실패:", error);
              alert("QR 인증에 실패했습니다. 다시 시도해주세요.");
            });
        } else {
          console.error("QR 코드에서 데이터를 추출하지 못함");
          alert("QR 코드를 인식할 수 없습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("QR 코드 스캔 오류:", error);
        alert("QR 코드 스캔 중 오류가 발생했습니다.");
      }
    }, "image/png");
  };

  const handleDatesSet = (arg) => {
    setCurrentDate(arg.view.currentStart);
  };

  useEffect(() => {
    if (!loginUserUserId) return;

    // WebSocket 연결
    // const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications/${loginUserUserId}`);
    const ws = new WebSocket(`wss://i12b105.p.ssafy.io/ws/notifications/${loginUserUserId}`);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);

      // 알림 종류에 따라 다른 스타일 적용
      switch (notification.type) {
        case 'SUBSTITUTE_REQUEST':
          toast.info('새로운 대타 요청이 있습니다!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          break;
        case 'SCHEDULE_CHANGE':
          toast.success('근무 일정이 변경되었습니다.', {
            position: "top-right",
            autoClose: 5000,
          });
          break;
        case 'ATTENDANCE':
          toast.warning('출근 시간이 임박했습니다!', {
            position: "top-right",
            autoClose: 5000,
          });
          break;
        default:
          toast(notification.message);
      }
    };

    return () => {
      ws.close();
    };
  }, [loginUserUserId]);

  return (
    <div className="App h-full">
      <ToastContainer />
      <div className="flex justify-between items-center mb-1.5">
        <h1 className="text-4xl font-bold text-[#1E2A3B] store-title">MEGASSAFY 강남R점</h1>
        <div className="flex gap-3 -mt-4">
          <Link href="/map" className="bg-white hover:bg-[#FF6B6B] text-[#FF6B6B] hover:text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:shadow-sm px-6 py-3 flex items-center gap-2 font-semibold text-base transform hover:-translate-y-0.5 active:translate-y-0">
            <UserRoundSearch className="w-5 h-5" />
            대타 찾기
          </Link>
          <button
            onClick={() => {
              if (loginUserRole === "staff") {
                openQRModal();
              }
              if (loginUserRole === "manager") {
                openFaceRecognition();
              }
            }}
            className="bg-white hover:bg-[#3867E2] text-[#3867E2] hover:text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:shadow-sm px-6 py-3 flex items-center gap-2 font-semibold text-base transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <QrCode className="w-5 h-5" />
            출석체크
          </button>
        </div>
      </div>

      <div className="mb-0.5">
        <div className="calendar-title">
          <div className="digit-container">{currentDate.getFullYear().toString()[0]}</div>
          <div className="digit-container">{currentDate.getFullYear().toString()[1]}</div>
          <div className="digit-container">{currentDate.getFullYear().toString()[2]}</div>
          <div className="digit-container">{currentDate.getFullYear().toString()[3]}</div>
          <span className="separator">.</span>
          <div className="digit-container">{(currentDate.getMonth() + 1).toString().padStart(2, '0')[0]}</div>
          <div className="digit-container">{(currentDate.getMonth() + 1).toString().padStart(2, '0')[1]}</div>
        </div>
      </div>

      <div className="relative">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          contentHeight="395px"
          fixedWeekCount={false}
          dayMaxEventRows={3}
          headerToolbar={{
            start: '',
            right: "timeGridDay,dayGridMonth prev,next",
          }}
          datesSet={handleDatesSet}
          selectable={true}
          select={handleDateSelect}
          events={events}
          eventDisplay="block"
          eventContent={(info) => (
            <div className="text-black">{info.event.title}</div>
          )}
          slotEventOverlap={false}
          views={{
            dayGridMonth: {
              dayMaxEvents: 3,
              dayCellHeight: 75,
              dayCellContent: (arg) => {
                // 오늘 날짜 가져오기
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // 해당 날짜가 오늘 이후인 경우에만 공석 체크
                if (arg.date >= today) {
                  // 해당 날짜에 공석이 있는지 확인
                  const hasVacant = events.some(event => {
                    const eventDate = new Date(event.start);
                    return event.extendedProps.isVacant &&
                      eventDate.toDateString() === arg.date.toDateString();
                  });

                  return (
                    <div className="relative">
                      {arg.dayNumberText.replace('일', '')}
                      {hasVacant && (
                        <span className="absolute top-1.5 right-4 text-lg animate-fadeIn">
                          ★
                        </span>
                      )}
                    </div>
                  );
                }

                return arg.dayNumberText.replace('일', '');
              }
            },
            timeGridDay: {
              allDaySlot: false,
              nowIndicator: false,
              slotMinTime: "09:00:00",
              slotMaxTime: "24:00:00",
              slotDuration: "01:00:00",
              height: 'auto',
              dayHeaderFormat: { weekday: 'long' },
              eventMouseEnter: handleEventHover
            }
          }}
          moreLinkContent={(args) => `+${args.num} more`}
        />

        <div className="absolute bottom-[-2rem] right-[-0.5rem] flex items-center justify-end gap-2 px-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-[#E2E8F0] bg-white"></div>
            <span className="text-gray-600">공석</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#F43F5E]"></div>
            <span className="text-gray-600">결근/지각</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#60A5FA]"></div>
            <span className="text-gray-600">출근 예정</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#34D399]"></div>
            <span className="text-gray-600">출근 중</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#9CA3AF]"></div>
            <span className="text-gray-600">퇴근</span>
          </div>
        </div>
      </div>

      {/* 알바 리스트 모달 */}
      {isModalOpen && eventInfo && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              ×
            </button>

            {/* 날짜/시간 섹션 */}
            <div className="flex items-center gap-8 mb-6">
              {/* 날짜 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1E2A3B]" />
                <span className="text-lg font-medium">
                  {new Date(eventInfo.event.extendedProps.workDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\. /g, '-').replace('.', '')}
                </span>
              </div>

              {/* 시간 */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1E2A3B]" />
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {new Date(eventInfo.event.start).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-lg font-medium">
                    {new Date(eventInfo.event.end).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3B] mb-3">
                  우리 지점 대타 가능 알바생
                </h3>
                {canDetaAlbatoAlba.internalWorkers.length > 0 ? (
                  <AlbaCard
                    albas={canDetaAlbatoAlba.internalWorkers}
                    selectedDate={eventInfo.event.extendedProps.workDate}
                    startTime={eventInfo.event.start}
                    endTime={eventInfo.event.end}
                  />
                ) : (
                  <p className="text-gray-500">해당 시간대에 대타 가능한 알바생이 없어요:(</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3B] mb-3">
                  타지점 대타 가능 알바생
                </h3>
                {canDetaAlbatoAlba.externalWorkers.length > 0 ? (
                  <AlbaCard
                    albas={canDetaAlbatoAlba.externalWorkers}
                    selectedDate={eventInfo.event.extendedProps.workDate}
                    startTime={eventInfo.event.start}
                    endTime={eventInfo.event.end}
                  />
                ) : (
                  <p className="text-gray-500">해당 시간대에 대타 가능한 알바생이 없어요:(</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR 모달 */}
      {isQRModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button onClick={() => setIsQRModalOpen(false)} className={modalCloseButtonStyle}>×</button>
            <div className="flex justify-center items-center mt-4">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
              ) : (
                <p className="text-gray-500">QR 코드 생성 중...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 얼굴 인식 모달 */}
      {isFaceRecognitionOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-3/5 relative">
            <button
              onClick={closeFaceRecognition}
              className={modalCloseButtonStyle}
            >
              ×
            </button>
            <h1 className="text-center text-xl font-bold mb-4">
              {/* Face Recognition */}
              출석 체크
            </h1>
            <div className="relative">
              <video
                id="video"
                width="100%"
                height="auto"
                autoPlay
                className="mb-4"
              ></video>
              {/* 얼굴 인식을 위한 SVG 실루엣 추가 */}
              {/* <svg
                className="absolute inset-0 flex items-center justify-center"
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
              >
                <rect
                  x="10"
                  y="10"
                  width="80"
                  height="80"
                  fill="none"
                  stroke="#1E2A3B"
                  strokeWidth="4"
                  strokeDasharray="5,5"
                />
              </svg> */}
              <svg
                className="absolute inset-0 flex items-center justify-center"
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
              >
                <rect
                  x="10"
                  y="10"
                  width="80"
                  height="80"
                  fill="none"
                  stroke="#00BFFF"
                  strokeWidth="4"
                  strokeDasharray="5,5"
                />

                {/* <rect x="15" y="15" width="15" height="15" fill="#00BFFF" />
                <rect x="70" y="15" width="15" height="15" fill="#00BFFF" />
                <rect x="15" y="70" width="15" height="15" fill="#00BFFF" /> */}
              </svg>
            </div>
            <div className="flex justify-center mt-4">
              <button
                // onClick={captureImage}
                onClick={captureQR}
                className="bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Capture
              </button>
            </div>
            <canvas
              id="canvas"
              width="640"
              height="480"
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;