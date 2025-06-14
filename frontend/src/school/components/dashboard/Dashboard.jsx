import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, CardMedia, TextField, Typography } from "@mui/material";
import { baseApi } from "../../../environment";
import { useRef } from "react";
import EditIcon from '@mui/icons-material/Edit';
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
export default function Dashboard() {
  const [school, setSchool] = useState(null);
  const [schoolName, setSchoolName] = useState(null);
  const [edit, setEdit] = useState(false);
  const ref = useRef(false);

 
  //image handling
  const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const addImage = (event) => {
      const file = event.target.files[0];
      setImageUrl(URL.createObjectURL(file));
      setFile(file);
    };
  
    //Reseting image
  
    const fileInputRef = useRef(null);
    const handleClearFile = ()=>{
      if(fileInputRef.current){
        fileInputRef.current.value ='';
      }
      setFile(null);
      setImageUrl(null);
    }
    //message
     const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const handleMessageClose = () => {
  
    setMessage("")
  };
  
    const handleEditSubmit = () => {

      const fd = new FormData();
      fd.append("school_name", schoolName)
       if(file){
        fd.append("image", file, file.name)
       }
       axios.patch(`${baseApi}/school/update`, fd).then(resp => {
         setMessage(resp.data.message)
        setMessageType("success")
        cancelEdit()
        
        
      }).catch(e=>{
        setMessage(e.response.data.message)
        setMessageType("error")
        console.log("Error", e); //error handling 
      })
    }
    const cancelEdit = () => {
      setEdit(false)
      handleClearFile()
    }

  const fetchSchool = async () => {
    try {
      const data = await axios.get(`${baseApi}/school/fetch-single`,)
      const res = await data.data;
        console.log(res)
      if (res?.success === true) {
        setSchool(res.school);
        setSchoolName(res.school.school_name)
      } 
    } catch (error) {
        console.log(error)
    }
  };

  useEffect(() => {
    if (ref.current === false) {
        ref.current = true;
        fetchSchool();
    }
    return () => {
        // controller.abort();
        console.log("Component unmounted! Aborted fetch.");
    };
  },[message]);

  useEffect(() => {
    console.log(school)
  },[school])
  return (
    <>
      <h1>Dashboard</h1>
      {message && 
            <MessageSnackbar message={message} type={messageType} handleClose={handleMessageClose}/>
          }
      {
        edit && <>
          <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
        display: "flex",
        flexDirection: "column",
        width: "50vw",
        minWidth: "230px",
        margin: "auto",
        padding: "1rem",
        backgroundColor: "rgba(94, 213, 242, 0.22)",
      }}
      noValidate
      autoComplete="off"
      >

      <Typography>Add School Picture</Typography>

      <TextField
        type="file"
        inputRef={fileInputRef}
        onChange={(event) => {
          addImage(event);
        }}
        />
      {imageUrl && (
        <Box>
          <CardMedia component={"img"} height={"230px"} image={imageUrl} />
        </Box>
      )}

      <TextField
        label="School Name"
        value={schoolName}
        onChange={(e)=>{
          setSchoolName(e.target.value)
        }}
        />
        <Button variant="outlined" sx={{background:"rgba(94, 213, 242, 0.22)", color:"grey"}} onClick={handleEditSubmit}>Edit</Button>
        <Button variant="outlined" sx={{background:" rgba(94, 213, 242, 0.22)", color:"grey"}} onClick={cancelEdit}>Cancel</Button>
      </Box>
        </>
      }
      {school && (
        <Box
          sx={{
            position:'relative',
            height: "300px",
            width: "100%",
            // frontend\public\images\uploaded\school\716163.png
            background: `url(/images/uploaded/school/${school.school_image})`,
            backgroundSize: "cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3">{school.school_name}</Typography>

          <Box component={'div'} sx={{position: 'absolute', bottom:'10px' , right: '10px', height:'50px', width: '50px'}}>

          <Button variant="outlined" sx={{background: "white", color:'#111', borderRadius:'50%', height:'60px'}} 
          onClick={()=>{setEdit(true)}}><EditIcon/></Button>


          </Box>
        </Box>
      )}
    </>
  );
}
