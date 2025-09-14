import * as React from "react";
//import /api} from "../../../environment";
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
      .get(`/api/class/all`)
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
      .get(`/api/student/fetch-with-query`, { params })
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
    const response = await axios.get(`/api/attendance/${studentId}`);
    
    // FIX: use response.data.attendance instead of response.data
    const attendanceRecords = response.data.attendance || [];
    
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (record) => record.status === "Present"
    ).length;

    const attendancePercentage =
      totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    return { studentId, attendancePercentage };
  } catch (error) {
    console.error(
      `Error fetching attendance for student ${studentId}:`,
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
        background: `url(/images/dark-wood.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "20px",
      }}
>
  {message && (
    <MessageSnackbar
      message={message}
      type={messageType}
      handleClose={handleMessageClose}
    />
  )}

  {/* Page Heading */}
  <Typography
        variant="h4"
        sx={{
          textAlign:"center",
      mb: 2,
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
      >
        Students Attendance
      </Typography>
  
  <Box
    component="div"
    sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
  >
    <TextField
      label="Search"
      onChange={handleSearch}
      variant="outlined"
      sx={{
    input: { color: "#fff" }, // input text color

    "& .MuiInputLabel-root": {
      color: "#ff9800", // default label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722", // focused label color
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.3)", // default border
      },
      "&:hover fieldset": {
        borderColor: "#ff9800", // hover border
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ff5722", // focused border
      },
    },

    "& .MuiFormHelperText-root": {
      color: "#ff5722", // helper text color
    },
  }}
    />

    <FormControl sx={{
      minWidth: 200,
    "& .MuiInputLabel-root": {
      color: "#ff9800", // default label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722", // focused label
    },
    "& .MuiOutlinedInput-root": {
      color: "#f5f5f5", // selected text
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
        color: "#ff9800", // dropdown arrow
      },
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722",
    },
  }}>
      <InputLabel >Class</InputLabel>
      <Select label="Student Class" onChange={handleClass}  
      MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: "#1e1e1e", // dropdown background
          color: "#f5f5f5", // dropdown text
          "& .MuiMenuItem-root": {
            "&:hover": {
              bgcolor: "rgba(255, 152, 0, 0.2)", // hover effect
            },
            "&.Mui-selected": {
              bgcolor: "rgba(255, 87, 34, 0.3)", // selected item
            },
          },
        },
      },
    }}>
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
  {/* attendee*/ }
  {selectedClass && (
    <Box sx={{ mb: 3, textAlign: "center" }}>
      <Attendee
        classId={selectedClass}
        handleMessage={handleMessage}
        message={message}
      />
    </Box>
  )}

  {/* attendance table */}
  <Box sx={{
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          p: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
        }}>
<TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
    <Table sx={{ minWidth: 650 }} aria-label="attendance table">
      <TableHead>
        <TableRow sx={{ background: "rgba(255,255,255,0.05)" }}>
          <TableCell sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}><strong>Name</strong></TableCell>
          <TableCell sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }} align="right"><strong>Gender</strong></TableCell>
          <TableCell sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }} align="right"><strong>Guardian Contact</strong></TableCell>
          <TableCell sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }} align="right"><strong>Class</strong></TableCell>
          <TableCell sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }} align="right"><strong>Percentage</strong></TableCell>
          <TableCell sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }} align="right"><strong>View</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students &&
          students.map((student) => (
            <TableRow
              key={student._id}
              sx={{
                    "&:hover": { background: "rgba(255,215,0,0.08)" },
                  }}
            >
              <TableCell sx={{ color: "white" }}>{student.name}</TableCell>
              <TableCell align="right" sx={{ color: "white" }}>{student.gender}</TableCell>
              <TableCell align="right" sx={{ color: "white" }}>{student.guardian_phone}</TableCell>
              <TableCell align="right" sx={{ color: "white" }}>{student.student_class.class_text}</TableCell>
              <TableCell align="right"  sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #ff9800, #ff5722)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {attendacneData[student._id] !== undefined
                  ? `${attendacneData[student._id].toFixed(2)}%`
                  : "No Data"}
              </TableCell>
              <TableCell align="right">
                <Link to={`/school/attendance/${student._id}`}  style={{
      color: "#ff9800", // solid orange for differentiation
      fontWeight: "bold",
      textDecoration: "none",
    }}
    onMouseEnter={(e) => (e.target.style.color = "#ff5722")}
    onMouseLeave={(e) => (e.target.style.color = "#ff9800")}>Details</Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>
  </Box>
  
</Box>

  );
}
