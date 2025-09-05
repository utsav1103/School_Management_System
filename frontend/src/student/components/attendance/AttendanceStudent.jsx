import axios from "axios"
import { useEffect, useState } from "react"
import { baseApi } from "../../../environment"

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PieChart } from '@mui/x-charts/PieChart';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(20,20,20,0.85)", // 🔥 dark background
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: theme.spacing(2),
  textAlign: "center",
  color: "white",
  boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
}));


export default function AttendanceStudent(){

const [present, setPresent]=useState(0);
const [absent, setAbsent]=useState(0);
const [studentId, setStudentId] = useState(null);
const [attendanceData , setAttendanceData] = useState([])
// const navigate = useNavigate()


const convertDate = (dateData)=>{
    const date = new Date(dateData)
    return date.getDate() + "-" + (+date.getMonth()+1) + "-" + date.getFullYear();
}

    const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`, {
        withCredentials: true, // if using cookies
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if JWT in localStorage
        },
      });

      console.log("student details response", response.data);
      setStudentId(response.data.student._id)  
    } catch (error) {
      console.log("Error in student details", error);
    }
  };

  useEffect(()=>{
    fetchStudentDetails()
  },[])

    const fetchAttendanceData = async () => {
  try {
    const response = await axios.get(`${baseApi}/attendance/${studentId}`);
    console.log("Response Attendance", response.data);

    // Use the attendance array inside the object
    const records = response.data.attendance || [];
    setAttendanceData(records);

    let presentCount = 0, absentCount = 0;
    records.forEach((a) => {
      if (a.status === "Present") presentCount++;
      else if (a.status === "Absent") absentCount++;
    });

    setPresent(presentCount);
    setAbsent(absentCount);
  } catch (error) {
    console.log("Error in fetching student attendance.", error);
    // navigate("/school/attendance");
  }
};

    useEffect(()=>{
        if(studentId) {

            fetchAttendanceData()
        }

    },[studentId]);

    const total = present + absent;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;


//   const getColor = () => {
//   if (percentage >= 75) return "#4ade80";   // Tailwind's green-400 (light green, glows on dark)
//   if (percentage >= 50) return "#facc15";   // Tailwind's yellow-400 (bright gold, looks good on dark)
//   return "#f87171";                         // Tailwind's red-400 (light red, stands out)
// };

    return (
        <>
       <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 3,
          fontWeight: "bold",
          background: "linear-gradient(90deg, #ff9800, #ff5722)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        📊 Your Attendance Details
      </Typography>



 <Grid container spacing={3}>
        {/* Pie Chart Section */}
        <Grid item xs={12} md={6}>
          <Item>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: present, label: "Present", color: "#ff9800" }, // orange
                    { id: 1, value: absent, label: "Absent", color: "#9e9e9e" },  // grey
                  ],
                  
                },
              ]}
              
              width={320}
              height={320}
              slotProps={{
    legend: {
      direction: "column", // or "row"
      labelStyle: { fontSize: 14, fontWeight: "bold" }, // size/weight
    },
  }}
                sx={{
    // 🔥 force legend labels to be white
    "& .MuiChartsLegend-label": {
      fill: "white !important", 
      color: "white !important",
      fontWeight: "bold",
    },
  }}
            />

            {/* ✅ Percentage below chart */}
            <Typography variant="h6" sx={{ 
    mt: 2, 
    color: "#ff9800", 
    fontSize: "20px", 
    fontWeight: "bold" 
  }}>
              Attendance: {percentage}%
            </Typography>
          </Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Item>
            <TableContainer component={Paper} sx={{
                background: "transparent", // remove white background
                boxShadow: "none",
              }}>
              <Table sx={{minWidth:400}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell  sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>Date</TableCell>
                    <TableCell  sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }} align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((attendance) => (
                    <TableRow key={attendance._id}>
                      <TableCell sx={{ color: "white" }}>
                        {convertDate(attendance.date)}
                      </TableCell>
                      <TableCell align="right" sx={{
                          color: attendance.status === "Present" ? "#ff9800" : "#9e9e9e",
                          fontWeight: "bold",
                        }}>{attendance.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
        
      </Grid>


      
        </>
    )
}