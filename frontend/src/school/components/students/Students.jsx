import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { Button, CardMedia, Typography } from "@mui/material";
import axios from "axios";
export default function Students() {
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
      background:"url(data:image/jpeg;base64,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)",
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
        minWidth: "230px",
        margin: "auto",
        padding: "1rem",
        backgroundColor: "rgba(221, 183, 239, 0.22)",
      }}
      noValidate
      autoComplete="off"
      onSubmit={Formik.handleSubmit}
      >
        <Typography
    variant="h4"
    sx={{ color: "black", fontWeight: "bold", }}
    
  >
    Register
  </Typography>
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
        name="school_name"
        label="School Name"
        value={Formik.values.school_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
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
        />

      {Formik.touched.confirm_password && Formik.errors.confirm_password && (
        <p style={{ color: "red", textTransform: "capitalize" }}>
          {Formik.errors.confirm_password}
        </p>
      )}

      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
      </Box>
  );
}
