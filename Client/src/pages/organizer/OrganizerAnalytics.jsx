import React, { useEffect } from 'react'
import {Icons} from '../../components/Icons'
import {CategoryBarChart,TrendChart} from '../../components/Charts'
import { useGetOrganizerAnalytics } from '../../hooks/useOrganizer'

const OrganizerAnalytics = () => {
   
     const {data,isLoading} = useGetOrganizerAnalytics()

     useEffect(()=>{
          if(data){
            console.log(data)
          }
     },[data])
  return (
     <div className="space-y-10 p-5">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Event Performance</h1>
        <p className="text-gray-500 text-sm">In-depth data on your hosted events and community engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Engagement', val: '8,421', change: '+18%', icon: <Icons.Analytics /> },
          { label: 'Average Feedback', val: '4.8/5', change: '+0.2', icon: <Icons.Dashboard /> },
          { label: 'Share Rate', val: '32%', change: '+5%', icon: <Icons.Explore /> },
          { label: 'Followers', val: '412', change: '+24', icon: <Icons.Users /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl inline-block mb-4">{stat.icon}</div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-gray-900">{stat.val}</p>
              <span className="text-xs font-bold text-green-600 mb-1">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Attendance Over Time</h3>
          <TrendChart data={data?.attendanceTrends || []
} />
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">User Demographics</h3>
          <CategoryBarChart data={data?.categoryDemographics || []} />
        </div>
      </div>
    </div>
  )
}

export default OrganizerAnalytics