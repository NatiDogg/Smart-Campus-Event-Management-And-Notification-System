import react, {useContext,useEffect} from "react";
import { loginUser, logoutUser, registerUser,verifySession } from "../api/auth";
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
      onSuccess:(data)=>{
         setUser(null);
         setToken(null);
        delete api.defaults.headers.common['Authorization'];
         queryClient.removeQueries({queryKey: ["session"]})
         toast.success(data.message || "Logged out successfully");

      },
      onError: (error)=>{
        toast.success("Logged out successfully")
      }
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