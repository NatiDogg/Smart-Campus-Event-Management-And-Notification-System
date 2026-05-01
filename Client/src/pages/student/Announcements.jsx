import React,{useState,useEffect} from 'react'
import { useGetAnnouncements } from '../../hooks/useStudent'
import {Icons} from '../../components/Icons'
import {format} from 'date-fns'
import Loading from '../../components/Loading.jsx'
const Announcements = () => {
   
     const {data: announcements,isLoading,isError} = useGetAnnouncements()


    useEffect(()=>{
      if(announcements){
        console.log(announcements)
      }
    },[announcements])

    
     
  return (
    <div className="space-y-12 p-5">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Announcements</h1>
        <p className="text-gray-400 text-sm font-medium">Stay informed with the latest campus updates.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">

        {
          isLoading ?  (<div className='flex flex-col justify-center items-center m-5'><Loading size='md' color='black'  /></div>) : announcements?.length === 0 || isError ? (
          <div className="text-center py-32 bg-white rounded-[3rem] ">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Icons.Notifications />
            </div>
            <p className="text-gray-500 font-bold ">No active announcements yet</p>
          </div>
        ) : (
          announcements?.map(announcement => (
          <div 
            key={announcement._id} 
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-megaphone-icon lucide-megaphone"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/></svg>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[8px] font-black uppercase tracking-widest rounded-full">
                    Administrative
                  </span>
                  <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                    <Icons.Calendar /> {format(new Date(announcement.createdAt), 'PPP')}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  {announcement.title}
                </h2>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {announcement.content}
                </p>
                
                <div className="pt-4 flex items-center gap-2 text-gray-400 text-sm font-bold ">
                  <span>Posted by University Administration</span>
                </div>
              </div>
            </div>
          </div>
        ))
        )
        }
        
        

        
      </div>
    </div>
  );
}

export default Announcements