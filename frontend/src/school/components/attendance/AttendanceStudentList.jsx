import * as React from "react";
import { baseApi } from "../../../environment";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { studentEditSchema, studentSchema } from "../../../yupSchema/studentSchema";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";




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

export default function AttendanceStudentList() {
  const [edit, setEdit] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
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

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id)
    const filteredStudent = students.filter((x) => x._id === id);
    Formik.setFieldValue("name", filteredStudent[0].name);
    Formik.setFieldValue("email", filteredStudent[0].email);
    
    Formik.setFieldValue("student_class", filteredStudent[0].student_class._id);
    Formik.setFieldValue("age", filteredStudent[0].age);
    Formik.setFieldValue("gender", filteredStudent[0].gender);
    Formik.setFieldValue("guardian", filteredStudent[0].guardian);
    Formik.setFieldValue("guardian_phone", filteredStudent[0].guardian_phone);
  };

  const handleDelete = (id) => {
    if(confirm("Are you sure , you want to delete?")) {
       axios
          .delete(`http://localhost:3000/api/student/delete/${id}`)
          .then((resp) => {
            setMessage(resp.data.message);
            setMessageType("success");
          })
          .catch((e) => { 
            setMessage("Error in deleting student");
            setMessageType("error");
            console.log("Error", e); //error handling
          });
    }
   
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
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
    validationSchema: edit?studentEditSchema:studentSchema,
    onSubmit: (values) => {

      if (edit) {
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("gender", values.gender);
        fd.append("age", values.age);
        fd.append("guardian", values.guardian);
        fd.append("guardian_phone", values.guardian_phone);
        fd.append("student_class", values.student_class);

        if (file) {
          fd.append("image", file, file.name);
        }
        if (values.password) {
          fd.append("password", values.password);
        }

        axios
          .patch(`http://localhost:3000/api/student/update/${editId}`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((e) => { 
            setMessage("Error in editing student");
            setMessageType("error");
            console.log("Error", e); //error handling
          });
      } else {
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
  }, []);
  React.useEffect(() => {
    fetchStudents();
  }, [message, params]);

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
        <Typography>
          Students Attendance
        </Typography>
      </Box>


      <Grid container spacing={2}>
        <Grid size={4}>
          <Item><Box
  component="div"
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginTop: "30px",
    padding: "10px",
  }}
>
  <TextField
    label="Search"
    onChange={handleSearch}
    variant="outlined"
  />
  <FormControl sx={{ minWidth: 200 }}>
    <InputLabel>Class</InputLabel>
    <Select label="Student Class" onChange={handleClass}>
      <MenuItem value="">All Students</MenuItem>
      {classes &&
        classes.map((x) => (
          <MenuItem key={x._id} value={x._id}>
            {x.class_text} ({x.class_num})
          </MenuItem>
        ))}
    </Select>
  </FormControl>
</Box></Item>
        </Grid>
        <Grid size={8}>
          <Item> <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Guardian Contact</TableCell>
            <TableCell align="right">Class</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">View</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {students && students.map((student) => (
            <TableRow
              key={student._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {student.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {student.gender}
              </TableCell>
              
              <TableCell align="right">{student.guardian_phone}</TableCell>
              <TableCell align="right">{student.student_class.class_text}</TableCell>
              <TableCell align="right">percentage</TableCell>
              <TableCell align="right">"view</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
</Item>
        </Grid>
        
      </Grid>


      


        

  
</Box>
  );
}
