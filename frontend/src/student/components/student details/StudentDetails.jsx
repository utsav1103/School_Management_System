import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { baseApi } from "../../../environment";
import { Box, CardMedia, Typography } from "@mui/material";

export default function StudentDetails() {
  const [studentDetails, setStudentDetails] = React.useState(null);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`, {
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
        <Box sx={{ textAlign: "center", mt: 3 }}>
          {/* Student Profile Photo */}
          <CardMedia
            component="img"
            alt="Student"
            image={`/images/uploaded/student/${studentDetails.student_image}`}
            sx={{
              height: 160,
              width: 160,
              margin: "0 auto",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />

          {/* Name below the photo */}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            {studentDetails.name}
          </Typography>

          {/* Student Details Table */}
          <TableContainer
            component={Paper}
            sx={{ mt: 3, maxWidth: 600, margin: "0 auto" }}
          >
            <Table aria-label="student details table">
              <TableBody>
                <TableRow>
                  <TableCell><b>Email :</b></TableCell>
                  <TableCell align="right">{studentDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Age :</b></TableCell>
                  <TableCell align="right">{studentDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Gender :</b></TableCell>
                  <TableCell align="right">{studentDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Guardian :</b></TableCell>
                  <TableCell align="right">{studentDetails.guardian}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Guardian Phone :</b></TableCell>
                  <TableCell align="right">{studentDetails.guardian_phone}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Class :</b></TableCell>
                  <TableCell align="right">
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
