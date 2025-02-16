"use client"; // 클라이언트에서만 렌더링

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import timeGridPlugin from "@fullcalendar/timegrid";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";

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

// import "./Calendar.css";

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

  const loginUserId = 374851;
  const userId = 1;
  const storeId = 1;
  const role = "manager";

  const [isFaceRecognitionOpen, setIsFaceRecognitionOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    axios
      .get(`https://i12b105.p.ssafy.io/api/work-information/${storeId}`)
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
  }, []);

  // useEffect(() => {
  //   const formattedEvents = [
  //     {
  //       userId: 2,
  //       title: "김싸피",
  //       workDate: "2025-02-01",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 3,
  //       title: "이싸피",
  //       workDate: "2025-02-01",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 4,
  //       title: "최싸피",
  //       workDate: "2025-02-01",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: true,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 5,
  //       title: "박싸피",
  //       workDate: "2025-02-01",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: true,
  //       color: "",
  //     },
  //     {
  //       userId: 6,
  //       title: "유싸피",
  //       workDate: "2025-02-01",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 7,
  //       title: "민싸피",
  //       workDate: "2025-02-01",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "18:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 8,
  //       title: "한싸피",
  //       workDate: "2025-02-01",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "17:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 2,
  //       title: "김싸피",
  //       workDate: "2025-02-02",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 3,
  //       title: "이싸피",
  //       workDate: "2025-02-02",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: true,
  //       color: "",
  //     },
  //     {
  //       userId: 4,
  //       title: "최싸피",
  //       workDate: "2025-02-02",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 5,
  //       title: "박싸피",
  //       workDate: "2025-02-02",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 6,
  //       title: "유싸피",
  //       workDate: "2025-02-02",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 7,
  //       title: "민싸피",
  //       workDate: "2025-02-02",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "17:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 8,
  //       title: "한싸피",
  //       workDate: "2025-02-02",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "17:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },

  //     {
  //       userId: 2,
  //       title: "김싸피",
  //       workDate: "2025-02-07",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 3,
  //       title: "이싸피",
  //       workDate: "2025-02-07",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 4,
  //       title: "최싸피",
  //       workDate: "2025-02-07",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: true,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 5,
  //       title: "박싸피",
  //       workDate: "2025-02-07",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 6,
  //       title: "유싸피",
  //       workDate: "2025-02-07",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 7,
  //       title: "민싸피",
  //       workDate: "2025-02-07",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "18:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 8,
  //       title: "한싸피",
  //       workDate: "2025-02-07",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "17:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },

  //     {
  //       userId: 2,
  //       title: "김싸피",
  //       workDate: "2025-02-10",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 3,
  //       title: "이싸피",
  //       workDate: "2025-02-10",
  //       startTime: "08:00:00",
  //       endTime: "14:00:00",
  //       isVacant: false,
  //       checkInTime: "08:00:00",
  //       checkOutTime: "14:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 4,
  //       title: "최싸피",
  //       workDate: "2025-02-10",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: true,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 5,
  //       title: "박싸피",
  //       workDate: "2025-02-10",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: true,
  //       color: "",
  //     },
  //     {
  //       userId: 6,
  //       title: "유싸피",
  //       workDate: "2025-02-10",
  //       startTime: "12:00:00",
  //       endTime: "17:00:00",
  //       isVacant: false,
  //       checkInTime: "12:00:00",
  //       checkOutTime: "17:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 7,
  //       title: "민싸피",
  //       workDate: "2025-02-10",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "18:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //     {
  //       userId: 8,
  //       title: "한싸피",
  //       workDate: "2025-02-10",
  //       startTime: "17:00:00",
  //       endTime: "22:00:00",
  //       isVacant: false,
  //       checkInTime: "17:00:00",
  //       checkOutTime: "22:00:00",
  //       isSubtituation: false,
  //       color: "",
  //     },
  //   ].map((event) => {
  //     // 공석이면 흰 배경
  //     if (event.isVacant || event.isSubtituation) {
  //       event.color = "#FFFFFF";
  //       event.borderColor = "#888";
  //     }
  //     // 아직 근무 전
  //     else if (new Date(`${event.workDate}T${event.startTime}`) > new Date()) {
  //       event.color = "#E8E8E8";
  //       event.borderColor = "#E8E8E8";
  //     }
  //     // 지각 혹은 조퇴면 빨간색
  //     else if (
  //       event.checkInTime > event.startTime ||
  //       event.checkOutTime < event.endTime
  //     ) {
  //       event.color = "#FFD9D9";
  //       event.borderColor = "#FFD9D9";
  //     }
  //     // 현재 근무 중이면 파란색
  //     else if (
  //       new Date(`${event.workDate}T${event.startTime}`) < new Date() &&
  //       new Date(`${event.workDate}T${event.endTime}`) > new Date()
  //       // event.endTime <
  //     ) {
  //       event.color = "#C5EFFF";
  //       event.borderColor = "#C5EFFF";
  //     }

  //     // 디폴트 초록색(정상 출근)
  //     else {
  //       event.color = "#DEFFD9";
  //       event.borderColor = "#DEFFD9";
  //     }

  //     return {
  //       title: event.title,
  //       start: `${event.workDate}T${event.startTime}`,
  //       end: `${event.workDate}T${event.endTime}`,
  //       backgroundColor: event.color, // Apply color here
  //       borderColor: event.borderColor,
  //       extendedProps: {
  //         userId: event.userId,
  //         isVacant: event.isVacant,
  //         checkInTime: event.checkInTime,
  //         checkOutTime: event.checkOutTime,
  //         isSubtituation: event.isSubtutation,
  //         workDate: event.workDate,
  //       },
  //     };
  //   });

  //   setEvents(formattedEvents);
  // }, []);

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

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    const filteredEvents = events.filter(
      (event) => event.workDate === selectedDate
    );

    // 날짜를 클릭하면 timeGridDay 뷰로 변경
    selectInfo.view.calendar.changeView("timeGridDay", selectInfo.startStr); // 시간표 뷰로 전환
  };

  const handleEventHover = (selectInfo) => {
    // console.log("selectInfo", selectInfo);

    if (
      role === "staff" &&
      selectInfo.event.extendedProps.accountId !== loginUserId &&
      selectInfo.event.extendedProps.isVacant === false
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
      role === "manager" &&
      selectInfo.event.extendedProps.isVacant === false
    ) {
      button.innerText = "공석 만들기";
    } else {
      button.innerText = "대타 구하기";
    }

    // 클릭 이벤트 추가
    button.addEventListener("click", (event) => {
      if (role === "manager") {
        if (selectInfo.event.extendedProps.isVacant) {
          gotoDeta(selectInfo);
        } else {
          if (confirm(`해당 근무를 공석으로 변경하시겠습니까?`)) {
            axios
              .patch(
                `https://i12b105.p.ssafy.io/api/work-information/${selectInfo.event.extendedProps.scheduleId}/vacant`
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
          .get(`https://i12b105.p.ssafy.io/api/substitute/my-schedule`, {
            params: { userId },
          })
          .then((res) => {
            console.log("알바생->알바생 axios 응답: ", res.data);

            setcanDetaAlbatoAlba(res.data);

            // console.log(res.data.internalWorkers);
          })
          .catch((err) => {
            console.log("알바->알바 axios err: ", err);
          });

        // 알바생 -> 알바생 대타 구하기 모달 열기
        setIsModalOpen(true);
        setEventInfo(selectInfo);
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

  const openFaceRecognition = () => {
    setIsFaceRecognitionOpen(true);
    // Start video stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const closeFaceRecognition = () => {
    setIsFaceRecognitionOpen(false);
    const video = document.getElementById('video');
    if (video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const captureImage = () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오에서 이미지 캡처
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캔버스의 이미지를 base64로 변환
    const imageData = canvas.toDataURL('image/png');

    // 서버로 이미지 데이터 전송
    axios.post('https://i12b105.p.ssafy.io/api/face-recognition/recognize', {
      image: imageData,
    })
    .then(response => {
      console.log('Response from server:', response.data);
      // 추가적인 처리 (예: 성공 메시지 표시 등)
    })
    .catch(error => {
      console.error('Error sending image to server:', error);
    });
  };

  return (
    <div className="App h-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">MEGASSAFY 덕명점</h1>
        <div className="flex gap-3 text-lg">
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
          <button onClick={openFaceRecognition} className="bg-gray-400 text-black rounded-md px-4 py-2 flex items-center">
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
            dayMaxEvents: 4,
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

      {/* Modal for Face Recognition */}
      {isFaceRecognitionOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-3xl w-3/5 relative">
            <button 
              onClick={closeFaceRecognition} 
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition duration-200"
            >
              &times; {/* X 모양 */}
            </button>
            <h1 className="text-center text-xl font-bold mb-4">Face Recognition</h1>
            <div className="relative">
              <video id="video" width="100%" height="auto" autoPlay className="mb-4"></video>
              {/* 얼굴 인식을 위한 SVG 실루엣 추가 */}
              <svg
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
              </svg>
            </div>
            {/* 중앙 정렬을 위한 Flexbox 사용 */}
            <div className="flex justify-center mt-4">
              <button onClick={captureImage} className="bg-blue-500 text-white rounded-md px-4 py-2">Capture</button>
            </div>
            <canvas id="canvas" width="640" height="480" style={{ display: 'none' }}></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
