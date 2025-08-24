import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { Button, CardMedia, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import axios from "axios";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import { loginSchema } from "../../../yupSchema/loginSchema";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {

  const [role ,setRole] = React.useState('student')
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext)
  const initialValues = {
    email: "",
    password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      
      let URL ;  
      if(role==="student"){
        URL = `http://localhost:3000/api/student/login`
      }else if(role==="teacher"){
        URL = `http://localhost:3000/api/teacher/login`
      }else if(role === "school"){
        URL = `http://localhost:3000/api/school/login`
      }

        axios
          .post(URL,{...values})
          .then((resp) => {
          const token = resp.headers.get("Authorization");	

          if(token){
            localStorage.setItem("token", token)
          
          }
          const user = resp.data.user;
          if(user){
            localStorage.setItem("user",JSON.stringify(user))
            login(user)
          }
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            navigate("/school");	
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setMessageType("error");
            console.log("Error", e); //error handling
          });
     
    },
  });

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("success");
  const handleMessageClose = () => {
    setMessage("");
  };

  return (
    <Box
      component={"div"}
      sx={{
        background:
          "",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100%",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      {message && (
        <MessageSnackbar
          message={message}
          type={messageType}
          handleClose={handleMessageClose}
        />
      )}

      <Box sx={{ textAlign: "center", mt: 2 }}>
       
      </Box>

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          minHeight: "80vh",
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
        >
          Login
        </Typography>

         <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="Role"
          onChange={(e)=>{setRole(e.target.value)}}
        >
          <MenuItem value={"student"}>Student</MenuItem>
          <MenuItem value={"teacher"}>Teacher</MenuItem>
          <MenuItem value={"school"}>School</MenuItem>
        </Select>
      </FormControl>
        

       

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

       

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
