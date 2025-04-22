import * as yup from "yup";

export const registerSchema = yup.object({
    school_name: yup.string()
    .required("School Name is required"),
    email: yup.string()
    .email("Invalid email address")
    .required("Email is required"),
    owner_name: yup.string()
    .required("Owner Name is required"),
    password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"), 
    confirm_password: yup.string()
    .oneOf([yup.ref("password"), null],
     "Passwords must match")
    .required("Confirm Password is required"),
})