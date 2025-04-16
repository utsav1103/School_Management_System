
import { Outlet } from "react-router-dom"
import Navbar from "./utility components/navbar/Navbar"
export default function Client(){



    return (<>

        <Navbar/>    

        <Outlet/>
    </>
    )
}