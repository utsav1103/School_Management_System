import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";

const localizer = momentLocalizer(moment);

export default function ScheduleStudent() {
//  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("week");


    const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`, {
        withCredentials: true, // if using cookies
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if JWT in localStorage
        },
      });

      console.log("student details response", response.data);
      setSelectedClass(response.data.student.student_class)
    } catch (error) {
      console.log("Error in student details", error);
    }
  };

  useEffect(() => {
    fetchStudentDetails()
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`${baseApi}/schedule/fetch-with-class/${selectedClass._id}`)
        .then((resp) => {
          const respData = resp.data.data.map((x) => {
            return {
              id: x._id,
              title: `Sub: ${x.subject.subject_name}, Teacher: ${x.teacher.name}`,
              start: new Date(x.startTime),
              end: new Date(x.endTime),
            };
          });
          setEvents(respData); 
        })
        .catch((e) => {
          console.log("Error in fetching schedule", e);
        });
    }
  }, [selectedClass]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
        backgroundColor: "#0d0d0d",
        backgroundBlendMode: "overlay",
        backgroundSize: "repeat",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "2rem",
          color: "#fff",
        }}
      >
        📅 Schedule Of Class [{selectedClass?selectedClass.class_text:''}]
      </h1>

      
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "1rem",
          borderRadius: "16px",
          background: "rgba(20,20,20,0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          onView={(newView) => setView(newView)}
          views={["week", "day", "agenda"]}
          step={30}
          timeslots={1}
          startAccessor="start"
          endAccessor="end"
          min={new Date(new Date().setHours(8, 0, 0, 0))}
          max={new Date(new Date().setHours(18, 0, 0, 0))}
          defaultDate={new Date()}
          showMultiDayTimes
          style={{
            height: "600px",
            borderRadius: "12px",
            color: "#fff",
          }}
        />
      </div>

      {/* Custom Styling */}
      <style>
{`
  /* ===== Toolbar Buttons ===== */
  .rbc-toolbar {
    background: transparent !important;
    margin-bottom: 1rem;
  }
  .rbc-toolbar button {
    background: rgba(40,40,40,0.9);
    color: white;
    border-radius: 20px;
    padding: 6px 12px;
    margin: 0 4px;
    border: 1px solid #555;
    transition: all 0.3s ease;
  }
  .rbc-toolbar button:hover {
    background: rgba(90,90,90,1);
    border-color: #888;
    transform: translateY(-2px);
  }
  .rbc-toolbar button.rbc-active {
    background: #1e88e5 !important;
    border-color: #42a5f5;
    color: white;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(66,165,245,0.7);
  }

  /* ===== Events ===== */
  .rbc-event {
    background: linear-gradient(135deg, #1e1e1e, #333);
    border: 1px solid #555;
    border-radius: 6px;
    padding: 2px 6px;
    font-size: 0.9rem;
    color: #eee;
  }

  /* ===== Calendar Background & Today Column Fix ===== */
  .rbc-today {
    background: rgba(255, 255, 255, 0.08) !important;
  }
  .rbc-off-range-bg {
    background: rgba(0,0,0,0.4) !important;
  }
  .rbc-header {
    color: #ddd !important;
    background: rgba(30,30,30,0.8);
    border: 1px solid #444;
  }
  .rbc-header.rbc-today {
    color: #ff9800 !important;
    font-weight: bold;
  }
`}
</style>

    </div>
  );
}
