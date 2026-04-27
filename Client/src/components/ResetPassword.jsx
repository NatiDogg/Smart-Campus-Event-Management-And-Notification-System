import React, { useEffect, useState,useContext } from 'react'
import {useSearchParams} from 'react-router-dom'
import aauLogo from '../assets/aauLogo4.jpg'
import { useResetPassword } from '../hooks/useAuth'
import { AppContext } from '../context/ContextProvider'
import Loading from '../components/Loading'
const ResetPassword = () => {
       const {navigate} = useContext(AppContext)
       const [searchParams] = useSearchParams()
       const token = searchParams.get('token');

       const [error, setError] = useState(false)
       const [userData, setuserData] = useState({
         token: '',
         password: '',
         confirmPassword: ''
       });
       const {isPending,mutate} = useResetPassword()

       useEffect(()=>{
           if(token){
             setuserData(prevData=>({
                ...prevData,
                token
             }))
           }
           else{
             navigate('/login')
           }
       },[token])

    const handleInput = (e)=>{
        const {name, value} = e.target
        setuserData(prevData=>({
            ...prevData,
            [name]: value
        }))
    }

    const onSubmitHandler = (e)=>{
         e.preventDefault()
         if(userData.password !== userData.confirmPassword){
             setError(true)
             return
         }
         setError(false)
         const data = {password: userData.confirmPassword,token: userData.token}
         mutate(data,{
            onSuccess:()=>{
                navigate('/login')
            }
         })

    }
       
    if(!token) return null
       
  return (
    <section className="bg-gray-50 dark:bg-gray-900 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen  lg:py-0">
        <h1 className="text-xl font-bold mb-8 tracking-tight text-white">
          CampusEvents
        </h1>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change Password
          </h2>
          <form
            onSubmit={onSubmitHandler}
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            action="#"
          >
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <input
                value={userData.password}
                onChange={(e) => handleInput(e)}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                onChange={(e) => handleInput(e)}
                value={userData.confirmPassword}
                type="password"
                name="confirmPassword"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            {error && (
              <div
                className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200 dark:border-red-900"
                role="alert"
              >
                <span className="font-medium"></span> Passwords Don't Match
              </div>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-all duration-200 hover:-translate-y-1"
            >
                {
                    isPending ? (<Loading size='sm' />) : (' Reset password')
                }
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;