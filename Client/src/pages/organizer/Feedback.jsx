import React from 'react'
import {useGetFeedbacks} from '../../hooks/useFeedback'
import { MessageSquareOff, Star } from "lucide-react";
import Loading from '../../components/Loading'
import { Icons } from '../../components/Icons';
const Feedback = () => {
     const {data,isLoading:isFeedbackLoading,error} = useGetFeedbacks()

  return (
    <div className="space-y-10 p-5">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Student Feedback</h1>
        <p className="text-gray-500 text-lg">Review what students are saying about your events.</p>
      </div>
 
       {isFeedbackLoading && <div className='flex p-4 flex-col justify-center items-center'> <Loading size='sm' color='black' /></div>}
       {((!isFeedbackLoading && data?.feedbacks.length === 0) || error) && (<div className="flex flex-col items-center justify-center py-10 px-4 text-center  rounded-xl ">
           <div className="bg-white p-3 rounded-full shadow-sm mb-3">
             <MessageSquareOff className="text-gray-400" size={28} />
           </div>
           <h3 className="text-sm md:text-xl font-semibold text-gray-900">No recent feedback</h3>
           <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-50">
             When students leave reviews for your events, they will appear here.
           </p>
         </div>)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {data?.feedbacks.length > 0 && data.feedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl">
                  <img className='rounded-full' src={feedback.studentId?.profile || `https://ui-avatars.com/api/?name=deleteduser&background=2563EB&color=fff`} alt={`${feedback.studentId?.fullName || "Deleted User"} profile picture`} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900">{feedback.studentId?.fullName || "Deleted User"}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{feedback.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                              <Star 
                                key={j} 
                                fill={j < feedback.rating ? '#facc15' : 'none'} 
                                color={j < feedback.rating ? '#facc15' : '#e5e7eb'} 
                                size={15} 
                              />
                            ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-50">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{feedback.eventId.title}</p>
              <p className="text-gray-700 leading-relaxed font-medium italic">"{feedback.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


}
export default Feedback