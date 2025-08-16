import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
//date
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {useFormik} from 'formik';
import { examinationSchema } from '../../../yupSchema/examinationSchema';
import { date } from 'yup';

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

  return (
    <>
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"

    >

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
        {Formik.touched.date && Formik.errors.date && (<p style={{color:"orange",textTransform:"capitalize"}}>{Formik.errors.date}</p>)}
      
      <TextField name='subject' label="Subject" variant="filled" />
      {Formik.touched.subject && Formik.errors.subject && (<p style={{color:"orange",textTransform:"capitalize"}}>{Formik.errors.subject}</p>)}
      <TextField name='examType' onChange={Formik.handleChange} onBlur={Formik.handleChange} label="Exam Type" variant="standard" />
      {Formik.touched.examType && Formik.errors.examType && (<p style={{color:"orange",textTransform:"capitalize"}}>{Formik.errors.examType}</p>)}
   
      <Button type='submit' variant='contained'>Submit</Button>

    </Box>
    
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