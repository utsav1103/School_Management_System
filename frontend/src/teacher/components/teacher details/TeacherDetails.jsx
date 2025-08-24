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

export default function TeacherDetails() {
  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/teacher/fetch-single`);

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
        <Box sx={{ textAlign: "center", mt: 3 }}>
          {/* Teacher Profile Photo */}
          <CardMedia
            component="img"
            alt="Teacher"
            image={`/images/uploaded/teacher/${teacherDetails.teacher_image}`} 
            sx={{
              height: 160,
              width: 160,
              margin: "0 auto",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}
          />

          {/* Name below the photo */}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            {teacherDetails.name}
          </Typography>

          {/* Teacher Details Table */}
          <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 600, margin: "0 auto" }}>
            <Table aria-label="teacher details table">
              <TableBody>
                <TableRow>
                  <TableCell><b>Email :</b></TableCell>
                  <TableCell align="right">{teacherDetails.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Age :</b></TableCell>
                  <TableCell align="right">{teacherDetails.age}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Gender :</b></TableCell>
                  <TableCell align="right">{teacherDetails.gender}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Qualifications :</b></TableCell>
                  <TableCell align="right">{teacherDetails.qualification}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
