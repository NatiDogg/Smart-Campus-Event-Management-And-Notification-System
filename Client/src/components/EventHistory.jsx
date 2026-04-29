import React from 'react'
import Loading from './Loading.jsx'
import EventCard from './EventCard.jsx'
const EventHistory = ({events, isLoading, activeTab}) => {

   if(isLoading){
     return <div className='flex flex-col items-center justify-center m-5 p-5'><Loading size='md' color='black' /></div>
   }

    const getEmptyMessage = () => {
    switch (activeTab) {
      case 'history': return "No previous attended event found.";
      default: return 'No events found yet.'
    }
  };
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {events?.length > 0 ? ( events.map(event => (
              <div key={event._id} >
                <EventCard event={event} />
              </div>
            ))) : (
              <div className="text-center col-span-4   py-32 bg-white rounded-[3rem] border-gray-100">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                 activeTab === 'interested' ? 'bg-purple-50 text-purple-300': 
                'bg-green-50 text-green-300'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-black ">{getEmptyMessage()}</p>
            </div>)}
          </div>
  )
}

export default EventHistory