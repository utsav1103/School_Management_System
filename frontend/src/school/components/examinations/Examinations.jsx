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
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          maxWidth: 400,
          mx: "auto",
          mt: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: "#333", textAlign: "center" }}
        >
          Select Class
        </Typography>

        <Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              name="subject"
              onChange={(e) => {
                setSelectedClass(e.target.value);
              }}
              value={selectedClass}
              error={Boolean(Formik.touched.subject && Formik.errors.subject)}
              label="class"
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
        sx={{ m: 2 }}
        onClick={() => {
          setShowForm(true);
          setEditId(null); // make sure it's in add mode, not edit
          Formik.resetForm(); // clear previous values
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
              {editId ? (
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Edit Exam
                </Typography>
              ) : (
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "primary.main" }}
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
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {/* Subject */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
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
                      helperText={
                        Formik.touched.subject && Formik.errors.subject
                      }
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
                    helperText={
                      Formik.touched.examType && Formik.errors.examType
                    }
                  />

                  {/* Submit Button */}
                  {/* Cancel Button */}
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
                    {editId ? "Update" : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleEditCancel}
                    size="large"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      py: 1.2,
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Exam Date</TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">Exam Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination) => (
              <TableRow
                key={examination._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right" component="th" scope="row">
                  {dateFormat(examination.examDate)}
                </TableCell>
                <TableCell align="right">
                  {examination.subject ? examination.subject.subject_name : ""}
                </TableCell>
                <TableCell align="right">{examination.examType}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => {
                      handleEdit(examination._id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
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
