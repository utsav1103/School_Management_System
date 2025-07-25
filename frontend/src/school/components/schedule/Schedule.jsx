import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@mui/material';
import { useState } from 'react';
const localizer = momentLocalizer(moment)


export default function Schedule() {
    
    const date = new Date();
    const myEventsList = [
        {
            id:1,
            title:"Subject: History, Teacher: Sarn",
            start:new Date(date.setHours(11,30)),
            end:new Date(date.setHours(12,30))
        },
        {
            id:2,
            title:"Subject: English, Teacher: Saxy",
            start:new Date(date.setHours(15,30)),
            end:new Date(date.setHours(16,30))
        }

    ]


    return (
        <>
            <h1
  style={{
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",
    margin: "2rem 0",
    background: "linear-gradient(to right, #00bcd4, #8bc34a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "1px",
  }}
>
  📅 Schedule
</h1>

<Button onClick={setNewPeriod(true)} style={{margin: "2rem 0",
    background: "linear-gradient(to right, #00bcd4, #8bc34a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",}}>
        Add New Period</Button>


    


<div
  style={{
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }}
>
  <Calendar
    localizer={localizer}
    events={myEventsList}
    defaultView="week"
    views={["week", "day", "agenda"]}
    step={30}
    timeslots={1}
    startAccessor="start"
    endAccessor="end"
    min={new Date(1970, 1, 1, 10, 0, 0)}
    max={new Date(1970, 1, 1, 17, 0, 0)}
    defaultDate={new Date()}
    showMultiDayTimes
    style={{
      height: "600px",
      borderRadius: "8px",
    }}
  />
</div>

        </>
    )
}




