import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";
import axios from "axios";
import {baseApi} from "../../../environment";
import { useEffect, useState } from "react";

export default function Class(){
    const [classes, setClasses] = useState([])
    const Formik = useFormik({
        initialValues: {class_text:"", class_num:""},
        validationSchema:classSchema,
        onSubmit:(values)=>{
            console.log(values)

          axios.post(`${baseApi}/class/create`,{...values}).then( resp=>{
            console.log("class add response", resp)
            
          }).catch(e => {
            console.log("Error in class",e) 
          })
          Formik.resetForm()
        }
    })
    const FetchAllclasses = ()=>{
      axios.get(`${baseApi}/class/all`).then(resp=>{
        setClasses(resp.data.data)
      }).catch(e => {
            console.log("Error in fetching all class",e) 
          })
    }

    useEffect(()=>{
      FetchAllclasses();
    },[])

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

        <Box component={"div"} sx={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>

        {classes && classes.map(x =>{
          return(<Box key={x._id}>
            <Typography>Class:{x.class_text}[{x.class_num}]</Typography>
          </Box>)
        })}

        </Box>



        </>
    )
}