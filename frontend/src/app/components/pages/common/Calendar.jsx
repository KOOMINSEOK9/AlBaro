"use client"; // 클라이언트에서만 렌더링

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

// FullCalendar는 클라이언트에서만 렌더링되므로 dynamic import 사용
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AlbaListModal from "../part-timer/AlbaListModal";
import DatePicker from "react-datepicker";
import AlbaCard from "../part-timer/AlbaCard";

import "./Calendar.css";

const MyCalendar = () => {
  const router = useRouter(); // Next.js Router 사용
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

  useEffect(() => {
    // 환경 변수 확인
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

    // 클라이언트 사이드에서만 실행되도록
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);

      const decoded = jwtDecode(token);

      setLoginUserUserId(decoded.userId);
      setLoginUserAccountId(decoded.accountId);
      setLoginUserStoreId(decoded.storeId);
      setLoginUserRole(decoded.role);
    }
  }, []);

  // const loginUserId = 374851;
  // const userId = 1;
  // const storeId = 1;
  // const role = "staff";

  const [isFaceRecognitionOpen, setIsFaceRecognitionOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    if (loginUserStoreId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/work-information/${loginUserStoreId}`
        )
        // .get(`http://localhost:8080/api/work-information/${loginUserStoreId}`)
        .then((response) => {
          // console.log(response);

          // 새 배열을 생성해서 반환값을 담기
          const updatedWorkSchedule = response.data.map((event) => {
            // console.log(event);

            // 공석 혹은 대타면 흰 배경
            if (event.vacant || event.accountId !== event.realTimeWorker) {
              event.color = "#FFFFFF";
              event.borderColor = "#888";
              if (event.vacant) {
                event.userName = "공석";
              }
            }
            // 아직 근무 전
            else if (
              new Date(`${event.workDate}T${event.startTime}`) > new Date()
            ) {
              event.color = "#E8E8E8";
              event.borderColor = "#E8E8E8";
            }
            // 지각 혹은 조퇴면 빨간색
            else if (
              !event.checkInTime ||
              event.checkInTime > event.startTime ||
              event.checkOutTime < event.endTime
            ) {
              event.color = "#FFD9D9";
              event.borderColor = "#FFD9D9";
            }
            // 현재 근무 중이면 파란색
            else if (
              new Date(`${event.workDate}T${event.startTime}`) < new Date() &&
              new Date(`${event.workDate}T${event.endTime}`) > new Date() &&
              event.checkInTime &&
              new Date(`${event.workDate}T${event.checkInTime}`) <
                new Date(`${event.workDate}T${event.startTime}`)
            ) {
              event.color = "#C5EFFF";
              event.borderColor = "#C5EFFF";
            }
            // 디폴트 초록색(정상 출근)
            else {
              // console.log(
              //   event.userName,
              //   " ",
              //   new Date(`${event.workDate}T${event.startTime}`)
              // );

              event.color = "#DEFFD9";
              event.borderColor = "#DEFFD9";
            }

            return {
              title: event.userName, // userName을 title로 설정
              start: `${event.workDate}T${event.startTime}`,
              end: `${event.workDate}T${event.endTime}`,
              backgroundColor: event.color,
              borderColor: event.borderColor,
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

          // setEvents에 새로운 배열 전달
          setEvents(updatedWorkSchedule);
        })
        .catch((err) => {
          console.log("axios err: ", err);
        });
    }
  }, [loginUserStoreId]);

  // 점장 -> 알바 대타구하기(지도 페이지)
  const gotoDeta = (info) => {
    // console.log(info);

    const workDate = new Date(
      new Date(info.event.extendedProps.workDate).getTime() + 9 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const startTime = new Date(
      new Date(info.event.start).getTime() + 9 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(11, 16);
    const endTime = new Date(
      new Date(info.event.end).getTime() + 9 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(11, 16);

    alert(`${workDate} ${startTime} ~ ${endTime} 근무 대타를 구하시겠습니까?`);

    router.push(
      `/map?scheduleId=${info.event.extendedProps.scheduleId}&date=${info.event.extendedProps.workDate}&start=${info.event.start}&end=${info.event.end}`
    );
  };

  // 알바생 -> 알바생 대타구하기(모달)
  const searchDetaModal = (info) => {
    const startTime = new Date(info.event.start).getTime();
    const endTime = new Date(info.event.end).getTime();

    if (
      confirm(
        `알바생 ${info.event.workDate} ${startTime} ~ ${endTime}의 대타를 구하시겠습니까?`
      )
    ) {
      setIsModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    const filteredEvents = events.filter(
      (event) => event.workDate === selectedDate
    );

    // 날짜를 클릭하면 timeGridDay 뷰로 변경
    selectInfo.view.calendar.changeView("timeGridDay", selectInfo.startStr); // 시간표 뷰로 전환
  };

  const handleEventHover = (selectInfo) => {
    console.log("selectInfo", selectInfo);

    if (
      loginUserRole === "staff" &&
      selectInfo.event.extendedProps.realTimeWorker !== loginUserAccountId
      // selectInfo.event.extendedProps.isVacant === false
    ) {
      return;
    }

    const eventEl = selectInfo.el; // 현재 이벤트 엘리먼트

    // 이벤트 엘리먼트가 relative 속성을 가지도록 설정
    // eventEl.style.position = "relative";

    // 기존 오버레이가 있으면 제거
    let existingOverlay = eventEl.querySelector(".event-overlay");
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // 오버레이 요소 생성
    const overlay = document.createElement("div");
    overlay.className =
      "event-overlay absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center pointer-events-none";

    // 버튼 생성
    const button = document.createElement("button");
    button.className =
      "z-10 bg-white text-black m-2 px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white pointer-events-auto";
    if (
      loginUserRole === "manager" &&
      selectInfo.event.extendedProps.isVacant === false
    ) {
      button.innerText = "공석 만들기";
    } else {
      button.innerText = "대타 구하기";
    }

    // 클릭 이벤트 추가
    button.addEventListener("click", (event) => {
      if (loginUserRole === "manager") {
        if (selectInfo.event.extendedProps.isVacant) {
          gotoDeta(selectInfo);
        } else {
          if (confirm(`해당 근무를 공석으로 변경하시겠습니까?`)) {
            axios
              .patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/work-information/${selectInfo.event.extendedProps.scheduleId}/vacant`
                // `http://localhost:8080/api/work-information/${selectInfo.event.extendedProps.scheduleId}/vacant`
              )
              .then((res) => {
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
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/substitute/my-schedule`,
            {
              // .get(`http://localhost:8080/api/substitute/my-schedule`, {
              params: { userId: loginUserUserId },
            }
          )
          .then((res) => {
            console.log("알바생->알바생 axios 응답: ", res.data);

            setcanDetaAlbatoAlba(res.data);

            // console.log(res.data.internalWorkers);
          })
          .catch((err) => {
            console.log("알바->알바 axios err: ", err);
          });

        // 알바생 공석 대타 구하기 ->
        if (selectInfo.event.extendedProps.isVacant) {
          const workDate = new Date(
            new Date(selectInfo.event.extendedProps.workDate).getTime() +
              9 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0];

          const startTime = new Date(
            new Date(selectInfo.event.start).getTime() + 9 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(11, 16);
          const endTime = new Date(
            new Date(selectInfo.event.end).getTime() + 9 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(11, 16);

          if (
            confirm(
              `${workDate} ${startTime} ~ ${endTime} 근무 대타를 구하시겠습니까?`
            )
          ) {
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
              .then((res) => {
                alert(`대타 요청을 완료했습니다.`);
              })
              .catch((err) => {
                console.log("대타 요청 보내기 에러: ", err);
              });
          }
        } else {
          // 알바생 -> 알바생 대타 구하기 모달 열기
          setIsModalOpen(true);
          setEventInfo(selectInfo);
        }
      }
    });

    // 오버레이에 버튼 추가 후 이벤트 요소에 추가
    overlay.appendChild(button);
    eventEl.appendChild(overlay);

    eventEl.onmouseleave = () => {
      setTimeout(() => {
        overlay.remove();
      }, 100); // 약간의 딜레이 추가
    };
  };

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
    // Start video stream
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

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오에서 이미지 캡처
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캔버스의 이미지를 base64로 변환
    const imageData = canvas.toDataURL("image/png");

    // 서버로 이미지 데이터 전송
    axios
      .post(
        // `${process.env.NEXT_PUBLIC_API_URL}/flask/face-recognition/recognize`,
        `https://i12b105.p.ssafy.io/flask/face-recognition/recognize`,
        // flask 서버
        // "http://172.20.0.2:5000/api/python/face-recognition/recognize",
        {
          // "http://localhost:8080/api/face-recognition/recognize", {
          image: imageData,
        }
      )
      .then((response) => {
        console.log("Response from server:", response.data);
        // 추가적인 처리 (예: 성공 메시지 표시 등)
      })
      .catch((error) => {
        console.error("Error sending image to server:", error);
      });
  };

  return (
    <div className="App h-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">MEGASSAFY 덕명점</h1>
        <div className="flex gap-3 text-base">
          <Link
            href="/map"
            className="bg-gray-400 text-black rounded-md px-4 py-2 flex items-center"
          >
            <Image
              src="/icons/Search_Contacts.png"
              alt="대타 찾기 아이콘"
              width={30}
              height={20}
              className="mr-2"
            />
            대타 찾기
          </Link>
          <button
            onClick={() => {
              if (loginUserRole === "staff") {
                openQRModal(); // admin 역할에 해당하는 함수 호출
              }
              if (loginUserRole === "manager") {
                openFaceRecognition(); // 일반 사용자 역할에 해당하는 함수 호출
              }
            }}
            className="bg-gray-400 text-black rounded-md px-4 py-2 flex items-center"
          >
            <Image
              src="/icons/Face_ID.png"
              alt="출퇴근하기 아이콘"
              width={30}
              height={20}
              className="mr-2"
            />
            출퇴근하기
          </button>
        </div>
      </div>
      <FullCalendar
        contentHeight="450px"
        fixedWeekCount={false}
        headerToolbar={{
          top: "title",
          // left: "",
          right: "timeGridDay,dayGridMonth prev,next",
        }}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events}
        locale="kr"
        // eventClick={(info) => console.log(info.event)}
        dayCellContent={(info) => info.date.getDate()}
        eventDisplay="block"
        eventContent={(info) => (
          <div className="text-black">{info.event.title}</div>
        )}
        views={{
          dayGridMonth: {
            // dayMaxEvents: true,
            titleFormat: function (date) {
              const year = date.date.year;
              const month = date.date.month + 1;
              return year + "년 " + month + "월 근무표";
            },
          },

          timeGridDay: {
            allDaySlot: false,
            nowIndicator: true,
            slotEventOverlap: false,
            slotMinTime: "09:00:00",
            slotDuration: "01:00:00",
            // titleFormat: function (date) {
            //   const year = date.date.year;
            //   const month = date.date.month;
            //   const day = date.date.day;
            //   return "오늘의 근무표";
            // },
            eventMouseEnter: handleEventHover,
          },
        }}
      />
      {/* 모달 */}
      {isModalOpen && eventInfo && (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-md shadow-md max-w-4xl w-auto">
            <div className="flex justify-end">
              <button onClick={closeModal}>X</button>
            </div>

            <div className="mx-4 ">
              <div className="flex my-3 justify-around  ">
                <DatePicker
                  selected={eventInfo.event.extendedProps.workDate}
                  // onChange={date}
                  className="border-b-2"
                  dateFormat="yyyy-MM-dd"
                  disabled={true}
                />
                <div>
                  <DatePicker
                    selected={eventInfo.event.start}
                    showTimeSelect
                    showTimeSelectOnly
                    timeCaption="Start Time"
                    dateFormat="aa hh:mm"
                    className="border-b-2 pl-1 mx-3 w-28"
                    disabled={true}
                  />
                  <span>-</span>
                  <DatePicker
                    selected={eventInfo.event.end}
                    showTimeSelect
                    showTimeSelectOnly
                    timeCaption="Start Time"
                    dateFormat="aa hh:mm"
                    className="border-b-2 pl-1  mx-3 w-28"
                    disabled={true}
                  />
                </div>
              </div>
              <div>
                <div className="my-3">
                  <h3 className="text-lg font-semibold">
                    우리 지점 대타 가능 알바생
                  </h3>
                  <div className="my-3">
                    {canDetaAlbatoAlba.internalWorkers.length > 0 ? (
                      <AlbaCard
                        albas={canDetaAlbatoAlba.internalWorkers}
                        selectedDate={eventInfo.event.extendedProps.workDate}
                        startTime={eventInfo.event.start}
                        endTime={eventInfo.event.end}
                      />
                    ) : (
                      <p>해당 시간대에 대타 가능한 알바생이 없어요:(</p>
                    )}
                  </div>
                </div>
                <div className="my-3">
                  <h3 className="text-lg font-semibold">
                    타지점 대타 가능 알바생
                  </h3>
                  <div className="my-3">
                    {canDetaAlbatoAlba.externalWorkers.length > 0 ? (
                      <AlbaCard
                        albas={canDetaAlbatoAlba.externalWorkers}
                        selectedDate={eventInfo.event.extendedProps.workDate}
                        startTime={eventInfo.event.start}
                        endTime={eventInfo.event.end}
                      />
                    ) : (
                      <p>해당 시간대에 대타 가능한 알바생이 없어요:(</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* <p className="mt-2">
              {new Date(eventInfo.event.start).toLocaleString()} ~{" "}
              {new Date(eventInfo.event.end).toLocaleString()}
            </p> */}
          </div>
        </div>
      )}

      {/* 큐알 모달 */}
      {isQRModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full relative">
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="absolute top-2 right-2 bg-gray-300 text-gray-800 rounded-full p-2 hover:bg-gray-400 transition-all"
            >
              X
            </button>
            <div className="flex justify-center items-center">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <p>QR 코드 생성 중...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 얼굴 인식 모달 */}
      {isFaceRecognitionOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-3xl w-3/5 relative">
            <button
              onClick={closeFaceRecognition}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition duration-200"
              aria-label="Close face recognition modal"
            >
              &times; {/* X 모양 */}
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
                <path
                  d="M50,10 C65,10 80,30 80,50 C80,70 65,90 50,90 C35,90 20,70 20,50 C20,30 35,10 50,10 Z"
                  fill="none"
                  stroke="#00BFFF"
                  strokeWidth="2"
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
            {/* 중앙 정렬을 위한 Flexbox 사용 */}
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
              style={{ display: "none" }}
            ></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
