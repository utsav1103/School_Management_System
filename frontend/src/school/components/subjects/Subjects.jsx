import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import axios from "axios";
//import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";

//icons
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditIcon from "@mui/icons-material/Edit";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
export default function Subjects() {

const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const handleMessageClose = () => {
    setMessage("");
  }; 

  const [subjects, setSubjects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null)

  const handleEdit = (id, subject_name, subject_codename) => {
    console.log(id);
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("subject_name",subject_name)
    Formik.setFieldValue("subject_codename",subject_codename)
    
  };
  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.setFieldValue("subject_name","")
    Formik.setFieldValue("subject_codename","")
    
  };  
  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`/api/subject/delete/${id}`).then(resp=>{
       setMessage(resp.data.message)
       setMessageType("success")
    }).catch(e=>{
      console.log(e)
      setMessage("Error in Deleting subject..")
      setMessageType('error')
    })
  };

  const Formik = useFormik({
    initialValues: { subject_name: "", subject_codename: "" },
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      console.log(values);
      if(edit){
        axios
        .patch(`/api/subject/update/${editId  }`, { ...values })
        .then((resp) => {
          setMessage(resp.data.message)
          setMessageType("success")
          cancelEdit()
        })
        .catch((e) => {
          console.log("Error in subject updating", e);
          setMessage("Error in Updating subject")
          setMessageType("error")
        });

      }else{

      
      axios
        .post(`/api/subject/create`, { ...values })
        .then((resp) => {
          console.log("subject add response", resp);
          setMessage(resp.data.message)
          setMessageType("success")
        })
        .catch((e) => {
          console.log("Error in subject", e);
          setMessage("Error in saving subject")
          setMessageType("error")
        });
      }
      Formik.resetForm();
    }, 
  });
  const FetchAllsubjects = () => {
    axios
      .get(`/api/subject/all`)
      .then((resp) => {
        setSubjects(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all subject", e);
      });
  };

  useEffect(() => {
    FetchAllsubjects();
  }, [message]);

  return (
    <>
    {message && (
            <MessageSnackbar
              message={message}
              type={messageType}
              handleClose={handleMessageClose}
            />
          )}
      <Typography  variant='h3' sx={{
        textAlign:"center",
          fontWeight: 800,
          my: 4,
          background: "linear-gradient(90deg, #ff9800, #ff5722)", // warm orange gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "2px",
          textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          fontFamily: "'Poppins', sans-serif",
        }}>Subject</Typography>
      <Box
        component="form"
         sx={{
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "50vw",
    minWidth: "280px",
    margin: "2rem auto",
    p: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
  }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        {edit ? (
          <Typography
            variant="h6"
             sx={{
      textAlign: "center",
      fontWeight: "bold",
      mb: 2,
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
          >
            Edit subject
          </Typography>
        ) : (
          <Typography
            variant="h6"
             sx={{
      textAlign: "center",
      fontWeight: "bold",
      mb: 2,
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
          >
            Add New subject
          </Typography>
        )}

        <TextField
          name="subject_name"
          label="Subject Name"
          value={Formik.values.subject_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          sx={{
      input: { color: "#fff" },
      "& .MuiInputLabel-root": { color: "#ff9800" },
      "& .MuiInputLabel-root.Mui-focused": { color: "#ff5722" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
        "&:hover fieldset": { borderColor: "#ff9800" },
        "&.Mui-focused fieldset": { borderColor: "#ff5722" },
      },
    }}
        />

        {Formik.touched.subject_name && Formik.errors.subject_name && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_name}
          </p>
        )}

        <TextField
          name="subject_codename"
          label="Subject Code"
          value={Formik.values.subject_codename}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          sx={{
      input: { color: "#fff" },
      "& .MuiInputLabel-root": { color: "#ff9800" },
      "& .MuiInputLabel-root.Mui-focused": { color: "#ff5722" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
        "&:hover fieldset": { borderColor: "#ff9800" },
        "&.Mui-focused fieldset": { borderColor: "#ff5722" },
      },
    }}
        />

        {Formik.touched.subject_codename && Formik.errors.subject_codename && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_codename}
          </p>
        )}
        <Button
         sx={{
        flex: 1,
        background: "linear-gradient(90deg, #ff9800, #ff5722)",
        color: "#fff",
        fontWeight: "bold",
        "&:hover": {
          boxShadow: "0 0 10px rgba(255, 87, 34, 0.8)",
        },
      }}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>

        {edit && (
          <Button
            onClick={() => {
              cancelEdit();
            }}
            type="button"
            variant="outlined"
            sx={{
          flex: 1,
          borderColor: "#ff5722",
          color: "#ff5722",
          "&:hover": {
            borderColor: "#ff9800",
            color: "#ff9800",
          },
        }}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Box
        component={"div"}
         sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 3,
    mt: 4,
  }}
      >
        {subjects &&
          subjects.map((x) => {
            return (
              <Paper key={x._id}sx={{
          p: 3,
          minWidth: 250,
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#fff",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
          },
        }}>
                <Box component={"div"}>
                  {" "}
                  <Typography variant="subtitle1"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff9800, #ff5722)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
                    subject:{x.subject_name}[{x.subject_codename}]
                  </Typography> 
                </Box>
                <Box component={"div"} sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id,x.subject_name,x.subject_codename);
                    }}  sx={{
              borderColor: "#ff9800",
              color: "#ff9800",
              border: "1px solid",
              "&:hover": {
                borderColor: "#ff5722",
                color: "#ff5722",
              },
            }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(x._id);
                    }}
                       sx={{
              color: "#fff",
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
                  >
                    <DeleteSweepIcon />
                  </Button>
                </Box>
              </Paper>  
            );
          })}
      </Box> 
    </>
  );
}
