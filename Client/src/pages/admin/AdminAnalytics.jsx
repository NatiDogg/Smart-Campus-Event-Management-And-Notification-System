import React,{useEffect,useState} from 'react'
import { useGetAdminAnalytics, useGetExportedPdf } from '../../hooks/useAdmin'
import Loading from '../../components/Loading'
import {Icons} from '../../components/Icons'


const AdminAnalytics = () => {

     const {data,isLoading, error,refetch} = useGetAdminAnalytics()
     const [searchTerm, setSearchTerm] = useState("");

     const {mutate, isPending} = useGetExportedPdf()


     
     


      if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Generating AI Insights...</p>
      </div>
    );
    }

    if(!isLoading && error){
        return (
      <div className="  p-12   text-center space-y-6">
        <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900">AI Went Down!</h2>
          <p className="text-gray-500 max-w-md mx-auto">something wrong the AI please try again!</p>
        </div>
        <button onClick={()=>refetch()} className="px-8 cursor-pointer py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all">
          Refresh Data
        </button>
      </div>
    );
    }

    const getBarColor = (rate) => {
      const value = parseInt(rate);
      if (value >= 80) return "bg-green-500";
      if (value >= 50) return "bg-amber-500";
      return "bg-red-500";
    };

    const filteredMetrics = data?.analytics?.tableMetrics?.filter((event) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];


  const handleDownload = () => {
  
  mutate(data?.analytics);
};
  return (
    <div className="space-y-10 p-5 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Administrative Analytics
          </h1>
          <p className="text-gray-500 text-sm">
            AI-assisted insights and performance reporting.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            // Disable if there's no data, an error, or currently exporting
            disabled={ data?.analytics?.isError || isPending}
            className="px-6 py-3 cursor-pointer bg-gray-900 text-white rounded-xl font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            {isPending ? (
              <>
                
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Getting Report...</span>
              </>
            ) : (
              <>
                
                <Icons.Report className="w-5 h-5" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-linear-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest">
                AI Executive Summary
              </h3>
            </div>

            <p className="text-lg leading-relaxed text-indigo-100 font-medium">
              {data?.analytics?.summary || "no data please refresh"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">
                  Turnout Prediction
                </p>
                <p className="text-sm font-bold leading-relaxed">
                  {data?.analytics?.turnoutPrediction ||
                    "no data please refresh"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">
                  Engagement Trend
                </p>
                <p className="text-sm font-bold leading-relaxed">
                  {data?.analytics?.engagementTrend}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
            Popularity Ranking
          </h3>
          <div className="space-y-6">
            {data?.analytics?.topEvents.length > 0 ? (
              data?.analytics?.topEvents?.map((event, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    0{i + 1}
                  </div>
                  <p className="text-sm font-bold text-gray-700 leading-tight group-hover:text-gray-900">
                    {event}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic py-2">
                No top performers identified yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Aggregate Data Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h3 className="text-[17px] md:text-xl font-black text-gray-900 uppercase tracking-widest">
            Event Performance Metrics
          </h3>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Filter events..."
              className="w-full md:w-64 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="w-full bg-white">
            {/* Desktop Header Row */}
            <div className="hidden md:flex bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4 border-b border-gray-100">
              <div className="flex-2">Event Title</div>
              <div className="flex-1 text-center">Registrations</div>
              <div className="flex-1 text-center">Attendance</div>
              <div className="flex-1 text-center">Engagement</div>
              <div className="w-24 text-right">Impact</div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-gray-50">
              {filteredMetrics.length > 0 ? (
                filteredMetrics.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center px-6 md:px-10 py-6 hover:bg-gray-50/50 transition-colors gap-4 md:gap-0"
                  >
                    {/* Event Title */}
                    <div className="flex-2">
                      <span className="font-bold text-gray-900 block text-sm leading-tight">
                        {event?.title || "No title"}
                      </span>
                    </div>

                    {/* Registrations */}
                    <div className="flex-1 md:text-center">
                      <span className="text-xs md:hidden text-gray-400 uppercase font-black tracking-tighter mr-2">
                        Regs:
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        {event?.registrations || 0}
                      </span>
                    </div>

                    {/* Attendance Rate */}
                    <div className="flex-1 flex items-center md:justify-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden lg:block">
                        <div
                          className={`${getBarColor(
                            event?.attendanceRate || 0
                          )} h-1.5 rounded-full`}
                          style={{ width: event?.attendanceRate || "0%" }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {event?.attendanceRate || "0%"}
                      </span>
                    </div>

                    {/* Engagement Score */}
                    <div className="flex-1 md:text-center">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-100">
                        {event?.score || "NA"}
                      </span>
                    </div>

                    {/* Impact */}
                    <div className="w-full md:w-24 flex justify-between md:justify-end items-center">
                      <span className="text-xs md:hidden text-gray-400 uppercase font-black tracking-tighter">
                        Impact
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        {event.impact || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <p className="text-gray-400 font-black ">
                    {searchTerm
                      ? "No results matching search"
                      : "No Analytics Found"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics