import React from 'react'
import Loading from './Loading.jsx'
import EventCard from './EventCard.jsx'
const RegisteredEvents = ({events, isLoading,activeTab}) => {


  if(isLoading){
     return <div className='flex flex-col items-center justify-center m-5 p-5'><Loading size='md' color='black' /></div>
   }






  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {events.map(event => (
          <div key={event._id} >
            <EventCard event={event} />
          </div>
        ))}
      </div>
  )
}

export default RegisteredEvents



{
    /* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {currentEvents.map(event => (
          <div key={event.id} className={activeFilter === 'attended' ? 'opacity-80 grayscale hover:grayscale-0 transition-all' : ''}>
            <EventCard event={event} onClick={onEventClick} />
          </div>
        ))}
      </div>*/
}