import { select } from "@material-tailwind/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimePicker = ({ initialTime, endTime, setEndTime, showTimePicker, setShowTimePicker }) => {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const currentTime = new Date();
    const [minTime, setMinTime] = useState(new Date(currentTime.getTime() + 60 * 1000));
    const [maxTime, setMaxTime] = useState(new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59));

    const handleDateChange = (date) => {
        setEndTime(date);
        console.log(selectedDateTime)
        if (date && date.getHours() !== selectedDateTime.getHours() || date.getMinutes() !== selectedDateTime.getMinutes()) {
            setShowTimePicker(false);
        }
        else {
            const newSelectedDateTime = new Date(selectedDateTime.getTime());
            newSelectedDateTime.setFullYear(date.getFullYear());
            newSelectedDateTime.setMonth(date.getMonth());
            newSelectedDateTime.setDate(date.getDate());
            setSelectedDateTime(newSelectedDateTime);

            // 오늘 날짜인 경우 mintime 초기값을 현재 시간 이후로 설정
            if (date.toDateString() === new Date().toDateString()) {
                setMinTime(new Date(currentTime.getTime() + 60000));
            } else {
                setMinTime(new Date(0, 0, 0, 0, 0, 0));
            }
        }
    };

    return (
        <div className="flex justify-between">
            <DatePicker
                selected={selectedDateTime}
                onChange={handleDateChange}
                minDate={new Date()}
                minTime={minTime}
                maxTime={maxTime}
                showTimeSelect
                dateFormat="yyyy/MM/dd hh:mm aa"
                withPortal={true}
                inline={true}
                timeIntervals={10}
                className={`text-sm border border-gray-400 rounded-md px-2 py-1 ${showTimePicker ? "absolute top-12 bg-white z-50 h-full" : ""
                    }`}
            />

        </div>
    );
};

export default TimePicker;
