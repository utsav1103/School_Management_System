import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { baseApi } from "../../../environment";

export default function ScheduleEvent({
  selectedClass,
  handleEventClose,
  handleMessageNew,
  edit,
  selectedEventId,
}) {
  const periods = [
    {
      id: 1,
      label: "Period 1 (10:00 AM - 11:00 AM)",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      label: "Period 2 (11:00 AM - 12:00 PM)",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 3,
      label: "Period 3 (12:00 PM - 13:00 PM)",
      startTime: "12:00",
      endTime: "1:00",
    },
    {
      id: 4,
      label: "Lunch Break (1:00 PM - 2:00 PM)",
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 5,
      label: "Period 4 (2:00 PM - 3:00 PM)",
      startTime: "14:00",
      endTime: "",
    },
    {
      id: 6,
      label: "Period 5 (3:00 PM - 4:00 PM)",
      startTime: "15:00",
      endTime: "16:00",
    },
  ];
  const handleDelete = ()=>{
    if(confirm("Are you sure you want to delete ?")){
      axios.delete(`${baseApi}/schedule/delete/${selectedEventId}`).then(resp=>{
      handleMessageNew(resp.data.message, "success")
      handleCancel()
    }).catch((e)=>{
      console.log("Error",e);
      handleMessageNew("Error in deleting period","error")
    })
    }
    
  }
  const handleCancel = () => {
    Formik.resetForm();
    handleEventClose();
  };

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: dayjs().format("YYYY-MM-DD"),
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: (values) => {
      try {
        const dateValue = new Date(values.date);
        if (isNaN(dateValue)) throw new Error("Invalid date");

        const [startTimeStr, endTimeStr] = values.period.split(",");
        const [startHour, startMinute] = startTimeStr
          .trim()
          .split(":")
          .map(Number);
        const [endHour, endMinute] = endTimeStr.trim().split(":").map(Number);

        const startTime = new Date(dateValue);
        startTime.setHours(startHour, startMinute, 0);

        const endTime = new Date(dateValue);
        endTime.setHours(endHour, endMinute, 0);

        const payload = {
          teacher: values.teacher,
          subject: values.subject,
          classId: selectedClass, // FIXED: use classId not class
          startTime,
          endTime,
          date: values.date,
        };

        let BACKEND_URL = `${baseApi}/schedule/create`;
        if (edit) {
          BACKEND_URL = `${baseApi}/schedule/update/${selectedEventId}`;
        }
        axios
          .post(BACKEND_URL, payload)
          .then((resp) => {
            //setMessage(resp.data.message)
            // setMessageType("success")
            handleMessageNew(resp.data.message, "success");
            Formik.resetForm();
            handleEventClose();
          })
          .catch((e) => {
            console.log("error", e);
            handleMessageNew("Error in creating new schedule");
            //setMessage("Error in creating schedule")
            //setMessageType("Error")
          });
      } catch (err) {
        console.error("Schedule creation error:", err.message);
      }
    },
  });
  const fetchData = async () => {
    const teacherResponse = await axios.get(
      `${baseApi}/teacher/fetch-with-query`,
      { params: {} }
    );
    const subjectResponse = await axios.get(`${baseApi}/subject/all`);
    setTeachers(teacherResponse.data.teachers);
    setSubjects(subjectResponse.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const dateFormat = (date) => {
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();
    return `${dateHours}:${dateMinutes < 10 ? "0" : ""}${dateMinutes}`;
  };

  useEffect(() => {
    if (selectedEventId) {
      axios
        .get(`${baseApi}/schedule/fetch/${selectedEventId}`)
        .then((resp) => {
          let start = new Date(resp.data.data.startTime);
          let end = new Date(resp.data.data.endTime);

          Formik.setFieldValue("teacher", resp.data.data.teacher);
          Formik.setFieldValue("subject", resp.data.data.subject);
          Formik.setFieldValue("date", start);
          const finalFormattedTime = dateFormat(start) + "," + dateFormat(end);
          Formik.setFieldValue("period", `${finalFormattedTime}`);
          //console.log(start, end);
          // Formik.setFieldValue("teacher",resp.data.schedule.teacher);
          //console.log("response",resp)
        })
        .catch((e) => {
          console.log("Error", e);
        });
    }
  }, [selectedEventId]);

  return (
    <>
      <Box
        component="form"
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
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        {edit ? (
          <Typography>Edit Period</Typography>
        ) : (
          <Typography>Add new Period</Typography>
        )}

        <FormControl
          fullWidth
          error={Boolean(Formik.touched.teacher && Formik.errors.teacher)}
        >
          <InputLabel>Teachers</InputLabel>
          <Select
            value={Formik.values.teacher || ""}
            label="Teacher"
            name="teacher"
            onChange={Formik.handleChange}
          >
            {teachers &&
              teachers.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.name}
                </MenuItem>
              ))}
          </Select>
          {Formik.touched.teacher && Formik.errors.teacher && (
            <Typography variant="caption" color="error">
              {Formik.errors.teacher}
            </Typography>
          )}
        </FormControl>

        <FormControl
          fullWidth
          error={Boolean(Formik.touched.subject && Formik.errors.subject)}
        >
          <InputLabel>Subject</InputLabel>
          <Select
            value={Formik.values.subject || ""}
            label="Subjects"
            name="subject"
            onChange={Formik.handleChange}
          >
            {subjects &&
              subjects.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.subject_name}
                </MenuItem>
              ))}
          </Select>
          {Formik.touched.subject && Formik.errors.subject && (
            <Typography variant="caption" color="error">
              {Formik.errors.subject}
            </Typography>
          )}
        </FormControl>

        <FormControl
          fullWidth
          error={Boolean(Formik.touched.period && Formik.errors.period)}
        >
          <InputLabel>Periods</InputLabel>
          <Select
            value={Formik.values.period || ""}
            label="Periods"
            name="period"
            onChange={Formik.handleChange}
          >
            {periods &&
              periods.map((x) => (
                <MenuItem key={x.id} value={`${x.startTime},${x.endTime}`}>
                  {x.label}
                </MenuItem>
              ))}
          </Select>
          {Formik.touched.period && Formik.errors.period && (
            <Typography variant="caption" color="error">
              {Formik.errors.period}
            </Typography>
          )}
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={Formik.values.date ? dayjs(Formik.values.date) : null}
            onChange={(newValue) => Formik.setFieldValue("date", newValue)}
            // slotProps={{
            //   textField: {
            //     fullWidth: true,
            //     error: Boolean(Formik.touched.date && Formik.errors.date),
            //     helperText: Formik.touched.date && Formik.errors.date,
            //   },
            // }}
          />
        </LocalizationProvider>

        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #00acc1, #26c6da)",
            color: "white",
            padding: "10px 20px",
            fontWeight: "600",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(to right, #0097a7, #00bcd4)",
              boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Submit
        </Button>

        <Button
          type="button"
          variant="outlined"
          onClick={handleDelete}
          sx={{
            background: "linear-gradient(to right, #ef5350, #ff7043)", // red-orange gradient
            color: "white",
            padding: "10px 20px",
            fontWeight: "600",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(to right, #d32f2f, #e64a19)",
              boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Delete
        </Button>

        <Button
          type="button"
          variant="outlined"
          onClick={handleCancel}
          sx={{
            background: "linear-gradient(to right, #00acc1, #26c6da)",
            color: "white",
            padding: "10px 20px",
            fontWeight: "600",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(to right, #0097a7, #00bcd4)",
              boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
}
