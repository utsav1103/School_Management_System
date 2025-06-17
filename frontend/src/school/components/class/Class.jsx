import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";

export default function Class(){
    const Formik = useFormik({
        initialValues: {class_text:"", class_num:""},
        validationSchema:classSchema,
        onSubmit:(values)=>{
            console.log(values)
        }
    })
    return (
        <>
        <h1>Class</h1>
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
         <Typography
          variant="h6" sx={{textAlign:"center" , fontWeight:"bold"}}
        >
          Add New Class
        </Typography>
        

       

        <TextField
          name="class_text"
          label="Class Text"
          value={Formik.values.class_text}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
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
        />

        {Formik.touched.class_num && Formik.errors.class_num && (
          <p style={{ color: "red", textTransform: "capitalize" }}>
            {Formik.errors.class_num}
          </p>
        )}

       

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
        </>
    )
}