import React,{useEffect,useContext} from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/ContextProvider';
import { useVerifyUser } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const GoogleSuccess = () => {
      const [searchParams] = useSearchParams();
      const token = searchParams.get('token')
      const navigate = useNavigate();
      const {setToken,setUser} = useContext(AppContext)
      const {data,isSuccess, isError,error} = useVerifyUser(token,{enabled: !!token})

      useEffect(()=>{
        if(!token){
            navigate("/login")
            return
        }
        if(isSuccess && data?.user){
            setToken(token);
            setUser(data.user)
           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate(`/${data.user.role}`, {replace: true});
        }
        // If verification failed
        if (isError || error) {
         navigate("/login",{replace: true});
        }
      },[isSuccess,isError,data,token,navigate,setToken, setUser])
     
  return (

    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* A nice loading spinner */}
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Setting up your CampusEvents account...</p>
      </div>
    </div>
  )
}

export default GoogleSuccess