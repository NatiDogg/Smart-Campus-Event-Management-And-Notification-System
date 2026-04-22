import React,{useContext,useEffect,useState} from 'react'
import {AppContext} from '../../context/ContextProvider'
import {Icons} from '../../components/Icons'
import { Link } from 'react-router-dom'
import { useGetRecommendations } from '../../hooks/useStudent'
import EventCard from '../../components/EventCard'
import Loading from '../../components/Loading'
const Home = () => {

     const {user} = useContext(AppContext)
     const {data: recommendations,isLoading: isRecommendationsLoading,isError} = useGetRecommendations()
 
      
     
     
  return (
    <div className="flex flex-col gap-12 p-5">
      <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-12 text-white shadow-2xl overflow-hidden relative group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Hello, {user?.fullName.split(" ")[0] || "User"}! 👋
            </h2>
            <p className="text-blue-100 text-[16px] max-w-lg leading-relaxed">
              You have 0 events coming up. Your AI-powered feed has found {recommendations?.length || 0} new events matching your interests.
            </p>
            <div className="flex flex-col items-center md:flex-row gap-4 pt-4">
              <Link to={"/student/events"}>
                <button className="bg-white  cursor-pointer text-blue-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                  Browse All Events
                </button>
              </Link>
              <Link to={"/student/calendar"}>
                <button className="bg-blue-500/30 cursor-pointer backdrop-blur-md text-white font-black px-8 py-4 rounded-2xl border border-white/20 hover:bg-blue-500/40 transition-all active:scale-95">
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 hidden md:flex  bg-purple-100 text-purple-600 rounded-2xl items-center justify-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </div>
            <div>
              <h6 className="text-xl font-black capitalize text-gray-900 tracking-tight">
                Our top AI recommendations
              </h6>
            </div>
          </div>
          <Link to={'/student/recommendations'}>
           <button className="text-sm font-bold cursor-pointer text-blue-600 hover:text-blue-800  px-5 py-2 rounded-full hover:underline transition-colors">
            View All
          </button>
          </Link>
        </div>
        {isRecommendationsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loading size="md" color="black" />
            <p className="mt-4 text-gray-500 animate-pulse">
              Analyzing your interests...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50/50 rounded-xl border border-red-100">
            <div className="text-red-500 mb-2">⚠️</div>
            <h3 className="text-red-800 font-semibold">
              Couldn't load recommendations
            </h3>
            <p className="text-red-600 text-sm text-center">
              The AI service is temporarily busy. Please refresh or try again
              later.
            </p>
          </div>
        ) : recommendations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 gap-1  border-gray-200 rounded-2xl">
            <div className='rounded-full p-4 bg-blue-50'><Icons.Explore /></div>
            <p className="text-gray-400 text-sm text-center">
              No specific matches found yet. <br />
              Join more events to help us learn what you like!
            </p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations?.slice(0,3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home