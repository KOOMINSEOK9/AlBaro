"use client"; // 클라이언트에서만 렌더링

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import timeGridPlugin from "@fullcalendar/timegrid";
import Link from "next/link";

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

  useEffect(() => {
    const formattedEvents = [
      {
        userId: 2,
        title: "김싸피",
        workDate: "2025-02-01",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 3,
        title: "이싸피",
        workDate: "2025-02-01",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 4,
        title: "최싸피",
        workDate: "2025-02-01",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: true,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 5,
        title: "박싸피",
        workDate: "2025-02-01",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: true,
        color: "",
      },
      {
        userId: 6,
        title: "유싸피",
        workDate: "2025-02-01",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 7,
        title: "민싸피",
        workDate: "2025-02-01",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "18:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 8,
        title: "한싸피",
        workDate: "2025-02-01",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "17:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 2,
        title: "김싸피",
        workDate: "2025-02-02",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 3,
        title: "이싸피",
        workDate: "2025-02-02",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: true,
        color: "",
      },
      {
        userId: 4,
        title: "최싸피",
        workDate: "2025-02-02",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 5,
        title: "박싸피",
        workDate: "2025-02-02",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 6,
        title: "유싸피",
        workDate: "2025-02-02",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 7,
        title: "민싸피",
        workDate: "2025-02-02",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "17:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 8,
        title: "한싸피",
        workDate: "2025-02-02",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "17:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },

      {
        userId: 2,
        title: "김싸피",
        workDate: "2025-02-07",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 3,
        title: "이싸피",
        workDate: "2025-02-07",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 4,
        title: "최싸피",
        workDate: "2025-02-07",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: true,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 5,
        title: "박싸피",
        workDate: "2025-02-07",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 6,
        title: "유싸피",
        workDate: "2025-02-07",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 7,
        title: "민싸피",
        workDate: "2025-02-07",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "18:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 8,
        title: "한싸피",
        workDate: "2025-02-07",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "17:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },

      {
        userId: 2,
        title: "김싸피",
        workDate: "2025-02-10",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 3,
        title: "이싸피",
        workDate: "2025-02-10",
        startTime: "08:00:00",
        endTime: "14:00:00",
        isVacant: false,
        checkInTime: "08:00:00",
        checkOutTime: "14:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 4,
        title: "최싸피",
        workDate: "2025-02-10",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: true,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 5,
        title: "박싸피",
        workDate: "2025-02-10",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: true,
        color: "",
      },
      {
        userId: 6,
        title: "유싸피",
        workDate: "2025-02-10",
        startTime: "12:00:00",
        endTime: "17:00:00",
        isVacant: false,
        checkInTime: "12:00:00",
        checkOutTime: "17:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 7,
        title: "민싸피",
        workDate: "2025-02-10",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "18:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },
      {
        userId: 8,
        title: "한싸피",
        workDate: "2025-02-10",
        startTime: "17:00:00",
        endTime: "22:00:00",
        isVacant: false,
        checkInTime: "17:00:00",
        checkOutTime: "22:00:00",
        isSubtituation: false,
        color: "",
      },
    ].map((event) => {
      // 공석이면 흰 배경
      if (event.isVacant || event.isSubtituation) {
        event.color = "#FFFFFF";
        event.borderColor = "#888";
      }
      // 아직 근무 전
      else if (new Date(`${event.workDate}T${event.startTime}`) > new Date()) {
        event.color = "#E8E8E8";
        event.borderColor = "#E8E8E8";
      }
      // 지각 혹은 조퇴면 빨간색
      else if (
        event.checkInTime > event.startTime ||
        event.checkOutTime < event.endTime
      ) {
        event.color = "#FFD9D9";
        event.borderColor = "#FFD9D9";
      }
      // 현재 근무 중이면 파란색
      else if (
        new Date(`${event.workDate}T${event.startTime}`) < new Date() &&
        new Date(`${event.workDate}T${event.endTime}`) > new Date()
        // event.endTime <
      ) {
        event.color = "#C5EFFF";
        event.borderColor = "#C5EFFF";
      }

      // 디폴트 초록색(정상 출근)
      else {
        event.color = "#DEFFD9";
        event.borderColor = "#DEFFD9";
      }

      return {
        title: event.title,
        start: `${event.workDate}T${event.startTime}`,
        end: `${event.workDate}T${event.endTime}`,
        backgroundColor: event.color, // Apply color here
        borderColor: event.borderColor,
        extendedProps: {
          userId: event.userId,
          isVacant: event.isVacant,
          checkInTime: event.checkInTime,
          checkOutTime: event.checkOutTime,
          isSubtituation: event.isSubtutation,
          workDate: event.workDate,
        },
      };
    });

    setEvents(formattedEvents);
  }, []);

  const handleEventClick = (info) => {
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

  return (
    <div className="App">
      <FullCalendar
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "timeGridDay dayGridMonth next",
        }}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events}
        locale="kr"
        eventClick={handleEventClick}
        dayCellContent={(info) => info.date.getDate()}
        eventDisplay="block"
        eventContent={(info) => (
          <div className="text-black">{info.event.title}</div>
        )}
        views={{
          dayGridMonth: {
            dayMaxEvents: 4,
          },
          timeGridDay: {
            allDaySlot: false,
            nowIndicator: true,
            slotEventOverlap: false,
          },
        }}
      />
    </div>
  );
};

export default MyCalendar;
