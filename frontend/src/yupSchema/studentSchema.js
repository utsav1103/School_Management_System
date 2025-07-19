import * as yup from "yup";

export const studentSchema = yup.object({
  name: yup.string().required("School Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  student_class: yup.string().required("Student Class is required"),
  age: yup.string().required("Student age is required"),
  gender: yup.string().required("Gender is required"),
  guardian: yup.string().required("Guardian is required"),
  guardian_phone: yup
    .string()
    .min(10, "Not a valid number")
     .max(10, "invalid number")
    .required("Guardian Contact is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const studentEditSchema = yup.object({
  name: yup.string().required("School Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  student_class: yup.string().required("Student Class is required"),
  age: yup.string().required("Student age is required"),
  gender: yup.string().required("Gender is required"),
  guardian: yup.string().required("Guardian is required"),
  guardian_phone: yup
    .string()
    .min(10, "Not a valid number")
     .max(10, "invalid number")
    .required("Guardian Contact is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
