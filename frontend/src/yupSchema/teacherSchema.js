import * as yup from "yup";

export const teacherSchema = yup.object({
  name: yup.string().required("School Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  age: yup.string().required("Student age is required"),
  gender: yup.string().required("Gender is required"),
  qualification: yup.string().required("Qualifiaction is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const teacherEditSchema = yup.object({
  name: yup.string().required("School Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  age: yup.string().required("Student age is required"),
  gender: yup.string().required("Gender is required"),
  qualification: yup.string().required("Qualifiaction is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
