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

  //filtering audience
  const [filter, setFilter] = useState("all"); // all | student | teacher

// Filtered notices before rendering
const filteredNotices = notices.filter((n) => {
  if (filter === "all") return true;
  return n.audience === filter;
});


  const handleEdit = (id, title, message,audience) => {
    setEdit(true);
    setEditId(id);
    Formik.setValues({
      title,
      message,
      audience,
    });
   // Formik.setFieldValue("message",message)
   // Formik.setFieldValue("audience",audience)
    
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
          label="Title"
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
            {edit ? "Update" : "Submit"}
          </Button>

        {edit && (
          <Button
            onClick={
              cancelEdit}
            type="button  "
            variant="outlined"
            sx={{width:'120px'}}
          >
            Cancel
          </Button>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
  <Button 
    variant={filter === "student" ? "contained" : "outlined"} 
    onClick={() => setFilter("student")}
  >
    Student Notice
  </Button>

  <Button 
    variant={filter === "teacher" ? "contained" : "outlined"} 
    onClick={() => setFilter("teacher")}
  >
    Teacher Notice
  </Button>

  <Button 
    variant={filter === "all" ? "contained" : "outlined"} 
    onClick={() => setFilter("all")}
  >
    All Notice
  </Button>
</Box>


      <Box
        component={"div"}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {filteredNotices.length > 0 ?(
          filteredNotices.map((x)=> (

             <Paper key={x._id} sx={{m:2,p:2}}>
                <Box component={"div"}>
                  
                  <Typography>
                   <b>Title :</b> {x.title}
                  </Typography> 

                  <Typography>
                   <b>Message :</b> {x.message}
                  </Typography>

                  <Typography>
                   <b>For :</b> {x.audience}
                  </Typography>

                </Box>
                <Box component={"div"}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id,x.title,x.message,x.audience);
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

          ))
        ): (
          <Typography sx={{m:2}}>No notices</Typography>
        
          )}
      </Box> 
    </>
  );
}
