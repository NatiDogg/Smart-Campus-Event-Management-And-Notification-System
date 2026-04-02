import React,{useEffect, useContext,useState} from 'react'
import { AppContext } from '../context/ContextProvider'
import aauLogo from '../assets/aauLogo4.jpg'
import { useForgetPassword } from '../hooks/useAuth';
import Loading from './Loading'
const ForgotPassword = () => {
       const {user,navigate} = useContext(AppContext);
        const [email, setEmail] = useState('');
        const {data,isPending,mutate} = useForgetPassword()
       useEffect(()=>{
           if(user && user?.role){
              navigate(`/${user.role}`, {replace: true})
              return
           }
       },[user])
       if (user?.role) return null;

       const onSubmitHandler = (e)=>{
         e.preventDefault()
           mutate(email,{
            onSuccess:()=>{
                navigate('/login')
            }
           })
          setEmail('')
       }
       
  return (
    <section className="w-full p-2 min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white  shadow-2xl shadow-gray-500 text-gray-500 max-w-100 w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg"
      >
        
        <div  className="flex flex-col w-full items-center gap-1">
                  <div className="">
                    <img src={aauLogo} width={50} height={50} alt="aau logo" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    SmartCampus
                  </span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
               <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
               <p className="text-sm text-gray-500">Enter your university email and we'll send you a link to reset your password.</p>
               <input required name="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="name@university.edu" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />
               <button disabled={isPending} type='submit'  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 hover:-translate-y-1 cursor-pointer transition-all">
                 {isPending ? (<Loading size='sm' />) : ('Send Reset Link')}
              </button>
              <button onClick={()=> navigate('/login')} type='button' className="w-full cursor-pointer text-center text-sm font-bold text-gray-400 ">Back to Login</button>
             </div>
      </form>
    </section>
  )
}

export default ForgotPassword