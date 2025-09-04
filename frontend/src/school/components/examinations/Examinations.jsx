import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
  selectClasses,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
//date
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { examinationSchema } from "../../../yupSchema/examinationSchema";
import { date } from "yup";
import axios from "axios";
import { baseApi } from "../../../environment";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";

export default function Examinations() {
  const [examinations, setExaminations] = useState([]);

  const [subjects, setSubjects] = React.useState([]);

  const [classes, setClasses] = React.useState([]);

  const [selectedClass, setSelectedClass] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = useState("success");
  const [editId, setEditId] = React.useState(null);
  const handleMessageClose = () => {
    setMessage("");
  };
  const handleMessageNew = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();
    return (
      date.getDate() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShowForm(true);
    const selectedExamination = examinations.filter((x) => x._id === id);
    if (selectedExamination) {
      Formik.setFieldValue("date", selectedExamination[0].examDate);
      Formik.setFieldValue("subject", selectedExamination[0].subject._id);
      Formik.setFieldValue("examType", selectedExamination[0].examType);
    }
    //Formik.setFieldValue("date", selectedExamination[0].examDate);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure ??")) {
      try {
        const response = await axios.delete(
          `${baseApi}/examination/delete/${id}`
        );
        console.log("Delete response", response);
        setMessage(response.data.message);
        setMessageType("success");
      } catch (error) {
        setMessage("Error in deleting examination");
        setMessageType("error");
        console.log("Error => Deleting examianiton", error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    Formik.resetForm();
    setShowForm(false);
  };

  const initialValues = {
    date: "",
    subject: "",
    examType: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (value) => {
      try {
        let URL = `${baseApi}/examination/create`;
        if (editId) {
          URL = `${baseApi}/examination/update/${editId}`;
        }
        //console.log("Examination", value);
        const response = await axios.post(URL, {
          date: value.date,
          subjectId: value.subject,
          classId: selectedClass,
          examType: value.examType,
        });
        //console.log("RESPONSE NEW EXAMINSTION", response);
        setMessage(response.data.message);
        setMessageType("success");
        Formik.resetForm();
        setEditId(null);
        setShowForm(false);
      } catch (error) {
        setMessage("Error in saving new examination");
        setMessageType("error");
        console.log("Error in saving new data => Examination component", error);
      }
    },
  });
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`);
      setSubjects(response.data.data);
    } catch (error) {
      console.log("Error in fetching subjects => Examination component", error);
    }
    //console.log("Subjects", response)
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      setSelectedClass(response.data.data[0]._id);
    } catch (error) {
      console.log("Error in fetching Classes => Examination component", error);
    }
    //console. ("Subjects", response)
  };

  const fetchExaminations = async () => {
    try {
      if (selectedClass) {
        //console.log("Selected Class in fetchExaminations:", selectedClass);

        const response = await axios.get(
          `${baseApi}/examination/class/${selectedClass}`
        );
        const data = await response.data.examinations;
        //console.log(data)
        //
        console.log(response);
        setExaminations(data);
      }
    } catch (error) {
      console.log(
        "Error in fetching Examinations => Examination component",
        error
      );
      throw error;
    }
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  React.useEffect(() => {
    if (selectedClass?.length !== 0) fetchExaminations();
    fetchSubjects();
    //fetchClasses();
  }, [message, selectedClass]);

  return (
    <>
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={handleMessageClose}
        />
      )}

      <Paper
        elevation={4}
         sx={{
    p: 3,
    borderRadius: 3,
    background: "rgba(0, 0, 0, 0.7)", // semi-transparent dark background
    backdropFilter: "blur(6px)", // glass effect
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.6)",
    maxWidth: 400,
    mx: "auto",
    mt: 4,
    color: "white",
  }}
      >
        <Typography
          variant="h5"
           sx={{
      mb: 2,
      fontWeight: "bold",
      color: "#ff9800", // warm orange for contrast
      textAlign: "center",
      textShadow: "0 0 8px rgba(255,152,0,0.7)", // glowing title
    }}
        >
          Select Class
        </Typography>

        <Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="class-select-label"  sx={{ color: "#fff" }}>Class</InputLabel>
            <Select
              labelId="class-select-label"
              name="subject"
              onChange={(e) => {
                setSelectedClass(e.target.value);
              }}
              value={selectedClass}
              error={Boolean(Formik.touched.subject && Formik.errors.subject)}
              label="class"
              sx={{
          color: "#fff",
          ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ff9800" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ff5722" },
          ".MuiSvgIcon-root": { color: "#fff" },
        }}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.class_text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {Formik.touched.subject && Formik.errors.subject && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block", textAlign: "center" }}
            >
              {Formik.errors.subject}
            </Typography>
          )}
        </Box>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        sx={{
    m: 2,
    px: 3,
    py: 1.2,
    fontWeight: "bold",
    fontSize: "1rem",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #ff9800, #ff5722)", // warm orange gradient
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    textTransform: "none", // keep normal casing
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(90deg, #2a5298, #1e3c72)", // shifts to deep blue gradient
      transform: "translateY(-2px) scale(1.05)", // slight pop effect
      boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
    },
  }} onClick={() => {
    setShowForm(true);   // ✅ show the form
    setEditId(null);     // ✅ reset to add mode
    Formik.resetForm();  // ✅ clear old values
  }}
      >
        Add Exam
      </Button>

      <paper>
        {showForm && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
             sx={{
        background: "transparent", // ✅ remove white background, let wood show
        backdropFilter: "blur(6px)", // ✅ frosted glass effect
      }}
          >
            <Card
              sx={{
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)", // ✅ strong depth
          borderRadius: 4,
          p: 2,
          background: "rgba(30, 30, 30, 0.85)", // ✅ semi-transparent dark card
          border: "1px solid rgba(255,255,255,0.1)", // ✅ subtle glowing border
        }}
            >
              {editId ? (
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
              color: "white",
              textShadow: "0px 2px 6px rgba(255, 193, 7, 0.7)", // ✅ golden glow
            }}                                               
                >
                  Edit Exam
                </Typography>
              ) : (
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontWeight="bold"
                  gutterBottom
                   sx={{
              color: "white",
              textShadow: "0px 2px 6px rgba(255, 193, 7, 0.7)",
            }}
                >
                  Add New Exam
                </Typography>
              )}
              <CardContent>
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
                      value={
                        Formik.values.date ? dayjs(Formik.values.date) : null
                      }
                      onChange={(newValue) =>
                        Formik.setFieldValue("date", newValue)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: Boolean(
                            Formik.touched.date && Formik.errors.date
                          ),
                          helperText: Formik.touched.date && Formik.errors.date,
                          sx: {
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: 2,
                      input: { color: "white" },
                      label: { color: "white" },
                    },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {/* Subject */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "white" }}>
                      Subject
                    </InputLabel>
                    <Select
                      name="subject"
                      label="Subject"
                      value={Formik.values.subject}
                      variant="outlined"
                      fullWidth
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      error={Boolean(
                        Formik.touched.subject && Formik.errors.subject
                      )}
                       sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  color: "white",
                }}
                    >
                      <MenuItem value={""}>Select Subject</MenuItem>
                      {subjects.map((subject) => {
                        return (
                          <MenuItem key={subject._id} value={subject._id}>
                            {subject.subject_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  {/* Exam Type */}
                  <TextField
                    name="examType"
                    label="Exam Type"
                    variant="outlined"
                    value={Formik.values.examType}
                    fullWidth
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                    error={Boolean(
                      Formik.touched.examType && Formik.errors.examType
                    )}
                     sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                input: { color: "white" },
                label: { color: "white" },
              }}
                    
                  />

                  {/* Submit Button */}
                  {/* Cancel Button */}
                  <Button
                    type="submit"
                    size="large"
                    sx={{
                mt: 2,
                borderRadius: 3,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                py: 1.2,
                background: "linear-gradient(90deg, #ff9800, #ff5722)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(90deg, #2a5298, #1e3c72)",
                  transform: "translateY(-2px) scale(1.05)",
                },
              }}
                  >
                    {editId ? "Update" : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleEditCancel}
                    size="large"
                    sx={{
                mt: 2,
                borderRadius: 3,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                py: 1.2,
                border: "2px solid #ff9800",
                color: "#ff9800",
                "&:hover": {
                  background: "rgba(255,152,0,0.1)",
                  transform: "translateY(-2px) scale(1.05)",
                },
              }}
                  >
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </paper>

      <TableContainer component={Paper} sx={{
    mt: 4,
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.35)",
    background: "rgba(0,0,0,0.6)",
  }}>
        <Table>
          <TableHead>
            <TableRow sx={{
          background: "linear-gradient(90deg, #ff9800, #ff5722)", // 🔥 orange gradient
        }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }} align="right">Exam Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }} align="right">Subject</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }} align="right">Exam Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination, index) => (
              <TableRow
                key={examination._id}
                 sx={{
            backgroundColor:
              index % 2 === 0
                ? "rgba(255, 255, 255, 0.05)" // subtle dark gray
                : "rgba(255, 152, 0, 0.15)", // light orange tint
            transition: "all 0.3s ease",
            "&:hover": { backgroundColor: "rgba(255, 87, 34, 0.25)" }, // 🔥 deeper orange hover
          }}
              >
                <TableCell align="center" sx={{ color: "white" }}>
                  {dateFormat(examination.examDate)}
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  {examination.subject ? examination.subject.subject_name : ""}
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>{examination.examType}</TableCell>
                <TableCell align="center">
                  <Button variant="contained"
              sx={{
                mr: 1,
                py: 0.5,
                px: 2,
                borderRadius: 2,
                fontSize: "0.85rem",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #ff9800, #ff5722)",
                "&:hover": { background: "linear-gradient(90deg, #2a5298, #1e3c72)" },
              }}
                    onClick={() => {
                      handleEdit(examination._id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="contained"
              sx={{
                py: 0.5,
                px: 2,
                borderRadius: 2,
                fontSize: "0.85rem",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #e53935, #b71c1c)",
                "&:hover": { background: "linear-gradient(90deg, #c62828, #8e0000)" },
              }}
                    onClick={() => {
                      handleDelete(examination._id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
