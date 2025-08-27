import { useEffect } from "react"
import { baseApi } from "../../../environment"
import axios from "axios"
import { useState } from "react"

export default  function AttendanceTeacher()
{
    const [classes , setClasses] = useState([])

    const fetchAttendeeClass = async () =>{
      
      try {
        const response = await axios.get(`${baseApi}/class/attendee`)
        console.log("attende class response",response)
        
      } catch (error) {
        console.log("Error => fetching attendee class",error)
      }
    }
    useEffect(()=>{
        fetchAttendeeClass()
    },[])

    return (
        <>
        <h1>Attendance Teacher </h1>
        </>
    )
}