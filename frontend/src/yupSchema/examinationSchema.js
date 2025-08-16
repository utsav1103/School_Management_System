import * as yup from 'yup';

export const examinationSchema = yup.object({
    date:yup.date().required("Date is required"),
    subject:yup.string().required("Subject is required"),
    examType:yup.string().required("Exam type required"),
})
