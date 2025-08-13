import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";

export default function Attendee({classId,handleMessage,message  }) {
  const [teachers, setteachers] = React.useState([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState("");

  const handleSubmit = async () => {
    
    try {
      if(selectedTeacher){
      const response = await axios.patch(`${baseApi}/class/update/${classId}`, {
        attendee: selectedTeacher,
      }); 
      console.log(response, "Submit attendee");
      handleMessage("Successfully attendee save",'success ');
    }else{
      alert("Please select a teacher... ")
    }
      } catch (error) {
      console.log("Error", error);
    }
  };

  const [attendee, setAttendee] = useState(null)
  const fetchClassDetails = async ()=>{
      if(classId){
      try{
        const response = await axios.get(`${baseApi}/class/single/${classId}`)
        setAttendee(response.data.data.attendee?response.data.data.attendee:null)
        console.log("single class",response)
      }catch(error){
        console.log("Error",error)
      }
      }
    }

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
    fetchClassDetails()
    fetchteachers();
  }, [classId , message]);
  return (
    <>
      <h1>Attendee</h1>

      <Box>
        {attendee && <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}} component={'div'}>

          <Typography variant="h6">Attendee Teacher :</Typography>
          <Typography variant="h6">{attendee.name}</Typography>

        </Box> }
        
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

        <Button onClick={handleSubmit}>{attendee?"Change Attendee":"Select Attendee"}</Button>
      </Box>
    </>
  );
}
