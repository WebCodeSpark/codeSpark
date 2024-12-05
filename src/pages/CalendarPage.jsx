import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styled from "styled-components";

const StyledCalendarWrapper = styled.div;

const StyledDate = styled.div;

export default function CalendarPage() {
  const [value, onChange] = useState(new Date());

  return (
    <StyledCalendarWrapper>
      <Calendar onChange={onChange} value={value} />
      <StyledDate>오늘</StyledDate>
    </StyledCalendarWrapper>
  );
}
