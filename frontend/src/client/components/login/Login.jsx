import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import { loginSchema } from "../../../yupSchema/loginSchema";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = React.useState("student");
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      let URL;
      if (role === "student") {
        URL = `http://localhost:3000/api/student/login`;
      } else if (role === "teacher") {
        URL = `http://localhost:3000/api/teacher/login`;
      } else if (role === "school") {
        URL = `http://localhost:3000/api/school/login`;
      }

      axios
        .post(URL, { ...values })
        .then((resp) => {
          const token = resp.headers["authorization"];
          if (token) {
            localStorage.setItem("token", token);
          }
          const user = resp.data.user;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            login(user);

            setTimeout(() => {
              navigate(`/${role}`);
            }, 0);
          }
          setMessage(resp.data.message);
          setMessageType("success");
          Formik.resetForm();
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setMessageType("error");
          console.log("Error", e); // error handling
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
      sx={{
        background: "url('/images/dark-wood.jpg')",
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

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          minHeight: "80vh",
          flexDirection: "column",
          width: "50vw",
          minWidth: "320px",
          margin: "auto",
          padding: "2rem",
          borderRadius: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // more transparent
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#f0f0f0",
            mb: 2,
          }}
        >
          Login
        </Typography>

        {/* Role Selector (same style as TextFields) */}
        <FormControl
          fullWidth
          variant="outlined"
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#ffb74d" },
              "&.Mui-focused fieldset": { borderColor: "#ff9800" },
            },
            "& .MuiInputLabel-root": { color: "#ccc" },
            "& .MuiSvgIcon-root": { color: "#fff" },
          }}
        >
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            label='role'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
            <MenuItem value={"school"}>School</MenuItem>
          </Select>
        </FormControl>

        {/* Email */}
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          size="medium"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          sx={{
            input: { color: "#fff" },
            label: { color: "#ccc" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#ffb74d" },
              "&.Mui-focused fieldset": { borderColor: "#ff9800" },
            },
          }}
        />
        {Formik.touched.email && Formik.errors.email && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.email}
          </p>
        )}

        {/* Password */}
        <TextField
          type="password"
          name="password"
          label="Password"
          variant="outlined"
          size="medium"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          sx={{
            input: { color: "#fff" },
            label: { color: "#ccc" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#ffb74d" },
              "&.Mui-focused fieldset": { borderColor: "#ff9800" },
            },
          }}
        />
        {Formik.touched.password && Formik.errors.password && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.password}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #ff9800, #ff5722)",
            "&:hover": {
              background: "linear-gradient(90deg, #2a5298, #1e3c72)",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
