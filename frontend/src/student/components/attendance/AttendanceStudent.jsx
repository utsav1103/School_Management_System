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
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
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


  const getColor = () => {
  if (percentage >= 75) return "#4ade80";   // Tailwind's green-400 (light green, glows on dark)
  if (percentage >= 50) return "#facc15";   // Tailwind's yellow-400 (bright gold, looks good on dark)
  return "#f87171";                         // Tailwind's red-400 (light red, stands out)
};

    return (
        <>
        <h1>Your Attendance Details</h1>



 <Grid container spacing={2}>
        {/* Pie Chart Section */}
        <Grid item xs={12} md={6}>
          <Item>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: present, label: 'Present',color:getColor() },
                    { id: 1, value: absent, label: 'Absent',color:"#94a3b8" },
                  ],
                },
              ]}
              width={250}
              height={250}
            />

            {/* ✅ Percentage below chart */}
            <Typography variant="h6" sx={{ 
    mt: 2, 
    color: getColor(), 
    fontSize: "20px", 
    fontWeight: "bold" 
  }}>
              Attendance: {percentage}%
            </Typography>
          </Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((attendance) => (
                    <TableRow key={attendance._id}>
                      <TableCell component="th" scope="row">
                        {convertDate(attendance.date)}
                      </TableCell>
                      <TableCell align="right">{attendance.status}</TableCell>
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