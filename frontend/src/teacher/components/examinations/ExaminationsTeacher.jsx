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
//import { baseApi } from "../../../environment";

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
      const response = await axios.get(`/api/class/all`);
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
        `/api/examination/class/${selectedClass}`
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
     <Box>
      <Typography variant="h5"
        sx={{
      textAlign: "center",
      mb: 3,
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: "bold",
      letterSpacing: "1px",
    }}>
        📘 Class Examinations
      </Typography>

      {/* Select Class */}
      <FormControl   sx={{
      minWidth: 200,
      mb: 4, // ⬅️ adds spacing between form and table
      "& .MuiInputLabel-root": {
        color: "#ff9800",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#ff5722",
      },
      "& .MuiOutlinedInput-root": {
        color: "#f5f5f5",
        "& fieldset": {
          borderColor: "rgba(255,255,255,0.3)",
        },
        "&:hover fieldset": {
          borderColor: "#ff9800",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#ff5722",
        },
        "& .MuiSvgIcon-root": {
          color: "#ff9800",
        },
      },
      "& .MuiFormHelperText-root": {
        color: "#ff5722",
      },
    }}>
        <InputLabel >
          Class
        </InputLabel>
        <Select
          labelId="class-select-label"
          label="Class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          
    MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: "#1e1e1e",
            color: "#f5f5f5",
            "& .MuiMenuItem-root": {
              "&:hover": {
                bgcolor: "rgba(255, 152, 0, 0.2)",
              },
              "&.Mui-selected": {
                bgcolor: "rgba(255, 87, 34, 0.3)",
              },
            },
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
      <TableContainer component={Paper}  sx={{
      backgroundColor: "#2b2b2b",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    }}>
        <Table>
          <TableHead>
            <TableRow sx={{
            background: "linear-gradient(90deg, #ff9800, #ff5722)",
          }}>
              <TableCell align="center"  sx={{ color: "#fff", fontWeight: "bold" }}>Exam Date</TableCell>
              <TableCell align="center"  sx={{ color: "#fff", fontWeight: "bold" }}>Subject</TableCell>
              <TableCell align="center"  sx={{ color: "#fff", fontWeight: "bold" }}>Exam Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.length > 0 ? (
              examinations.map((exam) => (
                <TableRow key={exam._id} sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                },
              }}>
                  <TableCell align="center" sx={{ color: "#f5f5f5" }}>
                    {dateFormat(exam.examDate)}
                  </TableCell>
                  <TableCell align="center" sx={{
                  color: "#ffb74d",
                  fontWeight: "bold",
                }}>
                    {exam.subject ? exam.subject.subject_name : ""}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#f5f5f5" }}>
                    {exam.examType}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={3} sx={{ color: "#aaa" }}>
                  No examinations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      
    </Box>
  );
}
