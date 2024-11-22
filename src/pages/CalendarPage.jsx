import React, {useState} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // 기본 스타일


export default function CalendarPage() {
    const [value, onChange] = useState(new Date());

    return (
        <Calendar onChange={onChange} value={value} />
    )
}