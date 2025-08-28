import { useEffect } from "react"
import { baseApi } from "../../../environment"
import axios from "axios"
import { useState } from "react"
import { FormControl, InputLabel, MenuItem, Select, Alert } from "@mui/material"

export default  function AttendanceTeacher()
{
    const [classes , setClasses] = useState([])
    const [selectedClass , setSelectedClass] = useState("");
    const [loading , setLoading]= useState(true);
    const fetchAttendeeClass = async () =>{
       
      try {
        const response = await axios.get(`${baseApi}/class/attendee`)
        console.log("attende class response",response)

        
        setClasses(response.data.data)
        
      } catch (error) {
        console.log("Error => fetching attendee class",error)
      } finally{
        setLoading(false);
      }
    };
    useEffect(()=>{
        fetchAttendeeClass()
    },[])

    return (
        <>
        <h1>Attendance Teacher </h1>

        {!loading && classes.length === 0 &&(<Alert severity="warning" sx={{mb:2}}>
          You are not assigned to any class now.
        </Alert>)}
        
        {classes.length > 0 && (

          <FormControl fullWidth variant="outlined">
                    <InputLabel id="class-select-label">Class</InputLabel>
                    <Select
                      labelId="class-select-label"
                      name="subject"
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                      }}
                      value={selectedClass}
                      label="class"
                    >
                      <MenuItem value="">Select Class</MenuItem>
                      {classes.map((x) => (
                        <MenuItem key={x._id} value={x._id}>
                          {x.class_text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

        )}

        
        </>
    )
}