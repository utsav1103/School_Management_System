import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

export default function ExaminationsTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id); // default first class
      }
    } catch (error) {
      console.log("Error in fetching Classes => Examination component", error);
    }
  };

  // Fetch exams of selected class
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
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchExaminations();
  }, [selectedClass]);

  return (
     <Box className="exam-page">
      <Typography variant="h5" className="exam-title">
        📘 Class Examinations
      </Typography>

      {/* Select Class */}
      <FormControl fullWidth sx={{
    mb: 3,
    "& .MuiOutlinedInput-root": {
      color: "#fff", // text color
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.4)", // default border
      },
      "&:hover fieldset": {
        borderColor: "#42a5f5", // border on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#42a5f5", // border when focused (instead of blue)
      },
    },
    "& .MuiInputLabel-root": {
      color: "#aaa", // label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#42a5f5", // label when focused
    },
    "& .MuiSelect-icon": {
      color: "#fff", // dropdown arrow color
    },
    background: "rgba(20,20,20,0.6)", // dark transparent background
    borderRadius: "12px",
  }}>
        <InputLabel id="class-select-label" sx={{
      color: "white !important", // label color
      "&.Mui-focused": { color: "white !important" }, // label on focus
    }}>
          Class
        </InputLabel>
        <Select
          labelId="class-select-label"
          label="Class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          sx={{
      color: "white", // text color
      ".MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.5)", // default border
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white", // hover border
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ff9800", // focus border color (change as you like)
      },
      ".MuiSvgIcon-root": {
        color: "white", // dropdown arrow
      },
      backgroundColor: "rgba(0,0,0,0.4)", // transparent select box
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: "rgba(20,20,20,0.7)", // transparent dark bg
          backdropFilter: "blur(8px)", // glassy effect
          color: "white", // text color
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        },
      },
    }}
        >
          {classes.map((cls) => (
            <MenuItem key={cls._id} value={cls._id}>
              {cls.class_text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
