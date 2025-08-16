import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';



export default function Examinations() {

    const [examinations , setExaminations]=useState([])



  return (
    <>
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
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