import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
//import { Box, Button, TextField, Typography } from '@mui/material';

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from 'react';
//date
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {useFormik} from 'formik';
import { examinationSchema } from '../../../yupSchema/examinationSchema';
import { date } from 'yup';
import axios from "axios";
import { baseApi } from "../../../environment";

export default function Examinations() {

    const [examinations , setExaminations]=useState([])
    const initialValues = {
      date:"",
      subject:"",
      examType:"",
    }

    
    const Formik = useFormik({
      initialValues:initialValues,
      validationSchema: examinationSchema,
      onSubmit:(value)=>{
        console.log("Examination",value)
      }
    })
    const fetchSubjects = async()=>{
      try {
        const response = await axios.get(`${baseApi}/subject/all`);
        console.log("Examination subjects", response)
      } catch (error) {
        console.log("Error in fetching subjects => Examination component",error)
      }
      //console.log("Subjects", response)
    }


    React.useEffect(()=>{
      fetchSubjects()
    },[])

  return (
    <>
    <paper>

     <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
      >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          boxShadow: 6,
          borderRadius: 4,
          p: 2,
        }}
        >
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "primary.main" }}
            >
            Add New Exam
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
            display="flex"
            flexDirection="column"
            gap={3}
            >
            {/* Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={Formik.values.date ? dayjs(Formik.values.date) : null}
                onChange={(newValue) => Formik.setFieldValue("date", newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(Formik.touched.date && Formik.errors.date),
                    helperText: Formik.touched.date && Formik.errors.date,
                  },
                }}
                />
            </LocalizationProvider>

            {/* Subject */}
              <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Subject</InputLabel>
        <Select
          name="subject"
              label="Subject"
              variant="outlined"
              fullWidth
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Boolean(Formik.touched.subject && Formik.errors.subject)}
              helperText={Formik.touched.subject && Formik.errors.subject}
              >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

            {/* Exam Type */}
            <TextField
              name="examType"
              label="Exam Type"
              variant="outlined"
              fullWidth
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Boolean(Formik.touched.examType && Formik.errors.examType)}
              helperText={Formik.touched.examType && Formik.errors.examType}
              />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                py: 1.2,
              }}
              >
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
              </paper>
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='right'>Exam Date</TableCell>
            <TableCell align="right">Subject</TableCell>
            <TableCell align="right">Exam Type</TableCell>
            <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {examinations.map((examination) => (
            <TableRow
              key={examination.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align='right' component="th" scope="row">
                {examination.name}
              </TableCell>
              <TableCell align="right">{examination.calories}</TableCell>
              <TableCell align="right">{examination.fat}</TableCell>
              <TableCell align="right">{examination.carbs}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
} 