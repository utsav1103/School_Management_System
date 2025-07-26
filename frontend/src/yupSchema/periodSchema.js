import * as yup from 'yup';

export const periodSchema = yup.Schema({
    teacher:yup.string().required("Teacher is required"),
    subject:yup.string().required("Subject is required"),
    period:yup.string().required("Period is required"),
    date:yup.date().required("Date is required")
})
