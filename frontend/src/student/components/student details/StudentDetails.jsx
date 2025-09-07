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

export default function StudentDetails() {
  const [studentDetails, setStudentDetails] = React.useState(null);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`/api/student/fetch-single`, {
        withCredentials: true, // if using cookies
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if JWT in localStorage
        },
      });

      console.log("student details response", response.data);
      setStudentDetails(response.data.student);
    } catch (error) {
      console.log("Error in student details", error);
    }
  };

  React.useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <>
      {studentDetails && (
        <Box  sx={{
            textAlign: "center",
            mt: 5,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          {/* Student Profile Photo */}
          <CardMedia
            component="img"
            alt="Student"
            image={`/images/uploaded/student/${studentDetails.student_image}`}
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
            {studentDetails.name}
          </Typography>

          {/* Student Details Table */}
          <TableContainer
            component={Paper}
             sx={{
              mt: 4,
              maxWidth: 650,
              width: "100%",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              color: "white",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}>Email :</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{studentDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}>Age :</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{studentDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}>Gender :</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{studentDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}>Guardian :</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{studentDetails.guardian}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}>Guardian Phone :</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>{studentDetails.guardian_phone}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: "#ff9800", fontWeight: "bold" }}>Class :</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    {studentDetails.student_class.class_text}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
