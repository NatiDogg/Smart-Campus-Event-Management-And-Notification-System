import React, { useEffect,useState } from 'react'
import { useGetStudentEvents } from '../../hooks/useStudent'
import RegisteredEvents from '../../components/RegisteredEvents'
import InterestedEvents from '../../components/InterestedEvents'
import EventHistory from '../../components/EventHistory'


const MyEvents = () => {

   const {data, isLoading} = useGetStudentEvents()

   const [activeTab, setActiveTab] = useState('registered')
   
    const renderContent = ()=>{
       switch(activeTab){
          case ('registered'):
            return <RegisteredEvents events={data?.registeredEvents || []} isLoading= {isLoading} activeTab={activeTab} />
          case ('interested'):
            return <InterestedEvents events={data?.interestedEvents || []} isLoading= {isLoading} activeTab={activeTab} />
          case ('history'): 
            return <EventHistory events={data?.previouslyAttendedEvents || []} isLoading= {isLoading} activeTab={activeTab} />
          default:
            return <RegisteredEvents events={data?.registeredEvents || []} isLoading= {isLoading} activeTab={activeTab} />
       }
       
    }

   

   
  return (
    <div className="space-y-12 p-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">My Events</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your campus journey and history.</p>
        </div>

        <div className="flex flex-col w-full md:w-auto md:flex-row bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm self-start md:self-center">
          <button 
            onClick={() => setActiveTab('registered')}
            className={`px-6 cursor-pointer py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'registered' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Registered
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'registered' ? 'bg-white/20' : 'bg-gray-100'}`}>
              { data?.registeredEvents?.length || 0}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('interested')}
            className={`px-6 cursor-pointer py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'interested' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Interested
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'interested' ? 'bg-gray-100' : 'bg-gray-100'}`}>
              { data?.interestedEvents?.length || 0}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 cursor-pointer py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            History
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'history' ? 'bg-gray-100' : 'bg-gray-100'}`}>
              { data?.previouslyAttendedEvents?.length || 0}
            </span>
          </button>
        </div>
      </div>

       <div>
          {renderContent()}
       </div>

      
    </div>
  );
}

export default MyEvents