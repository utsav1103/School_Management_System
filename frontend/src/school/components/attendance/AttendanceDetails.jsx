import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//import { baseApi } from "../../../environment";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Box, styled, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PieChart } from "@mui/x-charts/PieChart";

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

export default function AttendanceDetails() {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  const [attendanceData, setAttendanceData] = useState([]);
  const studentId = useParams().id;
  const navigate = useNavigate();

  const convertDate = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + "-" + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`/api/attendance/${studentId}`);
      console.log("Response Attendance", response.data);

      // Use the attendance array inside the object
      const records = response.data.attendance || [];
      setAttendanceData(records);

      let presentCount = 0,
        absentCount = 0;
      records.forEach((a) => {
        if (a.status === "Present") presentCount++;
        else if (a.status === "Absent") absentCount++;
      });

      setPresent(presentCount);
      setAbsent(absentCount);
    } catch (error) {
      console.log("Error in fetching student attendance.", error);
      navigate("/school/attendance");
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const total = present + absent;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

  const getColor = () => {
    if (percentage >= 75) return "#fde047"; 
    if (percentage >= 50) return "#facc15";  
    return "#f87171"; 
  };

  return (
    <Box
      sx={{
        background: `url(/images/dark-wood.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 10px rgba(255,255,255,0.6)",
        }}
      >
        Attendance Details
      </Typography>

      <Grid container spacing={3}>
        {/* Pie Chart Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              p: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
              textAlign: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: present,
                      label: "Present",
                      color: getColor(),
                    },
                    { id: 1, value: absent, label: "Absent", color: "#94a3b8" },
                  ],
                },
              ]}
              width={250}
              height={250}
              slotProps={{
  legend: {
    sx: {
      color: 'white',
      fontSize: 14,

      // Customize the mark (icon) color
      [`.MuiChartsLegend-mark`]: {
        fill: 'white',
      },
    },
  },
}}
            />
            {/* ✅ Percentage below chart */}
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                color: getColor(),
                fontSize: "20px",
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(0,0,0,0.8)",
              }}
            >
              Attendance: {percentage}%
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  <TableRow>
                    <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell align="right" sx={{ color: "#FFD700", fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {attendanceData.map((attendance) => (
                    <TableRow key={attendance._id} sx={{
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                      }}>
                      <TableCell sx={{ color: "white !important" }}>
                        {convertDate(attendance.date)}
                      </TableCell>
                      <TableCell align="right" sx={{
              color:
                attendance.status === "Present"
                  ? "#facc15 !important" 
                  : "#f87171 !important", 
              fontWeight: "bold",
            }}>{attendance.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
