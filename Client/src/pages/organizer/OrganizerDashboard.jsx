import React, { useState,useContext } from 'react'
import { Icons } from '../../components/Icons'
import { useGetOrganizerDashboard } from '../../hooks/useOrganizer'
import Loading from '../../components/Loading'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from "lucide-react";
import {format} from 'date-fns'
import {AppContext} from '../../context/ContextProvider'
const OrganizerDashboard = () => {
   const {setActiveModal} = useContext(AppContext);
  const { data: dashboardData, isLoading: isDashboardDataLoading } = useGetOrganizerDashboard();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const activeEvents = dashboardData?.activeEvents || [];
  const totalPages = Math.ceil(activeEvents.length / itemsPerPage);

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = activeEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-12 p-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className='flex flex-col gap-1'>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Organizer Dashboard</h2>
          <p className="text-gray-500 text-[16px]">Manage your events and impact at a glance.</p>
        </div>
        <Link to={'/organizer/create'}>
          <button className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-blue-700 transition-all active:scale-95">
            <Icons.Plus />
            Host New Event
          </button>
        </Link>
      </div>

      
      {isDashboardDataLoading ? <Loading size="sm" color="black" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData && dashboardData.dashboardInfo?.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-4">
                {stat.label.toLowerCase().includes('events') ? <Icons.Explore /> : stat.label.toLowerCase().includes('attendees') ? <Icons.Users /> : stat.label.toLowerCase().includes('pending') ? <Icons.Calendar /> : <Icons.Analytics />}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-gray-50 flex items-center gap-4 justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">My Active Events</h3>
            <Link to={'/organizer/events'}>
              <button className="text-xs cursor-pointer font-bold text-blue-600 hover:underline">View All Events</button>
            </Link>
          </div>

          <div className="flex-1">
            
            <div className="hidden md:flex bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4 border-b border-gray-100">
              <div className="flex-2">Event Details</div>
              <div className="flex-1 text-center">Status</div>
              <div className="flex-1 text-right">Actions</div>
            </div>

           
            <div className="divide-y divide-gray-50">
              
              {
                isDashboardDataLoading ? ( <div className="p-20 flex justify-center">
                                          <Loading size="md" color="black" />
                                          </div>)
                : currentEvents.length > 0 ? currentEvents.map(event => (
                <div key={event._id} className="flex flex-col md:flex-row md:items-center px-10 py-8 hover:bg-gray-50/50 transition-colors gap-4 md:gap-0">
                  
                  {/* Event Info */}
                  <div className="flex-2 flex items-center gap-6">
                    <img src={event.imageUrl} className="w-16 h-12 rounded-xl object-cover shadow-sm" alt="event" />
                    <div>
                      <span className="font-black text-gray-900 block leading-tight">{event.title}</span>
                      <span className="text-xs text-gray-400 font-medium">{format(new Date(event.startDate), 'PPP')} • {event.location}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex-1 flex md:justify-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      event.status.toLowerCase() === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                      event.status.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                      event.status.toLowerCase() === 'cancelled' ? 'bg-gray-50 text-gray-700 border-gray-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex-1 flex justify-start md:justify-end items-center gap-2">
                     <>
                        <Link to={`/organizer/edit/${event._id}`} >
                          <button  className="p-2 cursor-pointer text-gray-400 hover:text-red-600 transition-colors" title="Edit event">
                          <Icons.Edit />
                        </button>
                        </Link>
                        <button className="px-4 py-2 cursor-pointer bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all">
                          Check-In
                        </button>
                        <button onClick={()=>setActiveModal({name: 'cancel-event', data: event._id})} className="p-2 cursor-pointer text-gray-400 hover:text-red-600 transition-colors" title="Delete event">
                          <Icons.Cancel />
                        </button>
                      </>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">No active events found</div>
              )}
            </div>
          </div>

          {/* Pagination Footer */}
          {activeEvents.length > itemsPerPage && (
            <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{indexOfFirstEvent + 1}</span> to <span className="font-bold text-gray-900">{Math.min(indexOfLastEvent, activeEvents.length)}</span> of <span className="font-bold text-gray-900">{activeEvents.length}</span>
              </p>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => paginate(currentPage - 1)}
                  className="p-2 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => paginate(idx + 1)}
                    className={`w-8 h-8 cursor-pointer rounded-xl text-xs font-bold transition-all ${currentPage === idx + 1 ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => paginate(currentPage + 1)}
                  className="p-2 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-[2.5rem] max-h-fit border border-gray-100 shadow-sm p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Recent Feedback</h3>
            <Link to={'/organizer/feedback'}>
              <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer tracking-widest">View All</button>
            </Link>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Alex J.', comment: 'Loved the React workshop!', rating: 5 },
              { name: 'Maria G.', comment: 'Great content, very clear.', rating: 4 },
              { name: 'Sven S.', comment: 'Networking was top notch.', rating: 5 },
            ].map((fb, i) => (
              <div key={i} className="space-y-2 group cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{fb.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(fb.rating)].map((_, j) => (
                      <svg key={j} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 italic group-hover:text-gray-900 transition-colors">"{fb.comment}"</p>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-50">
             <div className="bg-blue-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black italic text-blue-600 tracking-widest mb-1">Tip</p>
                <p className="text-xs text-blue-700 font-medium leading-relaxed">Responding to feedback increases student trust by 80%.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerDashboard;