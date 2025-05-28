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
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
    <Box>
      <ImageList sx={{ width: "100%", height: "auto" }}>
        {schools.map((school) => (
          <ImageListItem key={school.school_image}>
            <img
              srcSet={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format`}
              alt={school.title}
              loading="lazy"
              onClick={() => {
                handleOpen(school);
              }}
            />
            <ImageListItemBar title={school.school_name} position="bselow" />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <img
            // srcSet={`./images/uploaded/school/${selectedSchool && selectedSchool.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={
              selectedSchool &&
              `./images/uploaded/school/${selectedSchool.school_image}`
            }
            alt={"alt"}
            style={{
    maxWidth: "100%",
    maxHeight: "80vh",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
  }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
