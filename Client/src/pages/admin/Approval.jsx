import React from 'react'
import { useGetPendingEvents,useApproveEvent,useRejectEvent } from '../../hooks/useEvent'
import {format} from 'date-fns'
import Loading from '../../components/Loading.jsx'
import { Icons } from '../../components/Icons.jsx'


const Approval = () => {

   const {data,isLoading,isFetching,error} = useGetPendingEvents()
   const {mutate:approveEvent, isPending: isApproving} = useApproveEvent();
   const {mutate:rejectEvent, isPending: isRejecting} = useRejectEvent();
    const approveEventHandler = (eventId)=>{
       if(eventId){
        approveEvent(eventId);
       }
    }
    const rejectEventHandler = (eventId)=>{
       if(eventId){
        rejectEvent(eventId)
       }
    }
  return (
    <div className="space-y-8 p-5 ">
      <div className="flex items-center gap-6 justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Event Approvals
          </h1>
          <p className="text-gray-500 text-sm">
            Review and manage event submissions from campus organizers.
          </p>
        </div>
        <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
          <button className="px-6 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs md:text-sm text-nowrap font-bold">
           Pending ({isLoading ? '...' : (data?.events?.length || 0)})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isLoading && (
          <div className="mt-10 flex flex-col justify-center items-center">
            <Loading size="md" color="black" />
          </div>
        )}
        {!isLoading && (data && data?.events?.length === 0 || error ) && (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Icons.Explore className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Pending Events found</h3>
            <p className="text-gray-500 max-w-xs text-sm mt-2">
              There are currently no Pending Events. Please check out later
            </p>
          </div>
        )}
        {data && 
          data.events?.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row p-6 gap-8 hover:shadow-xl transition-all group"
            >
              <div className="lg:w-72 h-48 rounded-2xl overflow-hidden shadow-inner shrink-0">
                <img
                  src={event.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="event image"
                />
              </div>

              <div className="flex-1 flex flex-col gap-3 justify-between py-2">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-none md:bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-full ">
                      {event.category?.name || 'Category Deleted'}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {`${format(new Date(event.startDate), "PPP")} ${format(
                        new Date(event.startDate),
                        "p"
                      )}`}{" "}
                      -{" "}
                      {`${format(new Date(event.endDate), "PPP")} ${format(
                        new Date(event.endDate),
                        "p"
                      )}`}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
                    {event.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                     <div className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      Organizer:{" "}
                      <span className="text-blue-600">
                        {event.organizedBy?.organizationName ||
                          "Deleted Organizer"}
                      </span>
                    </span>
                     </div>
                     <div className='flex items-center gap-1'>
                       <span className="text-sm font-bold text-gray-700">
                      Location:{" "}
                      <span className="text-gray-400">
                        {event.location}
                      </span>
                    </span>

                     </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-4 lg:mt-0">
                  <button disabled={isApproving} onClick={()=>approveEventHandler(event._id)} className="flex-1 cursor-pointer lg:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    {isApproving ? (<Loading size='sm' />) : ('Approve Event')}
                  </button>
                  <button disabled={isRejecting} onClick={()=>rejectEventHandler(event._id)} className="flex-1 cursor-pointer lg:flex-none  px-10 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-red-700 transition-all">
                    {isRejecting ? (<Loading size='sm' />) : ('Reject Event')}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Approval