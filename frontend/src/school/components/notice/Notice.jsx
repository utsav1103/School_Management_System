import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { noticeSchema } from "../../../yupSchema/noticeSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";

//icons


import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditIcon from "@mui/icons-material/Edit";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
export default function Notice() {

const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const handleMessageClose = () => {
    setMessage("");
  }; 

  const [notices, setNotices] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null)

  const handleEdit = (id, title, message) => {
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("title",title)
    Formik.setFieldValue("message",message)
    Formik.setFieldValue("audience",audience)
    
  };
  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    //Formik.setFieldValue("title","")
    //Formik.setFieldValue("message","")
    Formik.resetForm()
    
  };  
  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`${baseApi}/notice/delete/${id}`).then(resp=>{
       setMessage(resp.data.message)
       setMessageType("success")
    }).catch(e=>{
      console.log(e)
      setMessage("Error in Deleting Notice..")
      setMessageType('error')
    })
  };

  const Formik = useFormik({
    initialValues: { title: "", message: "",audience: ""},
    validationSchema: noticeSchema,
    onSubmit: (values) => {
      console.log(values);
      if(edit){
        axios
        .patch(`${baseApi}/notice/update/${editId  }`, { ...values })
        .then((resp) => {
          setMessage(resp.data.message)
          setMessageType("success")
          cancelEdit()
        })
        .catch((e) => {
          console.log("Error in Notice updating", e);
          setMessage("Error in Updating Notice")
          setMessageType("error")
        });

      }else{

      
      axios
        .post(`${baseApi}/notice/create`, { ...values })
        .then((resp) => {
          console.log("Notice add response", resp);
          setMessage(resp.data.message)
          setMessageType("success")
        })
        .catch((e) => {
          console.log("Error in Notice", e);
          setMessage("Error in saving Notice")
          setMessageType("error")
        });
      }
      Formik.resetForm();
    },
  });
  const FetchAllNotices = () => {
    axios
      .get(`${baseApi}/notice/all`)
      .then((resp) => {
        setNotices(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all Notice", e);
      });
  };

  useEffect(() => {
    FetchAllNotices();
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
      <h1>Notice</h1>
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
            Edit Notice
          </Typography>
        ) : (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Add New Notice
          </Typography>
        )}

        <TextField
          name="title"
          label="Notice Title"
          value={Formik.values.title}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.title && Formik.errors.title && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.title}
          </p>
        )}

        <TextField
          multiline
          rows={4}
          name="message"
          label="Message"
          value={Formik.values.message}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.message && Formik.errors.message && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.message}
          </p>
        )}

        <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Audience
                    </InputLabel>
                    <Select
                      name="audience"
                      label="Audience"
                      value={Formik.values.audience}
                      variant="outlined"
                      fullWidth
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      error={Boolean(
                        Formik.touched.audience && Formik.errors.audience
                      )}
                      helperText={
                        Formik.touched.audience && Formik.errors.audience
                      }
                    >
                      <MenuItem value={""}>Select Audience</MenuItem>
                      <MenuItem value={"teacher"}>Teacher</MenuItem>
                      <MenuItem value={"student"}>Student</MenuItem>
                      
                    </Select>
                  </FormControl>


        <Button
        sx={{width:'120px'}}
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
            variant="outlined"
            sx={{width:'120px'}}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Box
        component={"div"}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {notices &&
          notices.map((x) => {
            return (
              <Paper key={x._id} sx={{m:2,p:2}}>
                <Box component={"div"}>
                  {" "}
                  <Typography>
                    Notice:{x.title}[{x.message}]
                  </Typography> 
                </Box>
                <Box component={"div"}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id,x.title,x.message);
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
