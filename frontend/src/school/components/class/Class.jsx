import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";
import axios from "axios";
//import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";

//icons
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditIcon from "@mui/icons-material/Edit";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
export default function Class() {

const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const handleMessageClose = () => {
    setMessage("");
  }; 

  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null)

  const handleEdit = (id, class_text, class_num) => {
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("class_text",class_text)
    Formik.setFieldValue("class_num",class_num)
    
  };
  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.setFieldValue("class_text","")
    Formik.setFieldValue("class_num","")
    
  };  
  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`/api/class/delete/${id}`).then(resp=>{
       setMessage(resp.data.message)
       setMessageType("success")
    }).catch(e=>{
      console.log(e)
      setMessage("Error in Deleting class..")
      setMessageType('error')
    })
  };

  const Formik = useFormik({
    initialValues: { class_text: "", class_num: "" },
    validationSchema: classSchema,
    onSubmit: (values) => {
      console.log(values);
      if(edit){
        axios
        .patch(`/api/class/update/${editId  }`, { ...values })
        .then((resp) => {
          setMessage(resp.data.message)
          setMessageType("success")
          cancelEdit()
        })
        .catch((e) => {
          console.log("Error in class updating", e);
          setMessage("Error in Updating class")
          setMessageType("error")
        });

      }else{

      
      axios
        .post(`/api/class/create`, { ...values })
        .then((resp) => {
          console.log("class add response", resp);
          setMessage(resp.data.message)
          setMessageType("success")
        })
        .catch((e) => {
          console.log("Error in class", e);
          setMessage("Error in saving class")
          setMessageType("error")
        });
      }
      Formik.resetForm();
    },
  });
  const FetchAllclasses = () => {
    axios
      .get(`/api/class/all`)
      .then((resp) => {
        setClasses(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching all class", e);
      });
  };

  useEffect(() => {
    FetchAllclasses();
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
       <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 3,
          background: "linear-gradient(45deg,#ff9800,#ff5722)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Class
      </Typography>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          minHeight: "70vh",
          flexDirection: "column",
          width: "50vw",
          minWidth: "250px",
          margin: "auto",
          p: 3,
          borderRadius: "16px",
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
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
            color: "#fff",
          }}
          >
            Edit Class
          </Typography>
        ) : (
          <Typography
            variant="h6"
           sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 2,
            color: "#fff",
          }}
          >
            Add New Class
          </Typography>
        )}

        <TextField
          name="class_text"
          label="Class Text"
          value={Formik.values.class_text}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
           InputLabelProps={{ style: { color: "#ff9800" } }}
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#ff9800" },
              "&.Mui-focused fieldset": { borderColor: "#ff5722" },
            },
          }}
        />

        {Formik.touched.class_text && Formik.errors.class_text && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_text}
          </p>
        )}

        <TextField
          name="class_num"
          label="Class Number"
          value={Formik.values.class_num}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
           InputLabelProps={{ style: { color: "#ff9800" } }}
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#ff9800" },
              "&.Mui-focused fieldset": { borderColor: "#ff5722" },
            },
          }}
        />

        {Formik.touched.class_num && Formik.errors.class_num && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_num}
          </p>
        )}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
 <Button
         sx={{
              flex: 1,
              background: "linear-gradient(45deg,#ff9800,#ff5722)",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg,#ff5722,#ff9800)",
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
                borderColor: "#ff9800",
                color: "#ff9800",
                fontWeight: "bold",
                "&:hover": {
                  borderColor: "#ff5722",
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
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          mt: 4,
        }}
      >
        {classes &&
          classes.map((x) => {
            return (
              <Paper key={x._id} sx={{
                p: 2,
                borderRadius: "12px",
                minWidth: "220px",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                "&:hover": { background: "rgba(255,152,0,0.15)" },
              }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    Class:{x.class_text}[{x.class_num}]
                  </Typography> 
              
                <Box component={"div"}>
                  <Button  sx={{ color: "#ff9800" }}
                    onClick={() => {
                      handleEdit(x._id,x.class_text,x.class_num);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(x._id);
                    }}
                      sx={{ color: "red" }}
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
