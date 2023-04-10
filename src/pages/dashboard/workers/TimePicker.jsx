import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TimePicker({ initialTime, setEndTime, showTimePicker, setShowTimePicker }) {
    const [selectedTime, setSelectedTime] = useState(new Date(initialTime));

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    return (
        <div className="flex justify-between">
            <DatePicker
                selected={selectedTime}
                onChange={(date) => {
                    setSelectedTime(date);
                    setEndTime(selectedTime); // 선택된 시간을 인풋창에 입력
                    setShowTimePicker(false); // 시간 선택 창 닫기
                }}
                showTimeSelect
                dateFormat="yyyy/MM/dd hh:mm aa"
                withPortal={true}
                inline={true}
                onFocus={() => setShowTimePicker(true)}
                onBlur={() => setShowTimePicker(false)}
                className={`text-sm border border-gray-400 rounded-md px-2 py-1 ${showTimePicker ? "absolute top-12 bg-white z-50 h-full" : ""}`}
            />
        </div>
    );
}