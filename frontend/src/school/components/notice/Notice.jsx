import {
  Box,
  Stack,
  Fab,
  Tooltip,
  createTheme,
  ThemeProvider,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { noticeSchema } from "../../../yupSchema/noticeSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";

//icons

import AddIcon from "@mui/icons-material/Add";
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
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  //filtering audience
  const [filter, setFilter] = useState("all"); // all | student | teacher

  // Filtered notices before rendering
  const filteredNotices = notices.filter((n) => {
    if (filter === "all") return true;
    return n.audience === filter;
  });

  const handleAdd = () => {
    setEditId(null); // make sure we're not in edit mode
    Formik.resetForm(); // clear old values
    setShowForm(true); // show the Add Notice form
  };

  const handleEdit = (id, title, message, audience) => {
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
    Formik.resetForm();
    setShowForm(false);
  };
  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`${baseApi}/notice/delete/${id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setMessageType("success");
      })
      .catch((e) => {
        console.log(e);
        setMessage("Error in Deleting Notice..");
        setMessageType("error");
      });
  };

  const Formik = useFormik({
    initialValues: { title: "", message: "", audience: "" },
    validationSchema: noticeSchema,
    onSubmit: (values) => {
      console.log(values);
      if (edit) {
        axios
          .patch(`${baseApi}/notice/update/${editId}`, { ...values })
          .then((resp) => {
            setMessage(resp.data.message);
            setMessageType("success");
            cancelEdit();
          })
          .catch((e) => {
            console.log("Error in Notice updating", e);
            setMessage("Error in Updating Notice");
            setMessageType("error");
          });
      } else {
        axios
          .post(`${baseApi}/notice/create`, { ...values })
          .then((resp) => {
            console.log("Notice add response", resp);
            setMessage(resp.data.message);
            setMessageType("success");
            FetchAllNotices();
          })
          .catch((e) => {
            console.log("Error in Notice", e);
            setMessage("Error in saving Notice");
            setMessageType("error");
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
      <Box
        sx={{
    minHeight: "100vh",
    p: 4,
    bgcolor: "transparent", // ✅ no extra background
    color: "white", // ✅ ensures text is readable on wood background
    backdropFilter: "blur(2px)", // ✅ subtle polish effect
  }}
      >
        {message && (
          <MessageSnackbar
            message={message}
            type={messageType}
            handleClose={handleMessageClose}
          />
        )}
        <Typography
  variant="h3"
  sx={{
    textAlign:"center",
      mb: 2,
      background: "linear-gradient(90deg, #ff9800, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
>
  Notice Board
</Typography>

        {showForm && (
          <Box
            component="form"
            sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      width: { xs: "90%", sm: "70%", md: "50%" },
      margin: "auto",
      p: 3,
      borderRadius: 4,
      background: "rgba(255, 255, 255, 0.1)", 
      backdropFilter: "blur(10px)",       
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        transform: "translateY(-3px)",
      },
    }}
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
          >
            {edit ? (
              <Typography
                variant="h5"
                sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 1,
          color: "#fff", // ✅ white title
          textShadow: "0px 0px 8px rgba(255,255,255,0.7)",
          letterSpacing: "0.5px",
        }}
              >
                Edit Notice
              </Typography>
            ) : (
              <Typography
                variant="h6"
                sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#fff",
          textShadow: "0px 0px 8px rgba(255,255,255,0.6)",
        }}
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
              <InputLabel id="demo-simple-select-label">Audience</InputLabel>
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
                helperText={Formik.touched.audience && Formik.errors.audience}
              >
                <MenuItem value={""}>Select Audience</MenuItem>
                <MenuItem value={"teacher"}>Teacher</MenuItem>
                <MenuItem value={"student"}>Student</MenuItem>
              </Select>
            </FormControl>

            <Button sx={{
    width: "140px",
    mt: 2,
    py: 1.2,
    fontWeight: "bold",
    fontSize: "1rem",
    borderRadius: "12px",
    color: "#fff",
    background: "linear-gradient(90deg, #ff9800, #ff5722)",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(90deg, #2a5298, #1e3c72)", // blue gradient on hover
      transform: "scale(1.05)",
      boxShadow: "0px 6px 16px rgba(0,0,0,0.5)",
    },
  }} type="submit" variant="contained">
              {edit ? "Update" : "Submit"}
            </Button>

            {edit && (
              <Button
                onClick={cancelEdit}
                type="button  "
                variant="outlined"
                 sx={{
      width: "140px",
      mt: 2,
      py: 1.2,
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "12px",
      color: "#fff",
      background: "linear-gradient(90deg, #e53935, #b71c1c)", // red gradient
      boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(90deg, #8e0000, #5a0000)", // darker red on hover
        transform: "scale(1.05)",
        boxShadow: "0px 6px 16px rgba(0,0,0,0.5)",
      },
    }}
              >
                Cancel
              </Button>
            )}
          </Box>
        )}

        <paper
          elevation={6}
          sx={{
            display: "flex",
            justifyContent: "center", // centers buttons horizontally
            alignItems: "center",
            gap: 2, // spacing between buttons
            p: 2,
            mb: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <Stack
            direction="row" // ✅ keep them horizontal
            spacing={2} // ✅ adds gap between buttons
            justifyContent="center" // ✅ center horizontally
            alignItems="center"
          >
            <Button
              variant={filter === "student" ? "contained" : "outlined"}
              onClick={() => setFilter("student")}
              sx={{
      px: 3,
      py: 1.2,
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "12px",
      color: "#fff",
      background:
        filter === "student"
          ? "linear-gradient(90deg, #ff9800, #ff5722)" // orange gradient when active
          : "transparent",
      border: filter === "student" ? "none" : "2px solid #ff9800",
      "&:hover": {
        background: "linear-gradient(90deg, #2a5298, #1e3c72)", // deep blue gradient
        color: "#fff",
      },
    }}
            >
              Student Notice
            </Button>

            <Button
              variant={filter === "teacher" ? "contained" : "outlined"}
              onClick={() => setFilter("teacher")}
               sx={{
      px: 3,
      py: 1.2,
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "12px",
      color: "#fff",
      background:
        filter === "teacher"
          ? "linear-gradient(90deg, #ff9800, #ff5722)"
          : "transparent",
      border: filter === "teacher" ? "none" : "2px solid #ff9800",
      "&:hover": {
        background: "linear-gradient(90deg, #2a5298, #1e3c72)",
        color: "#fff",
      },
    }}
            >
              Teacher Notice
            </Button>

            <Button
              variant={filter === "all" ? "contained" : "outlined"}
              onClick={() => setFilter("all")}
              sx={{
      px: 3,
      py: 1.2,
      fontWeight: "bold",
      fontSize: "1rem",
      borderRadius: "12px",
      color: "#fff",
      background:
        filter === "all"
          ? "linear-gradient(90deg, #ff9800, #ff5722)"
          : "transparent",
      border: filter === "all" ? "none" : "2px solid #ff9800",
      "&:hover": {
        background: "linear-gradient(90deg, #2a5298, #1e3c72)",
        color: "#fff",
      },
    }}
            >
              All Notice
            </Button>
          </Stack>
        </paper>

        <Box
          component={"div"}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mt: 4,
          }}
        >
          {filteredNotices.length > 0 ? (
            filteredNotices.map((x) => (
              <Paper
                key={x._id}
                elevation={6}
                sx={{
          p: 3,
          width: 300,
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.08)", // glass effect
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px) scale(1.02)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
          },
        }}
              >
                <Box component={"div"}>
                  <Typography
                    variant="h6"
                    sx={{
              mb: 1,
              fontWeight: "bold",
              color: "#ff9800", // orange title
            }}
                  >
                    <b>Title :</b> {x.title}
                  </Typography>

                  <Typography variant="body2"  sx={{ mb: 1, color: "#f5f5f5", lineHeight: 1.6 }}>
                    <b>Message :</b> {x.message}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
              color: "#ff5722",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
                  >
                    For : {x.audience}
                  </Typography>
                </Box>
                <Box component={"div"} sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                  <Button
                    sx={{
              borderRadius: "10px",
              px: 2,
              py: 0.8,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff9800, #ff5722)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #2a5298, #1e3c72)",
              },
            }}
                    onClick={() => {
                      handleEdit(x._id, x.title, x.message, x.audience);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    sx={{
              borderRadius: "10px",
              px: 2,
              py: 0.8,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #e53935, #b71c1c)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #8e0000, #5a0000)",
              },
            }}
                    onClick={() => {
                      handleDelete(x._id);
                    }}
                  >
                    <DeleteSweepIcon />
                  </Button>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography sx={{ m: 2, color: "#fff" }}>No notices</Typography>
          )}
        </Box>
        <Tooltip title="Add Notice">
          <Fab
           
            aria-label="add"
            onClick={handleAdd}
            sx={{
      position: "fixed",
      bottom: 30,
      right: 30,
      background: "linear-gradient(135deg, #ff9800, #ff5722)",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        background: "linear-gradient(135deg, #2a5298, #1e3c72)",
        transform: "scale(1.15) rotate(8deg)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
      },
    }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
}
