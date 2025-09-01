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
        p: 3,
      }}
    >
      <Typography
        variant="h3"
        sx={{ textAlign: "center", mb: 3, color: "white" }}
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
            backgroundColor: "rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            color: "white",
          }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="h5" sx={{ mb: 2, color: "white" }}>
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
                "&:hover fieldset": { borderColor: "white" },
              },
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
            onChange={(e) => setSchoolName(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "white" },
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                flex: 1,
                 background: "linear-gradient(90deg, #ff9800, #ff5722)",color: "white",
                fontWeight: "bold",
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
                "&:hover": {
                  borderColor: "white",
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
            position: "relative",
            height: "300px",
            width: "100%",
            background: `url(/images/uploaded/school/${school.school_image})`,
            backgroundSize: "cover",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            mt: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              background: "rgba(0,0,0,0.5)",
              px: 3,
              py: 1,
              borderRadius: "12px",
            }}
          >
            {school.school_name}
          </Typography>

          <Box
            component={"div"}
            sx={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              height: "50px",
              width: "50px",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: "50%",
                height: "60px",
                width: "60px",
                minWidth: "60px",
                "&:hover": { background: "rgba(255,255,255,0.4)" },
              }}
              onClick={() => {
                setEdit(true);
              }}
            >
              <EditIcon />
            </Button>
          </Box>
        </Box>
      )}

    </Box>
    
  );
}
