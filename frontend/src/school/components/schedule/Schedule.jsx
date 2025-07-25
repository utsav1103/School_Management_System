import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
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
            <h1>Schedule</h1>
            <Calendar
            localizer={localizer}
            events={myEventsList}
            defaultView='week'
            views={['week','day','agenda']}
            step={30}
            timeslots={1}
            startAccessor="start"
            min={new Date(1970,1,1,10,0,0)}
            max={new Date(1970,1,1,17,0,0)}
            defaultDate={new Date()}
            showMultiDayTimes
      endAccessor="end"
      style={{ height: "100%" , width: '100%' }}
    />
        </>
    )
}




