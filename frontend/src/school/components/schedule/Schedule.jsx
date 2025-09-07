import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";

import { useEffect, useState } from "react";
import ScheduleEvent from "./ScheduleEvent";
import axios from "axios";
//import { baseApi } from "../../../environment";
const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const handleMessageClose = () => {
    setMessage("");
  };
  const handleMessageNew = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };
  const [view, setView] = useState("week");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newPeriod, setNewPeriod] = useState(false);
  const date = new Date();
  const myEventsList = [
    {
      id: 1,
      title: "Subject: History, Teacher: Sarn",
      start: new Date(date.setHours(11, 30)),
      end: new Date(date.setHours(12, 30)),
    },
    {
      id: 2,
      title: "Subject: English, Teacher: Saxy",
      start: new Date(date.setHours(15, 30)),
      end: new Date(date.setHours(16, 30)),
    },
  ];
  const [events, setEvents] = useState(myEventsList);

  const handleEventClose = () => {
    setNewPeriod(false);
    setEdit(false);
    setSelectedEventId(null);
  };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [edit, setEdit] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const handleSelectEvent = (event) => {
    setEdit(true);
    setSelectedEventId(event.id);
    console.log(event);
  };

  useEffect(() => {
    axios
      .get(`/api/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
        setSelectedClass(resp.data.data[0]._id);
      })
      .catch((e) => {
        console.log("Fetch class failed", e);
      });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`/api/schedule/fetch-with-class/${selectedClass}`)
        .then((resp) => {
          const respData = resp.data.data.map((x) => {
            return {
              id: x._id,
              title: `Sub: ${x.subject.subject_name},Teacher:${x.teacher.name}`,
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
  }, [selectedClass, message]);

  //useEffect(() => {}, [events]);

  return (
    <>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 800,
          my: 4,
          background: "linear-gradient(90deg, #ff9800, #ff5722)", // warm orange gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "2px",
          textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        📅 Schedule
      </Typography>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}

      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          margin: "30px auto",
          padding: "30px",
          borderRadius: "20px",
          background: "linear-gradient(90deg, #ff9800, #ff5722)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>Class</InputLabel>
          <Select
            value={selectedClass || ""}
            label="Class"
            onChange={(e) => setSelectedClass(e.target.value)}
            sx={{
              borderRadius: 2,
              background: "rgba(255,255,255,0.1)",
              color: "white",
              "& .MuiSvgIcon-root": { color: "white" }, // dropdown arrow white
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff9800",
              }, // orange hover
            }}
          >
            {classes &&
              classes.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.class_text}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Button
          onClick={() => setNewPeriod(true)}
          sx={{
            background: "linear-gradient(90deg, #ff9800, #ff5722)",
            color: "white",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: "14px",
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
            textTransform: "none",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(to right,#ff5722, #e91e63)",
              transform: "translateY(-3px) scale(1.05)", // pop effect
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            },
          }}
        >
          ➕ Add New Period
        </Button>
      </div>

      {(newPeriod || edit) && (
        <ScheduleEvent
          selectedClass={selectedClass}
          handleEventClose={handleEventClose}
          handleMessageNew={handleMessageNew}
          edit={edit}
          selectedEventId={selectedEventId}
        />
      )}
      <Box
        sx={{
          maxWidth: "1000px",
          margin: "0 auto",
          p: 2,
          borderRadius: "16px",
          background: "rgba(30, 30, 30, 0.85)", // dark semi-transparent for glass effect
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
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
          onSelectEvent={handleSelectEvent}
          min={new Date(new Date().setHours(8, 0, 0, 0))}
          max={new Date(new Date().setHours(18, 0, 0, 0))}
          date={currentDate}
          onNavigate={(newDate)=>setCurrentDate(newDate)}
          showMultiDayTimes
          style={{
            height: "600px",
            borderRadius: "12px",
            color: "#f1f1f1",
            backgroundColor: "transparent", 
          }}
        />
      </Box>
    </>
  );
}
