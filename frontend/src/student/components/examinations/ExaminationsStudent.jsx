import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";

export default function ExaminationsStudent() {
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);
  const [className, setClassName] = useState('');  
  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  const fetchExaminations = async () => {
    if (!selectedClass) return;
    try {
      const response = await axios.get(
        `${baseApi}/examination/class/${selectedClass}`
      );
      setExaminations(response.data.examinations || []);
    } catch (error) {
      console.log("Error in fetching Examinations", error);
    }
  };

  

  useEffect(() => {
    fetchExaminations();
  }, [selectedClass]);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`, {
        withCredentials: true, // if using cookies
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if JWT in localStorage
        },
      });

      console.log("student details response", response.data);
      setSelectedClass(response.data.student.student_class._id)  
      setClassName(response.data.student.student_class.class_text)
    } catch (error) {
      console.log("Error in student details", error);
    }
  };

  useEffect(()=>{
    fetchStudentDetails()
  },[])

  // Fetch exams of selected class
  

  return (
     <Box className="exam-page">
      <Typography variant="h5" className="exam-title">
        📘[{className}] Class Examinations
      </Typography>  
      

      {/* Exams Table */}
      <TableContainer component={Paper} className="exam-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" className="exam-head">Exam Date</TableCell>
              <TableCell align="center" className="exam-head">Subject</TableCell>
              <TableCell align="center" className="exam-head">Exam Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.length > 0 ? (
              examinations.map((exam) => (
                <TableRow key={exam._id} className="exam-row">
                  <TableCell align="center" className="exam-cell">
                    {dateFormat(exam.examDate)}
                  </TableCell>
                  <TableCell align="center" className="exam-cell subject-highlight">
                    {exam.subject ? exam.subject.subject_name : ""}
                  </TableCell>
                  <TableCell align="center" className="exam-cell">
                    {exam.examType}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={3} className="exam-cell">
                  No examinations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Styling */}
      <style>
        {`
        .exam-page {
          background: url('/images/dark-wood.jpg');
          background-size: cover;
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .exam-title {
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #fff;
          text-shadow: 0 0 12px rgba(255,255,255,0.5);
        }

        .exam-select {
          color: #fff !important;
        }

        .exam-table {
          background: rgba(20, 20, 20, 0.4) !important;
          backdrop-filter: blur(10px);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 25px rgba(0,0,0,0.7);
        }

        .exam-head {
          background: rgba(40,40,40,0.9) !important;
          color: #f0f0f0 !important;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .exam-row {
          transition: all 0.3s ease;
        }

        .exam-row:hover {
          background: rgba(255,255,255,0.08) !important;
          transform: scale(1.01);
        }

        .exam-cell {
          color: #ddd !important;
          font-size: 1rem;
        }

        .subject-highlight {
          color: #ff9800 !important; /* Highlight subject names */
          font-weight: bold;
        }
      `}
      </style>
    </Box>
  );
}
