import * as yup from 'yup'
  
export const subjectSchema = yup.object({
    subjet_name:yup.string().min(2, "Atleast 2 characters are required").required("Subject Name is required.."),
    subject_codename:yup.string().required("Subject Code is required.."),
})