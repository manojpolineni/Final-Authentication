/* eslint-disable react/prop-types */
import {  createContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import axios from 'axios';
// import Cookies from "js-cookie";

// eslint-disable-next-line react-refresh/only-export-components

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [userData, setUserData] = useState(null);
      const [token, setToken] =  useState(sessionStorage.getItem("token"));


      const getAuthUser = async ()=>{
            try {
                  if(!token) return;
                  axios.defaults.withCredentials = true;
                  const {data} = await axios.get(backendUrl + '/api/users/is-auth')

                  if(data.success){
                        setIsLoggedIn(true);
                        getUserData();
                  }
                  else{
                        setIsLoggedIn(false)
                        setUserData(null)
                  }
            } catch (error) {
                  console.error(error.response?.data?.message || error.message);
                  toast.error(error.response?.data?.message || "Authentication failed!");
                  setIsLoggedIn(false)
                  setUserData(null)
            }
      }

      const getUserData = async ()=>{
            try {
                   axios.defaults.withCredentials = true;
                  const {data} = await axios.get(backendUrl + '/api/users/currentuser')

                  if (data.success){
                        setUserData(data.singleUser)
                  } else{
                        toast.error(data.message)
                  }
            } catch (error) {
               toast.error(error.message) 
            }
      } 

      useEffect(()=>{
            if(token){
                  getAuthUser();
            }
      }, []);

      const value ={
            backendUrl,
            isLoggedIn,
            userData, 
            getUserData,
            setIsLoggedIn, 
            setUserData,
            setToken,
      } 

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;