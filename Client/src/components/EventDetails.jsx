import React,{useState,useEffect,useContext} from 'react'
import { AppContext } from '../context/ContextProvider';
import { useParams } from 'react-router-dom';
import { useGetEventDetails } from '../hooks/useEvent';
import {ChevronLeft} from 'lucide-react'
import Loading from './Loading';
const EventDetails = () => {
 
      const {user,navigate} = useContext(AppContext)
      const {id} = useParams()
      const {data,isLoading,error} = useGetEventDetails(id, {enabled: !!id})


      const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);



      
    useEffect(()=>{
         if(data){
            console.log(data)
         }
    },[data])

    if(isLoading){
        return <div className='min-h-screen flex flex-col justify-center items-center'><Loading size='md' color='black' /></div>
    }

  return (
     <div className="max-w-6xl mx-auto space-y-8 p-5  pb-20">
      <button 
        onClick={()=>navigate('/student/events')}
        className="flex items-center gap-2 cursor-pointer text-sm group text-gray-500 font-bold hover:text-blue-600 transition-colors"
      >
        <ChevronLeft className='group-hover:-translate-x-1 transition-all duration-150' />
        Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">

          {/* Hero Section */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <img src={data?.event.imageUrl} className="w-full h-full object-cover" alt={data?.event.title} />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white pr-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-blue-400 text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg border border-blue-400/30">{data?.event.category.name}</span>
                
              </div>
              <h1 className="text-3xl md:text-4xl font-black drop-shadow-xl leading-tight">{data?.event.title || 'Cancelled Event'}</h1>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</p>
                  <p className="font-bold text-gray-900 leading-tight">{data?.event.startDate}<br/><span className="text-sm font-medium text-gray-500">{data?.event.endDate}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                  <p className="font-bold text-gray-900 leading-tight">{data?.event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</p>
                  <p className="font-bold text-gray-900 leading-tight">{data?.event.organizedBy.organizationName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h2 className="text-2xl font-black text-gray-900">About this event</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{data?.event.description}</p>
            </div>
          </div>

          {/* Feedback Section (Visible only for past or attended events) */}
          {data?.isAttended && (
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900">How was the event?</h2>
              </div>

              {data?.isfeedBackSubmitted ? (
                <div className="p-10 bg-green-50 border border-green-100 rounded-3xl text-center space-y-2">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-green-900">Feedback Submitted!</h3>
                  <p className="text-green-700 font-light">Thank you for sharing your experience. Your rating helps our community grow.</p>
                </div>
              ) : (
                <form  className="space-y-8">
                  <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">Rate your experience</p>
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-all hover:scale-125 active:scale-95"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={(hoverRating || rating) >= star ? '#FBBF24' : '#E5E7EB'}
                            className="w-8 h-8 drop-shadow-sm"
                          >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Give some Feedbacks</label>
                    <textarea
                      
                      rows={4}
                      placeholder="What did you learn? What could be improved?"
                      className="w-full px-6 py-4 rounded-2xl text-sm resize-none bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium placeholder-gray-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={rating === 0}
                    className="w-full py-5 bg-gray-900 text-white font-black text-sm rounded-2xl shadow-2xl hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl space-y-8 relative overflow-hidden">

              {/* Status Header */}
              <div className="flex justify-end items-center">
                
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                  <p className="text-lg font-black text-gray-900">Free</p>
                </div>
              </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <button 
                      disabled={data?.isAttended}
                      
                      className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 border-2 ${
                        data?.isRegistered
                        ? 'bg-green-600 border-green-600 text-white shadow-green-200' 
                          : data?.isAttended
                            ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-blue-600 border-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                      }`}
                    >
                      {data?.isRegistered ? 'Registered ✓'  : 'Register Now'}
                    </button>
                    <button 
                      
                      className={`w-full py-5 rounded-2xl font-black text-lg transition-all border-2 flex items-center justify-center gap-2 ${
                        data?.isInterested
                        ? 'bg-purple-50 border-purple-200 text-purple-700' 
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={data?.isInterested ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {data?.isInterested ? 'Interested' : 'Mark Interest'}
                    </button>
                  </div>

                  {/* Registered Students Summary */}
                  <div className="pt-6 border-t border-gray-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Students</p>
                      <span className="text-blue-600 font-black text-sm bg-blue-50 px-3 py-1 rounded-lg">{data?.registeredStudents.length || 0}</span>
                    </div>
                    
                  </div>
                </div>
              
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default EventDetails;