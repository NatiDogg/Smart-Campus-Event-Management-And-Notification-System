import React,{useContext, useState} from 'react'
import { Link} from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import {useRegisterUser} from '../hooks/useAuth'
import Loading from '../components/Loading';
import { AppContext } from '../context/ContextProvider';
import { googleSignInUrl } from '../api/auth';
const Signin = () => {
       const {data,mutate,isPending,error} = useRegisterUser();
       const {navigate} = useContext(AppContext)
       const [formData, setFormData] = useState({
         fullName: '',
         studentId: '',
         email: '',
         password: ''
       });
       const handleInput = (e)=>{
          const {value,name} = e.target
          setFormData((prevData)=>({
            ...prevData,
             [name] : value
          }))
       }
       const onSubmitHandler = (e)=>{
         e.preventDefault()
         mutate(formData,{
           onSuccess: (data)=>{
              
              const role = data?.user?.role?.toLowerCase() || undefined 
              if(role.toLowerCase() === 'student'){
                  
                navigate(`/student`)
              }
              else{
                 navigate('/')
              }
           }
         });
       }
       
  return (
    <section className="w-full min-h-screen p-5 flex flex-col justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white  shadow-2xl shadow-gray-500 text-gray-500 max-w-100 w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg"
      >
        
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          SmartCampus Events
        </h2>
        <p className="text-sm text-gray-400 text-center ">
          Connecting the university community
        </p>
        <div className="flex items-center mt-5 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={(e) => handleInput(e)}
            className="w-full outline-none bg-transparent py-2.5"
            type="text"
            placeholder="Full Name"
            required
          />
        </div>
        <div className="flex items-center mt-5 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            name="studentId"
            value={formData.studentId}
            onChange={(e) => handleInput(e)}
            className="w-full outline-none bg-transparent py-2.5"
            type="text"
            placeholder="Student Id"
            required
          />
        </div>
        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            name="email"
            value={formData.email}
            onChange={(e) => handleInput(e)}
            className="w-full outline-none bg-transparent py-2.5"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex items-center mt-2 mb-8 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 7.5c0-.552-.448-1-1-1h-.5V4.5c0-1.933-1.567-3.5-3.5-3.5S4 2.567 4 4.5v2h-.5c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9c.552 0 1-.448 1-1v-6zM5 4.5c0-1.381 1.119-2.5 2.5-2.5S10 3.119 10 4.5V6.5H5v-2z"
              fill="#9CA3AF"
            />
          </svg>
          <input
            onChange={(e) => handleInput(e)}
            name="password"
            value={formData.password}
            className="w-full outline-none bg-transparent py-2.5"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button
          disabled={isPending}
          type="submit"
          className="w-full mb-3 cursor-pointer bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium"
        >
          {isPending ? (
           
            <>
              <Loading size="sm" />
            </>
              
        
          ) : (
            "Create Account"
          )}
        </button>
        <button 
          onClick={googleSignInUrl}
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 px-4 py-2 bg-white   border border-gray-100 rounded-md shadow-sm hover:bg-gray-100 transition-colors text-gray-700 font-medium font-sans"
        >
          <FcGoogle className="text-xl" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-blue-500 hover:underline hover:text-blue-600"
          >
            Log In
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Signin