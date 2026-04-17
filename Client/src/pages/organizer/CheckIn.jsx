import React,{useEffect, useState} from 'react'
import { useGetOrganizerDashboard, useGetRegisteredStudents } from '../../hooks/useOrganizer';
import Loading from '../../components/Loading'
import { Search } from "lucide-react";
import {useSearchParams} from 'react-router-dom'
const CheckIn = () => {
  const [eventId, setEventId] = useState("");
   const {data:organizerData, isLoading:isOrganizerDataLoading} = useGetOrganizerDashboard()
   const {data:registrationList,isLoading:isRegistrationListLoading, error} = useGetRegisteredStudents(eventId, {enabled: !!eventId})
   
   const [checkedInStudent, setCheckedInStudent] = useState(0);

   const [searchParams] = useSearchParams()
   const id = searchParams.get('id')


   useEffect(()=>{
        if(id){
          setEventId(id)
        }
   },[])

   useEffect(()=>{
       
       if(registrationList){
        console.log(registrationList)
        const attendedStudents = registrationList?.registeredStudent.filter((reg)=> reg.isPresent == true).length
        setCheckedInStudent(attendedStudents || 0)

       }
   },[eventId,registrationList])

   

  
  

  return (
    <div className="space-y-8 p-5 ">
      <div className="flex flex-col md:flex-row md:items-center p-4 justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Attendance Check-In</h1>
          <p className="text-gray-500 text-sm">Mark students as present for your live events.</p>
        </div>
        <select 
          onChange={(e)=>setEventId(e.target.value)}
          value={eventId}
          className="px-6 py-4 w-full md:w-[30%] grid place-content-center rounded-2xl bg-white border border-gray-200 shadow-sm font-bold text-gray-700 text-sm focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
                  Select an Event
                </option>
                {isOrganizerDataLoading && (
                  <option value='' disabled>
                    Loading Events...
                  </option>
                )}
          {organizerData?.activeEvents.map(e => <option   key={e._id} value={e._id}>{e.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registration List</span>
              {registrationList?.registeredStudent.length > 0 ? (<span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{checkedInStudent} / {registrationList?.registeredStudent.length} Checked In</span>) : (<span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Empty List</span>)}
            </div>
            <div className="divide-y divide-gray-50">

              {!eventId && (
    <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
      Please select an event to see attendees
    </div>
  )}
              {
           

               isRegistrationListLoading ? ( <div className="p-20 flex justify-center">
                                                         <Loading size="md" color="black" />
                                                         </div>) :
                registrationList?.registeredStudent.length > 0 ?
                                      
                 registrationList?.registeredStudent.map(reg => (
                  <div key={reg._id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 hidden md:flex h-12 rounded-full bg-gray-100  items-center justify-center font-bold text-gray-400">
                      <img className='hidden rounded-full md:block' src={reg.student.profile} alt="student profile" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{reg.student.fullName}</p>
                      <p className="text-xs text-gray-500">{reg.student.email}</p>
                    </div>
                  </div>
                  <button 
                   
                    className={`px-6 cursor-pointer py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white border-2 border-gray-100 text-gray-400 hover:border-blue-200`}
                  >
                    CheckIn
                  </button>
                </div>
              )) : ((!isRegistrationListLoading && registrationList?.registeredStudent.length === 0) || error) && (<div className="flex flex-col items-center justify-center py-10 px-4 text-center  rounded-xl ">
           <div className="bg-white p-3 rounded-full shadow-sm mb-3">
             <Search className="text-gray-400" size={28} />
           </div>
           <h3 className="text-sm md:text-xl font-semibold text-gray-900">No Students Registered</h3>
           <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-50">
             Once students sign up for this event, their names and check-in status will show up here..
           </p>
         </div>)  }
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default CheckIn