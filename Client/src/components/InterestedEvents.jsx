import React from 'react'
import EventCard from './EventCard.jsx'

const InterestedEvents = ({events, isLoading,activeTab}) => {


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

export default InterestedEvents