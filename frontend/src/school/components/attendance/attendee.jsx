import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { baseApi } from "../../../environment";

export default function Attendee({classId}) {
  const [teachers, setteachers] = React.useState([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(`${baseApi}/class/update/${classId}`, {
        attendee: selectedTeacher,
      });
      console.log(response, "Submit attendee");
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchteachers = () => {
    axios
      .get(`${baseApi}/teacher/fetch-with-query`, { params: {} })
      .then((resp) => {
        setteachers(resp.data.teachers);
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
      });
  };

  useEffect(() => {
    console.log("Class ID", classId);
    fetchteachers();
  }, [classId]);
  return (
    <>
      <h1>Attendee</h1>

      <Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Teachers</InputLabel>
          <Select
            label="Teacher"
            value={selectedTeacher}
            onChange={(e) => {
              setSelectedTeacher(e.target.value);
            }}
          >
            <MenuItem value="">All Teachers</MenuItem>
            {teachers &&
              teachers.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </>
  );
}
