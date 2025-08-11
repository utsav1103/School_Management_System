import { useEffect } from "react"



export default function Attendee(classId){
    
    const [teachers, setteachers] = React.useState([]);
  const fetchteachers = () => {
    axios
      .get(`${baseApi}/teacher/fetch-with-query`, { params:{} })
      .then((resp) => {
        setteachers(resp.data.teachers);
      })
      .catch((e) => {
        console.log("error in fetching classes", e);
        
    });
  };
    
    
    
    
    useEffect(()=>{
      console.log("Class ID", classId)
      fetchteachers()
    },[classId])
    return(<>
    <h1>Attendee</h1>
    </>)

}