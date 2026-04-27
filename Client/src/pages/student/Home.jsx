import React,{useContext,useEffect,useState} from 'react'
import {AppContext} from '../../context/ContextProvider'
import {Icons} from '../../components/Icons'
import { Link } from 'react-router-dom'
import { useGetRecommendations,useGetStudentEvents, useGetSubscribedCategories } from '../../hooks/useStudent'
import {useGetAllEvents} from '../../hooks/useEvent'
import EventCard from '../../components/EventCard'
import Loading from '../../components/Loading'
const Home = () => {

     const [subscribedFeed, setSubscribedFeed] = useState([])
     const {user} = useContext(AppContext)
     
      const { data: recommendations, isLoading, isError } = useGetRecommendations()
     const {data: events,isLoading: isStudentEventsLoading,error:eventsError} = useGetStudentEvents()
     const {data:subscribedCategories, isLoading: isSubscribedCategoriesLoading,isError: subError} = useGetSubscribedCategories()
     const {data: allEvents, isLoading: isAllEventsLoading,isError: allEventsError} = useGetAllEvents()

      
 
     useEffect(() => {
       const categories = subscribedCategories?.preferredCategories;
       const events = allEvents?.result;

       if (categories && events) {
         
         const subscribedNamesSet = new Set(categories.map((cat) => cat.name));

         
         const subscribedEvents = events.filter((event) =>
          
           subscribedNamesSet.has(event.category.name)
         );

          setSubscribedFeed(subscribedEvents);
       }
     }, [allEvents, subscribedCategories]);
     
    
     const hasFeedError = subError || allEventsError;

     const upcomingEvents = events?.registeredEvents?.filter((event)=>{
         return new Date(event.endDate) >= new Date()
     }).length || 0;
     
  return (
    <div className="flex flex-col gap-12 p-5">
      <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-12 text-white shadow-2xl overflow-hidden relative group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Hello, {user?.fullName.split(" ")[0] || "User"}! 👋
            </h2>
            <p className="text-blue-100 text-[16px] max-w-lg leading-relaxed">
              You have {upcomingEvents || 0} events coming up.{" "}
              {recommendations?.length > 0
                ? `Your AI-powered feed has found ${
                    recommendations?.length || 0
                  } new events matching your interests`
                : `You are all caught up! 0 new recommendations found.`}
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
              <Link to={"/student/recommendations"}>
  <button className="relative overflow-hidden cursor-pointer bg-linear-to-r from-indigo-500 to-purple-500 text-white font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/40 transition-all active:scale-95 group">
    {/* Subtle Inner Glow effect */}
    <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></span>
    
    <span className="relative flex items-center gap-2">
      <Icons.Magic className="w-5 h-5" /> 
      Discover AI Picks
    </span>
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
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
            <div>
              <h6 className="text-xl font-black capitalize text-gray-900 tracking-tight">
                Your Subscribed Feed
              </h6>
            </div>
          </div>
          <Link to={"/student/subscription"}>
            <button className="text-sm font-bold cursor-pointer text-blue-600 hover:text-blue-800  px-5 py-2 rounded-full hover:underline transition-colors">
              View All
            </button>
          </Link>
        </div>
        {isSubscribedCategoriesLoading || isAllEventsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loading size="md" color="black" />
            <p className="mt-4 text-gray-500 animate-pulse">
              Getting your subscription feed...
            </p>
          </div>
        ) : hasFeedError || subscribedFeed?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 gap-1  border-gray-200 rounded-2xl">
            <div className="rounded-full p-4 bg-blue-50">
              <Icons.Explore />
            </div>
            <p className="text-gray-400 text-sm text-center">
              No specific matches found yet. <br />
              Subscribe to your favorite categories to fill your feed with
              events you'll love!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {subscribedFeed?.slice(0, 5).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 hidden md:flex  bg-orange-100 text-orange-600 rounded-2xl items-center justify-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-orange-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a.515.515 0 00.774-.002L21.75 4.5M21.75 4.5v5.338m0-5.338H16.41"
                />
              </svg>
            </div>
            <div>
              <h6 className="text-xl font-black capitalize text-gray-900 tracking-tight">
                Popular Around Campus
              </h6>
            </div>
          </div>
          <Link to={"/student/events"}>
            <button className="text-sm font-bold cursor-pointer text-blue-600 hover:text-blue-800  px-5 py-2 rounded-full hover:underline transition-colors">
              Explore All
            </button>
          </Link>
        </div>

        {isStudentEventsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loading size="md" color="black" />
            <p className="mt-4 text-gray-500 animate-pulse">
              Getting your Popular Events...
            </p>
          </div>
        ) : eventsError || events?.popularEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 gap-1  border-gray-200 rounded-2xl">
            <div className="rounded-full p-4 bg-blue-50">
              <Icons.Explore />
            </div>
            <p className="text-gray-400 text-sm text-center">
              No trending events at the moment. <br />
              New popular events will appear here soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.popularEvents.slice(0, 4).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home