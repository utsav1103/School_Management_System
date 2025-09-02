import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { registerSchema } from "../../../yupSchema/registerSchema";
import { Button, CardMedia, Typography } from "@mui/material";
import axios from "axios";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
export default function Register() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };

  //Reseting image

  const fileInputRef = React.useRef(null);
  const handleClearFile = ()=>{
    if(fileInputRef.current){
      fileInputRef.current.value ='';
    }
    setFile(null);
    setImageUrl(null);
  }


  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log("Register submit values", values);

      if(file){
        

      const fd = new FormData();
      fd.append("image", file , file.name);
      fd.append("school_name", values.school_name);
      fd.append("email", values.email);
      fd.append("owner_name", values.owner_name);
      fd.append("password", values.password);
      fd.append("confirm_password", values.confirm_password);

      axios.post(`http://localhost:3000/api/school/register`,fd).then(resp=>{
        console.log(resp)
        setMessage(resp.data.message)
        setMessageType("success")
        Formik.resetForm();
      handleClearFile()
        
      }).catch(e=>{
        setMessage(e.response.data.message)
        setMessageType("error")
        console.log("Error", e); //error handling 
      })
    }else{
      setMessage("Please select an image")
        setMessageType("error")
      
      }
      
       
    },
    
    
  });

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("success");
  const handleMessageClose = () => {
  
    setMessage("")
  };


  return (
    <Box component={"div"} sx={{
      background:`url(/images/dark-wood.jpg)`,
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat",
      height:"100%",
      paddingTop:"10px",
      paddingBottom:"10px"}}>
    {message && 
      <MessageSnackbar message={message} type={messageType} handleClose={handleMessageClose}/>
    }
    
    <Box sx={{ textAlign: "center", mt: 2 }}>
  
</Box>

    
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
            backgroundColor: "rgba(0, 0, 0, 0.4)", // more transparent
          backdropFilter: "blur(12px)",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            color: "white",
          }}
      noValidate
      autoComplete="off"
      onSubmit={Formik.handleSubmit}
      >
        <Typography
    variant="h4"
    sx={{
            mt: 2,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            textAlign: "center",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #ff1800, #ff5722)",
            "&:hover": {
              background: "linear-gradient(90deg, #2a5298, #1e3c72)",
            },
          }}
    
  >
    Register
  </Typography>
      <Typography sx={{
            mt: 2,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            textAlign: "center",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #ff9800, #ff5722)",
          }}>Add School Picture</Typography>

      <TextField
        type="file"
        inputRef={fileInputRef}
        onChange={(event) => {
          addImage(event);
        }}
        sx={{
    input: { color: "white" },
    label: { color: "rgba(255, 255, 255, 0.7)" }, 
    "& label.Mui-focused": { color: "#FFD700" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 215, 0, 0.4)" }, // subtle border
      "&:hover fieldset": { borderColor: "#FFD700" }, // hover glow
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
        boxShadow: "0 0 8px #FFD700", // glowing effect
      },
    },
  }}
        />
      {imageUrl && (
        <Box>
          <CardMedia component={"img"} height={"230px"} image={imageUrl} />
        </Box>
      )}

      <TextField
        name="school_name"
        label="School Name"
        value={Formik.values.school_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        sx={{
    input: { color: "white" },
    label: { color: "rgba(255, 255, 255, 0.7)" }, // golden label
    "& label.Mui-focused": { color: "#FFD700",textShadow: "0 0 6px rgba(255, 255, 255, 0.9)", }, // golden focus
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 215, 0, 0.4)" }, // subtle border
      "&:hover fieldset": { borderColor: "#FFD700" }, // hover glow
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
        boxShadow: "0 0 8px #FFD700", // glowing effect
      },
    },
  }}
        />

      {Formik.touched.school_name && Formik.errors.school_name && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.school_name}
        </p>
      )}

      <TextField
        name="email"
        label="Email"
        value={Formik.values.email}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        sx={{
    input: { color: "white" },
    label: { color: "rgba(255, 255, 255, 0.7)" }, // golden label
    "& label.Mui-focused": { color: "#FFD700",textShadow: "0 0 6px rgba(255, 255, 255, 0.9)", }, // golden focus
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 215, 0, 0.4)" }, // subtle border
      "&:hover fieldset": { borderColor: "#FFD700" }, // hover glow
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
        boxShadow: "0 0 8px #FFD700", // glowing effect
      },
    },
  }}
        />

      {Formik.touched.email && Formik.errors.email && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.email}
        </p>
      )}

      <TextField
        name="owner_name"
        label="Owner Name"
        value={Formik.values.owner_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        sx={{
    input: { color: "white" },
    label: { color: "rgba(255, 255, 255, 0.7)" }, // golden label
    "& label.Mui-focused": { color: "#FFD700",textShadow: "0 0 6px rgba(255, 255, 255, 0.9)", }, // golden focus
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 215, 0, 0.4)" }, // subtle border
      "&:hover fieldset": { borderColor: "#FFD700" }, // hover glow
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
        boxShadow: "0 0 8px #FFD700", // glowing effect
      },
    },
  }}
        />

      {Formik.touched.owner_name && Formik.errors.owner_name && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.owner_name}
        </p>
      )}

      <TextField
        type="password"
        name="password"
        label="Password"
        value={Formik.values.password}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        sx={{
    input: { color: "white" },
    label: { color: "rgba(255, 255, 255, 0.7)" }, // golden label
    "& label.Mui-focused": { color: "#FFD700",textShadow: "0 0 6px rgba(255, 255, 255, 0.9)", }, // golden focus
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 215, 0, 0.4)" }, // subtle border
      "&:hover fieldset": { borderColor: "#FFD700" }, // hover glow
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
        boxShadow: "0 0 8px #FFD700", // glowing effect
      },
    },
  }}
        />

      {Formik.touched.password && Formik.errors.password && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.password}
        </p>
      )}

      <TextField
        type="password"
        name="confirm_password"
        label="Verify Password"
        value={Formik.values.confirm_password}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        sx={{
    input: { color: "white" },
    label: { color: "rgba(255, 255, 255, 0.7)" }, // golden label
    "& label.Mui-focused": { color: "#FFD700",textShadow: "0 0 6px rgba(255, 255, 255, 0.9)", }, // golden focus
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 215, 0, 0.4)" }, // subtle border
      "&:hover fieldset": { borderColor: "#FFD700" }, // hover glow
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
        boxShadow: "0 0 8px #FFD700", // glowing effect
      },
    },
  }}
        />

      {Formik.touched.confirm_password && Formik.errors.confirm_password && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.confirm_password}
        </p>
      )}

      <Button type="submit" variant="contained" sx={{
            mt: 2,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #ff9800, #ff5722)",
            "&:hover": {
              background: "linear-gradient(90deg, #2a5298, #1e3c72)",
            },
          }}>
        Submit
      </Button>
    </Box>
      </Box>
  );
}
