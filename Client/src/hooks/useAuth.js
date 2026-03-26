import react, {useContext,useEffect} from "react";
import {  loginUser, logoutUser, registerUser,verifySession, verifyUser } from "../api/auth";
import {useMutation,useQuery, useQueryClient} from '@tanstack/react-query'
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
           toast.error(message)
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
         toast.error(errorMessage);
    }
  })
}



export const useLogoutUser = ()=>{
    const queryClient = useQueryClient()
    const { setUser, setToken } = useContext(AppContext);
    return useMutation({
      mutationFn: logoutUser,
      onSettled:(data,error)=>{
        setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      queryClient.removeQueries();
      toast.success(data?.message || "Logged out Successfully")
      if (error) {
        toast.success("Logged out Successfully")
        console.error("Logout API failed, but local session cleared", error);
      }
      }
    })
}

export const useVerifyUser = (token, options = {})=>{

     return useQuery({
      queryKey: ['me'],
      queryFn: ()=> verifyUser(token),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      ...options

     })
}


export const useVerifySession = () => {
  const { setUser, setToken } = useContext(AppContext);

  return useQuery({
    queryKey: ["session"],
    queryFn: verifySession,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

};