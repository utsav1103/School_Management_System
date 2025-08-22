import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { noticeSchema } from "../../../yupSchema/NoticeSchema";
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

  const handleEdit = (id, Notice_text, Notice_num) => {
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("Notice_text",Notice_text)
    Formik.setFieldValue("Notice_num",Notice_num)
    
  };
  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.setFieldValue("Notice_text","")
    Formik.setFieldValue("Notice_num","")
    
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
    initialValues: { Notice_text: "", Notice_num: "" },
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
          name="Notice_text"
          label="Notice Text"
          value={Formik.values.Notice_text}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.Notice_text && Formik.errors.Notice_text && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.Notice_text}
          </p>
        )}

        <TextField
          name="Notice_num"
          label="Notice Number"
          value={Formik.values.Notice_num}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
        />

        {Formik.touched.Notice_num && Formik.errors.Notice_num && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.Notice_num}
          </p>
        )}
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
                    Notice:{x.Notice_text}[{x.Notice_num}]
                  </Typography> 
                </Box>
                <Box component={"div"}>
                  <Button
                    onClick={() => {
                      handleEdit(x._id,x.Notice_text,x.Notice_num);
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
