"use client"; // 클라이언트에서만 렌더링

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import timeGridPlugin from "@fullcalendar/timegrid";

import axios from "axios";

import Link from "next/link";
import Image from "next/image";

// FullCalendar는 클라이언트에서만 렌더링되므로 dynamic import 사용
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// import "./Calendar.css";

const MyCalendar = () => {
  const router = useRouter(); // Next.js Router 사용
  const [events, setEvents] = useState([]);

  const storeId = 1;

  useEffect(() => {
    axios
      .get(
        `http://http://i12b105.p.ssafy.io:8080/api/work-information/${storeId}`
      )
      .then((response) => {
        console.log(response);

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
            console.log(
              event.userName,
              " ",
              new Date(`${event.workDate}T${event.startTime}`)
            );

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

  const gotoDeta = (info) => {
    console.log(info);
    // start와 end가 Date 객체인지 확인 후 처리
    const startTime = new Date(info.event.start).getTime();

    const endTime = new Date(info.event.end).getTime();

    alert(
      `${info.event.workDate} ${startTime} ~ ${endTime}의 대타를 구하시겠습니까?`
    );

    router.push(
      `/map?date=${info.event.eventDate}&start=${info.event.start}&end=${info.event.end}`
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
    button.innerText = "대타 구하기";

    // 클릭 이벤트 추가
    button.addEventListener("click", (event) => {
      // event.stopPropagation();
      // console.log("대타 구하기 버튼 클릭!");
      gotoDeta(selectInfo);
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

  return (
    <div className="App">
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
          <button className="bg-gray-400 text-black rounded-md px-4 py-2 flex items-center">
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
        eventClick={(info) => console.log(info.event)}
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
              const month = date.date.month;
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
    </div>
  );
};

export default MyCalendar;
