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

  return (
    <Box sx={{
    background: `url(/images/dark-wood.jpg)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    p: { xs: 2, md: 4 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)", // dark overlay
      zIndex: 0,
    },
    "& > *": {
      position: "relative",
      zIndex: 1, // make children appear above overlay
    },
  }}
    >
      <Typography
        variant="h3"
         sx={{
    textAlign: "center",
    mb: 3,
    fontWeight: "bold",
    background: "linear-gradient(90deg, #ff9800, #ff5722)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textTransform: "uppercase",
    letterSpacing: "2px",}}
      >
        Dashboard
      </Typography>
      {message && 
            <MessageSnackbar message={message} type={messageType} handleClose={handleMessageClose}/>
          }
      {edit && (
        <Box
          component="form"
          sx={{
      "& > :not(style)": { m: 1 },
      display: "flex",
      flexDirection: "column",
      width: "50vw",
      minWidth: "260px",
      margin: "auto",
      padding: "2rem",
      background: "rgba(255, 255, 255, 0.08)", // softer background
      backdropFilter: "blur(14px)",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="h5" sx={{
        mb: 2,
        textAlign: "center",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #ff9800, #ff5722)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
            Edit School Info
          </Typography>

          <TextField
            type="file"
            inputRef={fileInputRef}
            onChange={addImage}
            InputLabelProps={{ style: { color: "white" } }}
      sx={{
        input: { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
          "&:hover fieldset": { borderColor: "#ff9800" },
          "&.Mui-focused fieldset": { borderColor: "#ff5722" },
        },
      }}
          />

          {imageUrl && (
            <Box sx={{ mt: 2 }}>
              <CardMedia component={"img"} height={"200px"} image={imageUrl} sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }} />
            </Box>
          )}

          <TextField
            label="School Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            sx={{
        input: { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
          "&:hover fieldset": { borderColor: "#ff9800" },
          "&.Mui-focused fieldset": { borderColor: "#ff5722" },
        },
      }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              sx={{
          flex: 1,
          background: "linear-gradient(90deg, #ff9800, #ff5722)",
          color: "white",
          fontWeight: "bold",
          borderRadius: "10px",
          "&:hover": {
            background: "linear-gradient(90deg, #2a5298, #1e3c72)",
          },
        }}
              onClick={handleEditSubmit}
            >
              Save
            </Button>
            <Button
              variant="outlined"
               sx={{
          flex: 1,
          borderColor: "rgba(255,255,255,0.5)",
          color: "white",
          borderRadius: "10px",
          "&:hover": {
            borderColor: "#ff9800",
            background: "rgba(255,255,255,0.1)",
          },
        }}
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
     {school && (
  <Box
    sx={{
      mt: 4,
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    }}
  >
    {/* School Name Gradient Bar */}
    <Box
      sx={{
        background: "linear-gradient(90deg, #ff9800, #ff5722)",
        py: 2,
        px: 3,
        textAlign: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "white",
          letterSpacing: "1px",
        }}
      >
        {school.school_name}
      </Typography>
    </Box>

    {/* Fullscreen Image */}
    <Box
      sx={{
        height: "100vh", // full screen height
        width: "100%",   // full width
        background: `url(/images/uploaded/school/${school.school_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    {/* Floating Edit Button */}
    <Box
      component="div"
      sx={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        zIndex: 3,
      }}
    >
      <Button
        variant="outlined"
        sx={{
          background: "rgba(0,0,0,0.5)",
          color: "white",
          borderRadius: "50%",
          height: "60px",
          width: "60px",
          minWidth: "60px",
          border: "1px solid rgba(255,255,255,0.6)",
          "&:hover": {
            background: "rgba(0,0,0,0.7)",
            borderColor: "#ff9800",
          },
        }}
        onClick={() => setEdit(true)}
      >
        <EditIcon />
      </Button>
    </Box>
  </Box>
)}


    </Box>
    
  );
}
