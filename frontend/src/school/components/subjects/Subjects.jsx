import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
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
    axios.delete(`${baseApi}/subject/delete/${id}`).then(resp=>{
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
        .patch(`${baseApi}/subject/update/${editId  }`, { ...values })
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
        .post(`${baseApi}/subject/create`, { ...values })
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
      .get(`${baseApi}/subject/all`)
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
      <h1>subject</h1>
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
        {edit ? (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Edit subject
          </Typography>
        ) : (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold" }}
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
        />

        {Formik.touched.subject_codename && Formik.errors.subject_codename && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.subject_codename}
          </p>
        )}
        <Button
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
            type="button  "
            variant="contained"
          >
            Cancel
          </Button>
        )}
      </Box>

      <Box
        component={"div"}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {subjects &&
          subjects.map((x) => {
            return (
              <Paper key={x._id} sx={{m:2,p:2}}>
                <Box component={"div"}>
                  {" "}
                  <Typography>
                    subject:{x.subject_name}[{x.subject_codename}]
                  </Typography> 
                </Box>
                <Box component={"div"}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id,x.subject_name,x.subject_codename);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(x._id);
                    }}
                      sx={{color:"red"}}
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
