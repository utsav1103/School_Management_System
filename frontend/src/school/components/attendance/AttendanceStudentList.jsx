import * as React from "react";
import { baseApi } from "../../../environment";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import axios from "axios";
// import {
//   studentEditSchema,
//   studentSchema,
// } from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import Attendee from "./attendee";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function AttendanceStudentList() {
  const [classes, setClasses] = React.useState([]);

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("success");
  const handleMessageClose = () => {
    setMessage("");
  };

  const handleMessage = (message,type)=>{
    setMessageType(type);
    setMessage(message)
  }

  const fetchClasses = () => {
    axios
      .get(`${baseApi}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
      });
  };

  const [params, setParams] = React.useState({});
  const [selectedClass, setSelectedClass]= React.useState(null)
  const handleClass = (e) => {
    setSelectedClass(e.target.value)
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
  };
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const [students, setStudents] = React.useState([]);
  const fetchStudents = () => {
    axios
      .get(`${baseApi}/student/fetch-with-query`, { params })
      .then((resp) => {
        setStudents(resp.data.students)
        fetchAttendanceForStudents(resp.data.students)
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
      });
  };

  const [attendacneData, setAttendanceData] = React.useState({});
  const fetchAttendanceForStudents = async (studentsList) => {
    const attendancePromises = studentsList.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updatedAttendanceData[studentId] = attendancePercentage;
    });
    setAttendanceData(updatedAttendanceData);
  };

  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const response = await axios.get(`${baseApi}/attendance/${studentId}`);
      const attendanceRecords = response.data;
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "Present"
      ).length;
      const attendancePercentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      return { studentId, attendancePercentage };
    } catch (error) {
      console.error(
        `Error fetching attendacne for student ${studentId}:`,
        error
      );
      return { studentId, attendancePercentage: 0 };
    }
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  

  React.useEffect(() => {
    fetchStudents()
  }, [message, params]);

  return (
    <Box
      component={"div"}
      sx={{
        background: "",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100%",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      {message && (
        <MessageSnackbar
          message={message}
          type={messageType}
          handleClose={handleMessageClose}
        />
      )}

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography>Students Attendance</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={4}>
          <Item>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                marginTop: "30px",
                padding: "10px",
              }}
            >
              <TextField
                label="Search"
                onChange={handleSearch}
                variant="outlined"
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Class</InputLabel>
                <Select label="Student Class" onChange={handleClass}>
                  <MenuItem value="">All Students</MenuItem>
                  {classes &&
                    classes.map((x) => (
                      <MenuItem key={x._id} value={x._id}>
                        {x.class_text} ({x.class_num})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

                    <Box>
                      {selectedClass && <Attendee classId={selectedClass} handleMessage={handleMessage} message={message} />}
                    </Box>


          </Item>
        </Grid>
        <Grid size={8}>
          <Item>
            {" "}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Gender</TableCell>
                    <TableCell align="right">Guardian Contact</TableCell>
                    <TableCell align="right">Class</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students &&
                    students.map((student) => (
                      <TableRow
                        key={student._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {student.name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {student.gender}
                        </TableCell>

                        <TableCell align="right">
                          {student.guardian_phone}
                        </TableCell>
                        <TableCell align="right">
                          {student.student_class.class_text}
                        </TableCell>
                        <TableCell align="right">
                          {attendacneData[student._id] !== undefined ? `${attendacneData[student._id].toFixed(2)}%`: "No Data"}
                        </TableCell>
                        <TableCell align="right"><Link to={`/school/attendance/${student._id}`}>Details</Link></TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
