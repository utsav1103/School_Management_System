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
import { teacherEditSchema, teacherSchema } from "../../../yupSchema/teacherSchema";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";

//icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Teachers() {
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
    const filteredteacher = teachers.filter((x) => x._id === id);
    console.log("filtered teacher", filteredteacher);
    Formik.setFieldValue("name", filteredteacher[0].name);
    Formik.setFieldValue("email", filteredteacher[0].email);
    Formik.setFieldValue("age", filteredteacher[0].age);
    Formik.setFieldValue("gender", filteredteacher[0].gender);
    Formik.setFieldValue("qualification", filteredteacher[0].qualification);
  };

  const handleDelete = (id) => {
    if(confirm("Are you sure , you want to delete?")) {
       axios
          .delete(`http://localhost:3000/api/teacher/delete/${id}`)
          .then((resp) => {
            console.log(resp);
            setMessage(resp.data.message);
            setMessageType("success");
          })
          .catch((e) => { 
            setMessage("Error in deleting teacher");
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
    age: "",
    gender: "",
    qualification: "",
    password: "",
    confirm_password: "",
  };
  const Formik = useFormik({
    initialValues,
    validationSchema: edit?teacherEditSchema:teacherSchema,
    onSubmit: (values) => {
      console.log("Register submit values", values);

      if (edit) {
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("gender", values.gender);
        fd.append("age", values.age);
        fd.append("qualification", values.qualification);
        

        if (file) {
          fd.append("image", file, file.name);
        }
        if (values.password) {
          fd.append("password", values.password);
        }

        axios
          .patch(`http://localhost:3000/api/teacher/update/${editId}`, fd)
          .then((resp) => {
            console.log(resp);
            setMessage(resp.data.message);
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((e) => { 
            setMessage("Error in editing teacher");
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
          fd.append("qualification", values.qualification);
          ;
          fd.append("password", values.password);

          axios
            .post(`http://localhost:3000/api/teacher/register`, fd)
            .then((resp) => {
              console.log(resp);
              setMessage(resp.data.message);
              setMessageType("success");
              Formik.resetForm();
              handleClearFile();
            })
            .catch((e) => {
              setMessage("Error in registring new teacher");
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
  
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const [teachers, setteachers] = React.useState([]);
  const fetchteachers = () => {
    axios
      .get(`${baseApi}/teacher/fetch-with-query`, { params })
      .then((resp) => {
        setteachers(resp.data.teachers);
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
      });
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);
  React.useEffect(() => {
    fetchteachers();
  }, [message, params]);

  return (
    <Box
      component={"div"}
       sx={{
    backgroundColor: "transparent", // keep transparent to show global bg
    minHeight: "100vh",
    paddingTop: "20px",
    paddingBottom: "20px",
    px: 2,

    // gradient border on top for accent
    borderTop: "4px solid",
    borderImage: "linear-gradient(90deg, #ff9800, #ff5722) 1",

    // optional subtle glow around the wrapper
    boxShadow: "0 0 15px rgba(255, 152, 0, 0.2)",
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
    width: "100%",
    maxWidth: 600,
    margin: "30px auto",
    padding: "30px",
    borderRadius: "20px",
    backgroundColor: "rgba(0,0,0,0.6)", // semi-transparent over dark wood
    backdropFilter: "blur(6px)", // frosted glass effect
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",

    // gradient accent border
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      borderRadius: "20px 20px 0 0",
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
    },

    display: "flex",
    flexDirection: "column",
    gap: 2,
  }}
  noValidate
  autoComplete="off"
  onSubmit={Formik.handleSubmit}
>
  <Typography
    variant="h5"
    textAlign="center"
    fontWeight="bold"
     sx={{
      mb: 2,
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {edit ? "Edit teacher Info..." : "Add teacher"}
  </Typography>

  <Typography fontWeight="500"  sx={{ color: "#f5f5f5" }}>Add teacher Picture</Typography>
  <TextField
    type="file"
    inputRef={fileInputRef}
    onChange={addImage}
    variant="outlined"
    fullWidth
   sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5", // input text
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)", // default border
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800", // hover border
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722", // focus border
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800", // label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722", // focused label color
    },
  }}
  />

  {imageUrl && (
    <CardMedia
       component="img"
      height="200"
      image={imageUrl}
      sx={{
        borderRadius: "12px",
        objectFit: "cover",
        mt: 1,
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(#1e1e1e, #1e1e1e), linear-gradient(90deg, #ff9800, #ff5722)",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
      }}
    />
  )}

  <TextField
    name="name"
    label="Name"
    value={Formik.values.name}
    onChange={Formik.handleChange}
    onBlur={Formik.handleBlur}
    error={Boolean(Formik.touched.name && Formik.errors.name)}
    helperText={Formik.touched.name && Formik.errors.name}
    fullWidth
     sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5", // text color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722",
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722",
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722", // error text
    },
  }}
  />

  <TextField
    name="email"
    label="Email"
    value={Formik.values.email}
    onChange={Formik.handleChange}
    onBlur={Formik.handleBlur}
    error={Boolean(Formik.touched.email && Formik.errors.email)}
    helperText={Formik.touched.email && Formik.errors.email}
    fullWidth
    sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5", // text color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722",
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722",
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722", // error text
    },
  }}
  />

  

  <TextField
    name="age"
    label="Age"
    value={Formik.values.age}
    onChange={Formik.handleChange}
    onBlur={Formik.handleBlur}
    error={Boolean(Formik.touched.age && Formik.errors.age)}
    helperText={Formik.touched.age && Formik.errors.age}
    fullWidth
    sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722",
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722",
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722",
    },
  }}
  />

  <FormControl fullWidth error={Boolean(Formik.touched.gender && Formik.errors.gender)}
   sx={{
    "& .MuiInputLabel-root": {
      color: "#ff9800", // default label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722", // focused label
    },
    "& .MuiOutlinedInput-root": {
      color: "#f5f5f5", // selected text
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.3)",
      },
      "&:hover fieldset": {
        borderColor: "#ff9800",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ff5722",
      },
      "& .MuiSvgIcon-root": {
        color: "#ff9800", // dropdown arrow
      },
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722",
    },
  }}>
    <InputLabel>Gender</InputLabel>
    <Select
      name="gender"
      value={Formik.values.gender}
      label="Gender"
      onChange={Formik.handleChange}
       MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: "#1e1e1e", // dropdown background
          color: "#f5f5f5", // dropdown text
          "& .MuiMenuItem-root": {
            "&:hover": {
              bgcolor: "rgba(255, 152, 0, 0.2)", // hover effect
            },
            "&.Mui-selected": {
              bgcolor: "rgba(255, 87, 34, 0.3)", // selected item
            },
          },
        },
      },
    }}
    >
      <MenuItem value="male">Male</MenuItem>
      <MenuItem value="female">Female</MenuItem>
    </Select>
    {Formik.touched.gender && Formik.errors.gender && (
      <Typography variant="caption" sx={{ color: "#ff5722" }}>
        {Formik.errors.gender}
      </Typography>
    )}
  </FormControl>

  <TextField
    name="qualification"
    label="Qualification"
    value={Formik.values.qualification}
    onChange={Formik.handleChange}
    onBlur={Formik.handleBlur}
    error={Boolean(Formik.touched.qualification && Formik.errors.qualification)}
    helperText={Formik.touched.qualification && Formik.errors.qualification}
    fullWidth
    sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722",
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722",
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722",
    },
  }}
  />

  

  <TextField
    type="password"
    name="password"
    label="Password"
    value={Formik.values.password}
    onChange={Formik.handleChange}
    onBlur={Formik.handleBlur}
    error={Boolean(Formik.touched.password && Formik.errors.password)}
    helperText={Formik.touched.password && Formik.errors.password}
    fullWidth
      sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722",
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722",
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722",
    },
  }}
  />

  <TextField
    type="password"
    name="confirm_password"
    label="Verify Password"
    value={Formik.values.confirm_password}
    onChange={Formik.handleChange}
    onBlur={Formik.handleBlur}
    error={Boolean(Formik.touched.confirm_password && Formik.errors.confirm_password)}
    helperText={Formik.touched.confirm_password && Formik.errors.confirm_password}
    fullWidth
    sx={{
    "& .MuiInputBase-root": {
      color: "#f5f5f5",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff9800",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff5722",
    },
    "& .MuiInputLabel-root": {
      color: "#ff9800",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff5722",
    },
    "& .MuiFormHelperText-root": {
      color: "#ff5722",
    },
  }}
  />

  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
    <Button type="submit" variant="contained" fullWidth sx={{
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "12px",
      textTransform: "none",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      "&:hover": {
        background: "linear-gradient(90deg, #ffb74d, #ff7043)",
      },
    }}>
      Submit
    </Button>
    {edit && (
      <Button
        type="button"
        variant="outlined"
        onClick={cancelEdit}
        fullWidth
        sx={{
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: "bold",
        border: "2px solid",
        borderImage: "linear-gradient(90deg, #ff9800, #ff5722) 1",
        color: "#ff9800",
        "&:hover": {
          background: "rgba(255, 152, 0, 0.1)",
          borderImage: "linear-gradient(90deg, #ffb74d, #ff7043) 1",
          color: "#ff5722",
        },
      }}
      >
        Cancel
      </Button>
    )}
  </Box>
</Box>

      <Box
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
     sx={{
      input: { color: "#fff" },
      label: { color: "#ff9800" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#ff9800" },
        "&:hover fieldset": { borderColor: "#ff5722" },
        "&.Mui-focused fieldset": { borderColor: "#ff5722" },
      },
    }}
  />
</Box>

      <Box
  component="div"
  sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 3,
    marginTop: "30px",
    padding: "20px",
  }}
>
  {teachers &&
    teachers.map((teacher) => {
      return (
        <Card
          key={teacher._id}
          sx={{
          width: 300,
          borderRadius: "16px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "#fff",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0 6px 20px rgba(255, 152, 0, 0.5)",
          },
        }}
        >
          <CardActionArea>
            <Box sx={{ width: "100%", height: 250, overflow: "hidden" }}>
              <CardMedia
                component="img"
                image={`/images/uploaded/teacher/${teacher.teacher_image}`}
                alt="teacher image"
                sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.9,
              }}
              />
            </Box>

            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                <strong>Name:</strong> {teacher.name}
              </Typography>
              <Typography gutterBottom variant="body1">
                <strong>Email:</strong> {teacher.email}
              </Typography>
              
              <Typography gutterBottom variant="body1">
                <strong>Age:</strong> {teacher.age}
              </Typography>
              <Typography gutterBottom variant="body1">
                <strong>Gender:</strong> {teacher.gender}
              </Typography>
              <Typography gutterBottom variant="body1">
                <strong>Qualification:</strong> {teacher.qualification}
              </Typography>
              
            </CardContent>
          </CardActionArea>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 2,
              pb: 2,
              gap:1,
            }}
          >
            <Button
              onClick={() => handleEdit(teacher._id)}
              variant="contained"
              size="small"
               sx={{
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #ffb74d, #ff7043)",
              },
            }}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(teacher._id)}
              variant="contained"
              size="small"
              sx={{
              background: "linear-gradient(90deg, #f44336, #d32f2f)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #ef5350, #c62828)",
              },
            }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Box>
        </Card>
      );
    })}
</Box>

    </Box>
  );
}
 