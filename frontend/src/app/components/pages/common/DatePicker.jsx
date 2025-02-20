import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerModule = ({
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  scheduleIdNum,
}) => {
  // console.log(startTime, endTime);

  useEffect(() => {
    if (!startTime) {
      const now = new Date();
      now.setMinutes(0, 0, 0);
      setStartTime(new Date(now));
    }
    if (!endTime) {
      const end = new Date();
      end.setMinutes(0, 0, 0);
      end.setHours(end.getHours() + 1);
      setEndTime(new Date(end));
    }
  });

  return (
    <div className="justify-around">
      <div className="flex mb-2">
        <Image
          src="/icons/calendar.png"
          alt="calendar icon"
          width={30}
          height={30}
          className="w-6 h-6 ml-1"
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border-b-2 pl-1   ml-2"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="flex">
        <Image
          src="/icons/clock.png"
          alt="clock icon"
          width={30}
          height={30}
          className="w-6 h-6 ml-1 mr-2"
        />
        <DatePicker
          selected={startTime}
          onChange={(time) => {
            if (selectedDate) {
              console.log("datepicker1", time);
              const newDateTime = new Date(selectedDate);
              newDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
              setStartTime(newDateTime);
            }
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Start Time"
          dateFormat="aa hh:mm"
          className="border-b-2 pl-1 w-24"
        />
        <span className="text-center align-middle mx-2">-</span>
        <DatePicker
          selected={endTime}
          onChange={(time) => {
            if (selectedDate) {
              const newDateTime = new Date(selectedDate);
              newDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
              setEndTime(newDateTime);
            }
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="End Time"
          dateFormat="aa hh:mm"
          className="border-b-2 pl-1 ml-1 w-24"
        />
      </div>
    </div>
  );
};

export default DatePickerModule;
