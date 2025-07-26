import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";

export default function ScheduleEvent() {

    const periods = [
      {id: 1,label:"Period 1 (10:00 AM - 11:00 AM)",startTime:"10:00",endTime:"11:00"},
      {id: 2,label:"Period 2 (11:00 AM - 12:00 PM)",startTime:"11:00",endTime:"12:00"},
      {id: 3,label:"Period 3 (12:00 PM - 13:00 PM)",startTime:"12:00",endTime:"1:00"},
      {id: 4,label:"Lunch Break (1:00 PM - 2:00 PM)",startTime:"13:00",endTime:"14:00"},
      {id: 5,label:"Period 4 (2:00 PM - 3:00 PM)",startTime:"14:00",endTime:""},
      {id: 6,label:"Period 5 (3:00 PM - 4:00 PM)",startTime:"15:00",endTime:"16:00"},
    ];

    const [teachers, setTeachers] = useState([])
    const [subjects, setSubjects] = useState([])
    

    const initialValues = {
      teacher:"",
      subject:"",
      period:"",
      date:"",

    }

    const Formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: (values) => {
      
    },
  });
  const fetchData = async ()=>{
    const teacherResponse = await axios.get(`${baseApi}/teacher/fetch-with-query`, {params:{}});
    const subjectResponse = await axios.get(`${baseApi}/subject/all`);
    setTeachers(teacherResponse.data.teachers)
    setSubjects(subjectResponse.data.data)
  }

  useEffect(()=>{
    fetchData()
  },[])


  return (
    <>
      <h1>Schedule event</h1>
  
     <Box
      component="form"
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "30px auto",
        padding: "30px",
        borderRadius: "16px",
        background: "linear-gradient(to right, #f3e5f5, #e1bee7)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      noValidate
      autoComplete="off"
      onSubmit={Formik.handleSubmit}
    >

  <FormControl fullWidth error={Boolean(Formik.touched.teacher && Formik.errors.teacher)}>
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


  <FormControl fullWidth error={Boolean(Formik.touched.subject && Formik.errors.subject)}>
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


  <FormControl fullWidth error={Boolean(Formik.touched.period && Formik.errors.period)}>
    <InputLabel>Periods</InputLabel>
    <Select
      value={Formik.values.period || ""}
      label="Periods"
      name="period"
      onChange={Formik.handleChange}
    >
      {periods &&
        periods.map((x) => (
          <MenuItem key={x._id} value={x._id}>
            {x.class_text} ({x.class_num})
          </MenuItem>
        ))}
    </Select>
    {Formik.touched.period && Formik.errors.period && (
      <Typography variant="caption" color="error">
        {Formik.errors.period}
      </Typography>
    )}
  </FormControl>
  </Box>
    </>
  );
}
