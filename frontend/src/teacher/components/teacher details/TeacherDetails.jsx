import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
//import { baseApi } from "../../../environment";
import { Box, CardMedia, Typography } from "@mui/material";

export default function TeacherDetails() {
  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`/api/teacher/fetch-single`);

      console.log("teacher details response", response.data);
      setTeacherDetails(response.data.teacher)
    } catch (error) {
      console.log("Error in teacher details", error);
    }
  };
  const [teacherDetails, setTeacherDetails] = React.useState(null);

  React.useEffect(() => {
    fetchTeacherDetails();
  }, []);

  return (
    <>
      {teacherDetails && (
        <Box   sx={{
            textAlign: "center",
            mt: 5,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }} >
          {/* Teacher Profile Photo */}
          <CardMedia
            component="img"
            alt="Teacher"
            image={`/images/uploaded/teacher/${teacherDetails.teacher_image}`} 
            sx={{
              height: 250,
              width: 250,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
              border: "4px solid #ff9800",
            }}
          />

          {/* Name below the photo */}
          <Typography variant="h6"  sx={{
              mt: 3,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "capitalize",
            }}>
            {teacherDetails.name}
          </Typography>

          {/* Teacher Details Table */}
          <TableContainer component={Paper} sx={{
              mt: 4,
              maxWidth: 650,
              width: "100%",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              color: "white",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}><b>Email :</b></TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{teacherDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell  sx={{ color: "#ff9800", fontWeight: "bold" }}><b>Age :</b></TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{teacherDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}><b>Gender :</b></TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{teacherDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}><b>Qualifications :</b></TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{teacherDetails.qualification}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
