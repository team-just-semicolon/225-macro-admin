import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TimePicker({ initialTime, setEndTime, showTimePicker, setShowTimePicker, endTime }) {
    const minDateTime = new Date();
    const [selectedTime, setSelectedTime] = useState(new Date(initialTime));

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    return (
        <div className="flex justify-between">
            <DatePicker
                selected={selectedTime}
                onChange={(date) => {
                    setEndTime(date);
                    setSelectedTime(date); // 선택된 시간을 selectedTime 상태로 업데이트
                    setShowTimePicker(false);
                }}
                minDate={minDateTime}
                minTime={
                    new Date(
                        minDateTime.getFullYear(),
                        minDateTime.getMonth(),
                        minDateTime.getDate(),
                        minDateTime.getHours(),
                        0, // 분을 0으로 설정합니다.
                        0 // 초를 0으로 설정합니다.
                    )
                }
                maxTime={
                    new Date(
                        minDateTime.getFullYear(),
                        minDateTime.getMonth(),
                        minDateTime.getDate(),
                        23, // 시간을 23으로 설정합니다.
                        59, // 분을 59으로 설정합니다.
                        59 // 초를 59으로 설정합니다.
                    )
                }
                showTimeSelect
                dateFormat="yyyy/MM/dd hh:mm aa"
                withPortal={true}
                inline={true}
                className={`text-sm border border-gray-400 rounded-md px-2 py-1 ${showTimePicker ? "absolute top-12 bg-white z-50 h-full" : ""}`}
            />
        </div>
    );
}