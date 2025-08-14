import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { baseApi } from "../../../environment"

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PieChart } from '@mui/x-charts/PieChart';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function AttendanceDetails(){

const [present, setPresent]=useState(0);
const [absent, setAbsent]=useState(0);

const [attendanceData , setAttendanceData] = useState([])
const studentId = useParams().id;
const navigate = useNavigate()


const convertDate = (dateData)=>{
    const date = new Date()
    return date.getDate() + "-" + (+date.getMonth()+1) + "-" + date.getFullYear();
}
    const fetchAttendanceData = async()=>{
        try{
        const response = await axios.get(`${baseApi}/attendance/${studentId}`)
        console.log("Response Attendance",response)
            setAttendanceData(response.data)

            response.data.forEach(attendacne=>{
              if(attendacne.status==='Present'){
                setPresent(present+1)
              }else if(attendacne.status==='Absent'){
                setAbsent(absent+1)
              }
            })
        }catch(error){
            console.log("Error in fetchng student attendance.", error)

            navigate('/school/attendance')
        }
    }
    useEffect(()=>{
        
        fetchAttendanceData()

    },[])

    return (
        <>
        <h1>Attendance Details</h1>



        <Grid container spacing={2}>
        <Grid size={6}>
          <Item>  <PieChart
      series={[
        {
          data: [
            { id: 0, value: present, label: 'Present' },
            { id: 1, value: absent, label: 'Absent' },
            ],
        },
      ]}
      width={200}
      height={200}
    /></Item>
        </Grid>
        <Grid size={6}>
          <Item>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((attendacne) => (
            <TableRow
              key={attendacne._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {convertDate(attendacne.date)}
              </TableCell>
              <TableCell align="right">{attendacne.status}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </Item>
        </Grid>
        
      </Grid>


      
        </>
    )
}