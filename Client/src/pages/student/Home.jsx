import React,{useContext,useState} from 'react'
import {AppContext} from '../../context/ContextProvider'
import {Icons} from '../../components/Icons'
import { Link } from 'react-router-dom'
const Home = () => {

     const {user} = useContext(AppContext)
     console.log(user)
  return (
     <div className="flex flex-col gap-8 p-5">
      <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-12 text-white shadow-2xl overflow-hidden relative group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Hello, {user?.fullName || 'User'}! 👋</h2>
            <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
              You have 0 events coming up. 
                Your AI concierge has found 0 new events matching your interests.
            </p>
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Link to={'/student/events'}>
                <button 
                
                className="bg-white cursor-pointer text-blue-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95"
              >
                Browse All Events
              </button>
              </Link>
               <Link to={'/student/calendar'}>
                 <button 
               
                className="bg-blue-500/30 cursor-pointer backdrop-blur-md text-white font-black px-8 py-4 rounded-2xl border border-white/20 hover:bg-blue-500/40 transition-all active:scale-95"
              >
                View My Schedule
              </button>
               </Link>
            </div>
          </div>
          <div className="hidden lg:block w-64 h-64 bg-white/10 rounded-[3rem] backdrop-blur-xl border border-white/20 p-8 transform rotate-6 group-hover:rotate-12 transition-transform duration-700">
             <Icons.Calendar />
             <div className="mt-8 space-y-4 opacity-60">
                <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/20 rounded-full w-full"></div>
                <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
             </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      

      
    </div>
  )
}

export default Home