import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

export default function Gallery() {
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [schools, setSchools] = React.useState([]);
  const handleOpen = (school) => {
    setOpen(true);
    setSelectedSchool(school);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    bgcolor: "rgba(160, 151, 151, 0.8)",
    border: "2px solid #000",
    boxShadow: 24,
    p: 0.2,
    overflow: "auto",
  };

  React.useEffect(() => {
    axios
      .get(`http://localhost:3000/api/school/all`)
      .then((resp) => {
        console.log("School", resp);
        setSchools(resp.data.schools);
        // setMessage(resp.data.message);
        // setMessageType("success");
        // Formik.resetForm();
      })
      .catch((e) => {
        // setMessage(e.response.data.message);
        // setMessageType("error");
        console.log("Error", e); //error handling
      });
  }, []);

  return (
    <Box
      sx={{
        background: `url(/images/dark-wood.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 10px rgba(255,255,255,0.6)", // glowing white
          letterSpacing: "1px",
        }}
      >
        Registered Schools
      </Typography>
      <ImageList sx={{ width: "100%",margin:"0 auto",px:2, height: "auto" }} cols={3} gap={16}>
        {schools.map((school) => (
          <ImageListItem key={school.school_image} sx={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.3s",
            },
          }}>
            <img
              srcSet={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format`}
              alt={school.title}
              loading="lazy"
              onClick={() => {
                handleOpen(school);
              }}
              style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              display: "block",
            }}
            />
            <ImageListItemBar title={school.school_name} sx={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))",
              color: "white",
              fontWeight: "bold",
            }} position="below" />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          bgcolor: "rgba(20,20,20,0.9)", // dark modal bg
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: 24,
          borderRadius: "12px",
          p: 2,
          overflow: "auto",
        }}>
          <Typography
            id="modal-modal-description"
             sx={{
            mb: 2,
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 0 8px rgba(255,255,255,0.6)",
          }}
            variant="h6"
            
          >
            {selectedSchool && selectedSchool.school_name}
          </Typography>
          <img
            // srcSet={`./images/uploaded/school/${selectedSchool && selectedSchool.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={
              selectedSchool &&
              `./images/uploaded/school/${selectedSchool.school_image}`
            }
            alt={"school"}
            style={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
            borderRadius: "8px",
          }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
