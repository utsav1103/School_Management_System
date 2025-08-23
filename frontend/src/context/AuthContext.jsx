import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

    useEffect(()=> {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if(userStr){ setUser(JSON.parse(userStr))};
        if(token){ setAuthenticated(true)};

    }, [])
        //at login we will call this funciton
        const login = (credentials)=> {
            setAuthenticated(true);
            setUser(credentials)
        }

        const logout = ()=> {
            localStorage.removeItem("token");
            localStorage.removeItem("user")
            setAuthenticated(false);
            setUser(null)
        }



  return (
    <AuthContext.Provider value={{ authenticated, user , login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
