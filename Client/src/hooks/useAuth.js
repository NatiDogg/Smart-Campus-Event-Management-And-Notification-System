import react, {useContext} from "react";
import { loginUser, registerUser } from "../api/auth";
import {useMutation} from '@tanstack/react-query'
import { AppContext } from "../context/ContextProvider";
import {toast} from 'react-hot-toast'
import api from "../api/axios";
export const useRegisterUser = ()=>{
      const { setUser, setToken } = useContext(AppContext);
      return useMutation({
        mutationFn: registerUser,
        onSuccess:(data)=>{
            setUser(data.user);
            setToken(data.accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            toast.success(data.message)
        },
        onError:(error)=>{
          const message = error.response?.data?.message || "Registration failed";
            const status = error.response?.status;
         // Only show toast if it's a server crash (500)
         if (status >= 500) {
         toast.error("Our servers are having trouble. Please try later.");
          }
        }
      })
}
export const useLoginUser = ()=>{
   const { setUser, setToken } = useContext(AppContext);
  return useMutation({
    mutationFn: loginUser,
    onSuccess:(data)=>{
        setUser(data.user);
        setToken(data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
         toast.success(data.message)
    },
    onError: (error)=>{
       const errorMessage = error.response?.data?.message || "Login Failed"
       const status = error.response?.status;
         // Only show toast if it's a server crash (500)
         if (status >= 500) {
         toast.error("Our servers are having trouble. Please try later.");
          }
    }
  })
}