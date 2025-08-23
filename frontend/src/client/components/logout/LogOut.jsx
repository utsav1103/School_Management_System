import { useContext , useState, useEffect} from "react";
import { Navigate, useNavigate } from "react-router-dom";
//import { AuthContext } from "../../context/AuthContext";
import {AuthContext} from "../../../context/AuthContext"
export default function LogOut() {
  
    const {logout} = useContext(AuthContext)
    const navigate = useNavigate()
  useEffect(()=>{
    logout();
    navigate("/login")
  },[])
  return(<>Log Out</>)

}
