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
} from "@mui/material";
import { useEffect, useState } from "react";
import ScheduleEvent from "./ScheduleEvent";
import axios from "axios";
import { baseApi } from "../../../environment";
const localizer = momentLocalizer(moment);

export default function Schedule() {
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

  useEffect(() => {
    axios
      .get(`${baseApi}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
        setSelectedClass(resp.data.data[0]._id);
      })
      .catch((e) => {
        console.log("Fetch class failed", e);
      });
  }, []);

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

      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          margin: "30px auto",
          padding: "30px",
          borderRadius: "16px",
          background: "linear-gradient(to right, #e0f7fa, #80deea)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Class</InputLabel>
          <Select
            value={selectedClass || ""}
            label="Class"
            onChange={(e) => {
              setSelectedClass(e.target.value);
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
            background: "linear-gradient(to right, #00bcd4, #8bc34a)",
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "1rem",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "0.3s",
            "&:hover": {
              background: "linear-gradient(to right, #0097a7, #689f38)",
            },
          }}
        >
          ➕ Add New Period
        </Button>
      </div>

      {newPeriod && <ScheduleEvent selectedClass={selectedClass} />}

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
  );
}
