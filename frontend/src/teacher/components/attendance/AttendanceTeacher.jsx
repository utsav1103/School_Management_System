import { useEffect, useState } from "react";
//import { baseApi } from "../../../environment";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Button,
  Snackbar,
 Alert as MuiAlert,
} from "@mui/material";


const MessageSnackbar = ({ message, type, open, handleClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={handleClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <MuiAlert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
      {message}
    </MuiAlert>
  </Snackbar>
);

export default function AttendanceTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: true/false }
  const [saving, setSaving] = useState(false);
  const [attendanceTaken, setAttendanceTaken] = useState(false);


  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleMessageClose = () => setOpenSnackbar(false);

  const fetchAttendeeClass = async () => {
    try {
      const response = await axios.get(`/api/class/attendee`);
      console.log("attende class response", response);
      setClasses(response.data.data || []);
    } catch (error) {
      console.log("Error => fetching attendee class", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }

    axios
      .get(`/api/student/fetch-with-query`, {
        params: { student_class: classId },
      })
      .then((resp) => {
        setStudents(resp.data.students || []);
        setAttendance({}); // reset attendance when class changes
        console.log("student response", resp);
      })
      .catch((e) => {
        console.log("error in fetching students", e);
      });
  };

  useEffect(() => {
    fetchAttendeeClass();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setAttendanceTaken(false);
    fetchStudents(selectedClass);

     axios
    .get(`/api/attendance/check/${selectedClass}`)
    .then((resp) => {
      setAttendanceTaken(resp.data.attendanceTaken);
      if (resp.data.attendanceTaken) {
      setMessage("Attendance for this class has already been taken today ✅");
          setMessageType("info");
          setOpenSnackbar(true);  
      }
    })
    .catch((e) => {
       console.log("Error checking attendance:", e);
        setMessage("Error checking attendance ❌");
        setMessageType("error");
        setOpenSnackbar(true);
      });
  }, [selectedClass]);

  const handleAttendanceChange = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const saveAttendance = async () => {
    if (!selectedClass) return;

    setSaving(true);
    try {
      const payload = {
        classId: selectedClass,
        attendance: students.map((s) => ({
          studentId: s._id,
          present: attendance[s._id] || false,
        })),
      };

      const resp = await axios.post(`/api/attendance/mark`, payload);
       setMessage(resp.data.message || "Attendance saved successfully ✅");
      setMessageType("success");
      setOpenSnackbar(true);} 
      catch (error) {
      console.error("Error saving attendance", error);
      setMessage("Failed to save attendance ❌");
      setMessageType("error");
      setOpenSnackbar(true);} 
      finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1>Attendance Teacher</h1>

      {!loading && classes.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are not assigned to any class now.
        </Alert>
      )}

      {!loading && classes.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          ✅ You are attendee of <strong>{classes.length}</strong> class
          {classes.length > 1 ? "es" : ""}:{" "}
          {classes.map((c) => c.class_text).join(", ")}
        </Alert>
      )}

      {classes.length > 0 && (
        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel id="class-select-label">Class</InputLabel>
          <Select
            labelId="class-select-label"
            onChange={(e) => setSelectedClass(e.target.value)}
            value={selectedClass}
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
      )}

      {/* Students Table */}
      {students.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Students of {classes.find((c) => c._id === selectedClass)?.class_text}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance[student._id] || false}
                        onChange={() => handleAttendanceChange(student._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

           <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={saveAttendance}
            disabled={saving || attendanceTaken}
          >
            {attendanceTaken ? "Attendance Already Taken ✅" : saving ? "Saving..." : "Save Attendance"}
          </Button>
        </>
      )}
       {message && (
        <MessageSnackbar
          message={message}
          type={messageType}
          open={openSnackbar}
          handleClose={handleMessageClose}
        />
      )}
    </>
  );
}
