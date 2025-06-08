import axios from "axios"
import { useEffect } from "react"
import { baseApi } from "../../../environment"

export default function Dashboard() {

    const fetchSchool = () => {
        axios.get(`${baseApi}/school/fetch-single`).then(resp => {
           console.log(resp) 
        }).catch(e => {
            console.log("Error", e)
        })
    }

    useEffect(()=> {
fetchSchool();
    },[])
    return (
        <>
            <h1>Dashboard</h1>
        </>
    )
}