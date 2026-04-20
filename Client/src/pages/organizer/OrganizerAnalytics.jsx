import React, { useEffect } from 'react'
import {Icons} from '../../components/Icons'
import {CategoryBarChart,TrendChart} from '../../components/Charts'
import { useGetOrganizerAnalytics } from '../../hooks/useOrganizer'

const OrganizerAnalytics = () => {
   
     const {data,isLoading} = useGetOrganizerAnalytics()

     
  return (
     <div className="space-y-10 p-5">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Event Performance</h1>
        <p className="text-gray-500 text-sm">In-depth data on your hosted events and community engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-3">
              <Icons.Analytics />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Engagement</p>
            <div className="flex items-end gap-2 mt-1">
             <p className="text-3xl font-black text-gray-900">{data?.totalEngagement || 0}</p>
            </div>
           </div>
           <div  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-3">
              <Icons.Search />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Events</p>
            <div className="flex items-end gap-2 mt-1">
             <p className="text-3xl font-black text-gray-900">{data?.approvalStat?.total || 0}</p>
            </div>
           </div>
           <div  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-3">
              <Icons.Calendar />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Approved Events</p>
            <div className="flex items-end gap-2 mt-1">
             <p className="text-3xl font-black text-gray-900">{data?.approvalStat?.approved || 0}</p>
            </div>
           </div>
           <div  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="p-3 bg-indigo-50 text-red-600 rounded-2xl inline-block mb-3">
              <Icons.Calendar />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rejected Events</p>
            <div className="flex items-end gap-2 mt-1">
             <p className="text-3xl font-black text-gray-900">{data?.approvalStat?.rejected || 0}</p>
            </div>
           </div>
           <div  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-3">
              <Icons.Analytics />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Approval Rate</p>
            <div className="flex items-end gap-2 mt-1">
             <p className="text-3xl font-black text-gray-900">{data?.approvalStat?.approvalRate || 0}</p>
            </div>
           </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Attendance Over Time</h3>
          <TrendChart data={data?.attendanceTrends || [] } />
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