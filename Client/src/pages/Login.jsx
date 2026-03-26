import React,{useState,useContext} from 'react'
import landingImg from '../assets/aaugbi2.webp'
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useLoginUser } from '../hooks/useAuth';
import Loading from '../components/Loading';
import { AppContext } from '../context/ContextProvider';
import { googleSignInUrl } from '../api/auth';

const Login = () => {
       const [formData, setFormData] = useState({
           email: '',
           password: ''
       });
       const {data,error,isPending,mutate} = useLoginUser()
       const {user,navigate} = useContext(AppContext);

        const handleInput = (e)=>{
            const {value,name} = e.target
            setFormData((prevData)=>({
                ...prevData,
                [name]: value
            }))
        }

       const onSubmit = (e)=>{
           e.preventDefault()
           mutate(formData,{onSuccess:(data)=>{
               const role = data.user.role
               if ( role === "admin" || role === "student" || role === "organizer") {
                 navigate(`/${role}`);
               } else {
                 navigate("/"); // Fallback
               }
           }})
       }
      
       
  return (
    <section className="w-full flex flex-col items-center justify-center lg:justify-start min-h-screen">
      <div className="flex h-165 w-full px-3 py-2">
        <div className="w-full hidden lg:block">
          <img
            className="h-full object-cover"
            width={1000}
            src={landingImg}
            alt="dev connect image"
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <form onSubmit={onSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-gray-900 font-medium">Log in</h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Welcome back! Please log in to continue
            </p>
        
            <button
              onClick={googleSignInUrl}
              type="button"
              className="w-full mt-8 bg-gray-500/10 flex items-center text-gray-600 cursor-pointer hover:bg-gray-200 gap-2 justify-center h-12 rounded-full"
            >
              <FcGoogle /> <span>Login with Google</span>
            </button>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
              <p className="w-full text-nowrap text-sm text-gray-500/90">
                or log in with email
              </p>
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="#6B7280"
                />
              </svg>
              <input
                name="email"
                value={formData.email}
                onChange={(e)=>handleInput(e)}
                type="email"
                placeholder="Email "
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#6B7280"
                />
              </svg>
              <input
                name="password"
                value={formData.password}
                onChange={(e)=>handleInput(e)}
                type="password"
                placeholder="Password"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            {/*<div class="w-full flex items-center justify-between mt-8 text-gray-500/80">
                <div class="flex items-center gap-2">
                    <input class="h-5" type="checkbox" id="checkbox" />
                    <label class="text-sm" for="checkbox">Remember me</label>
                </div>
                <a class="text-sm underline" href="#">Forgot password?</a>
            </div>*/}

            <button
            disabled={isPending}
              type="submit"
              className="mt-8 w-full h-11 rounded-full text-white bg-blue-700 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {isPending ? (<Loading size='sm' />) : 'Login'}
            </button>
            <p className="text-gray-500/90 text-sm mt-6">
              Don’t have an account?{" "}
              <Link
                to={"/signin"}
                className="text-indigo-400 hover:underline hover:text-indigo-500"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;