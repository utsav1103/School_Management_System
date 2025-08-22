import * as yup from 'yup';

export const noticeSchema = yup.object({
    title:yup.string().required("Title is required"),
    description:yup.string().required("Description is required"),
    audience:yup.string().required("Audience is required"),
})