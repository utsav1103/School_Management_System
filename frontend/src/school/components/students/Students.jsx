import * as React from "react";
import { baseApi } from "../../../environment";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { studentSchema } from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";

export default function Students() {
  const [classes, setClasses] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };

  //Reseting image

  const fileInputRef = React.useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  };

  const initialValues = {
    email: "",
    name: "",
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: studentSchema,
    onSubmit: (values) => {
      console.log("Register submit values", values);

      if (file) {
        const fd = new FormData();
        fd.append("image", file, file.name);
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("gender", values.gender);
        fd.append("age", values.age);
        fd.append("guardian", values.guardian);
        fd.append("guardian_phone", values.guardian_phone);
        fd.append("student_class", values.student_class);
        fd.append("password", values.password);

        axios
          .post(`http://localhost:3000/api/student/register`, fd)
          .then((resp) => {
            console.log(resp);
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((e) => {
            setMessage("Error in registring new student");
            setMessageType("error");
            console.log("Error", e); //error handling
          });
      } else {
        setMessage("Please select an image");
        setMessageType("error");
      }
    },
  });

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("success");
  const handleMessageClose = () => {
    setMessage("");
  };

  const fetchClasses = () => {
    axios
      .get(`${baseApi}/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
      });
  };

  const [params, setParams] = React.useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
  };
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const [students, setStudents] = React.useState([]);
  const fetchStudents = () => {
    axios
      .get(`${baseApi}/student/fetch-with-query`, { params })
      .then((resp) => {
        setStudents(resp.data.students);
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
      });
  };

  React.useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [message, params]);

  return (
    <Box
      component={"div"}
      sx={{
        background:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dlogin%2Bbackground&psig=AOvVaw3YOZ0ItvXP5qgOeTmUYY2i&ust=1751379570903000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMjJssOrmY4DFQAAAAAdAAAAABAE",
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

      <Box sx={{ textAlign: "center", mt: 2 }}></Box>

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
        <Typography variant="h5" sx={{ color: "black", fontWeight: "bold" }}>
          Add Student
        </Typography>
        <Typography>Add Student Picture</Typography>

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
          name="name"
          label="Name"
          value={Formik.values.name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.name && Formik.errors.name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.name}
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

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Class</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Formik.values.student_class}
            label="Student Class"
            name="student_class"
            onChange={Formik.handleChange}
          >
            {classes &&
              classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text}({x.class_num})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>

        {Formik.touched.student_class && Formik.errors.student_class && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.student_class}
          </p>
        )}

        <TextField
          name="age"
          label=" Age "
          value={Formik.values.age}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.age && Formik.errors.age && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.age}
          </p>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="gender"
            value={Formik.values.gender}
            label="Gender"
            onChange={Formik.handleChange}
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
          </Select>
        </FormControl>
        {Formik.touched.gender && Formik.errors.gender && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.gender}
          </p>
        )}

        <TextField
          name="guardian"
          label="Guardian"
          value={Formik.values.guardian}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.guardian && Formik.errors.guardian && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.guardian}
          </p>
        )}

        <TextField
          name="guardian_phone"
          label="Guardian Contact"
          value={Formik.values.guardian_phone}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.guardian_phone && Formik.errors.guardian_phone && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.guardian_phone}
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
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <TextField
          label="Search"
          onChange={(e) => {
            handleSearch(e);
          }}
          //onBlur={Formik.handleBlur}
        />
        <FormControl sx={{ width: "180px", marginLeft: "5px" }}>
          <InputLabel id="demo-simple-select-label">Class</InputLabel>
          <Select
            label="Student Class"
            onChange={(e) => {
              handleClass(e);
            }}
          >
            {classes &&
              classes.map((x) => {
                return (
                  <MenuItem key={x._id} value={x._id}>
                    {x.class_text}({x.class_num})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        {students &&
          students.map((student) => {
            return (
              <Card key={student._id} sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="330"
                    image={`/images/uploaded/student/${student.student_image}`}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Name-</span>
                      {student.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Email-</span>{" "}
                      {student.email}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Class-</span>
                      {student.student_class?.class_text}({student.student_class?.class_num})
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Age-</span>{" "}
                      {student.age}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Gender-</span>{" "}
                      {student.gender}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Guardian-</span>{" "}
                      {student.guardian}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }}>Contact-</span>
                      {student.guardian_phone}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    ></Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
      </Box>
    </Box>
  );
}
