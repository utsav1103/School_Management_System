import * as yup from 'yup';

export const classSchema = yup.object({
    class_text:yup.string().min(2, "atleast 2 character is required").required("Class Text is required"),
    class_num:yup.string().required("Class Number is required"),
})