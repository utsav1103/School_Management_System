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
//import { baseApi } from "../../../environment";

export default function Attendee({classId,handleMessage,message  }) {
  const [teachers, setteachers] = React.useState([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState("");

  const handleSubmit = async () => {
    
    try {
      if(selectedTeacher){
      const response = await axios.patch(`/api/class/update/${classId}`, {
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
        const response = await axios.get(`/api/class/single/${classId}`)
        setAttendee(response.data.data.attendee?response.data.data.attendee:null)
        console.log("single class",response)
      }catch(error){
        console.log("Error",error)
      }
      }
    }

  const fetchteachers = () => {
    axios
      .get(`/api/teacher/fetch-with-query`, { params: {} })
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
    <Box sx={{
        background: `url(/images/dark-wood.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        borderRadius: "16px",
        padding: "20px",
        mt: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
        textAlign: "center",
      }}>
       <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 10px rgba(255,255,255,0.7)",
        }}
      >
        Attendee
      </Typography>

      
        {attendee && <Box sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}>

          <Typography variant="h6" sx={{ color: "#FFD700" }}>Attendee Teacher :</Typography>
          <Typography variant="h6" sx={{ color: "white", textShadow: "0 0 8px rgba(255,255,255,0.6)" }}>{attendee.name}</Typography>

        </Box> }
        
        <FormControl sx={{
          minWidth: 220,
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: "10px",
          "& .MuiInputLabel-root": { color: "white" },
          "& .MuiSelect-select": { color: "white" },
          "& .MuiSvgIcon-root": { color: "white" },
          mb: 3,
        }}>
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
        <Box sx={{ mt: 2 }}>
              <Button variant="contained"
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(135deg, #434343, #000000)",
            color: "white",
            fontWeight: "bold",
            borderRadius: "12px",
            px: 3,
            py: 1,
            boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
            "&:hover": {
              background: "linear-gradient(135deg, #FFD700, #b8860b)",
              color: "black",
              boxShadow: "0 4px 20px rgba(255,215,0,0.6)",
            },
          }}>{attendee?"Change Attendee":"Select Attendee"}</Button>
      
        </Box>

        
    
    </Box>
  );
}
