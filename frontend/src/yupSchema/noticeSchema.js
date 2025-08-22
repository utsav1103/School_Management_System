import * as yup from 'yup';

export const noticeSchema = yup.object({
    title:yup.string().required("Title is required"),
    message:yup.string().required("message is required"),
    audience:yup.string().required("Audience is required"),
})