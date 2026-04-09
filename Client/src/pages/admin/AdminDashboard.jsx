import React, { useState, useContext } from "react";
import { CategoryBarChart, TrendChart } from "../../components/Charts";
import { Icons } from "../../components/Icons";
import { useGetAdminDashboard } from "../../hooks/useAdmin";
import { useGetAdminAllEvents } from "../../hooks/useEvent";
import Loading from "../../components/Loading.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {Link} from 'react-router-dom'
import {AppContext} from '../../context/ContextProvider.jsx'

const AdminDashboard = () => {
  const {setActiveModal} = useContext(AppContext);
  const {data:dashboardData,isLoading:isDashboardDataLoading} = useGetAdminDashboard();
  const { data, isLoading, error } = useGetAdminAllEvents();
 
    
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Logic
  const allEvents = data?.events || [];
  const totalPages = Math.ceil(allEvents.length / itemsPerPage);

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = allEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-12 p-5">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            System Overview
          </h2>
          <p className="text-gray-500 text-[16px]">
            Central control for all campus community features.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={()=>setActiveModal({name: 'create-announcement', data: null})} className="px-6 py-4 cursor-pointer bg-blue-600 text-white rounded-2xl font-bold shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95">
            <Icons.Plus /> Create Announcement
          </button>
          <Link to={'/admin/users'}>
            <button className="px-6 cursor-pointer py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <Icons.Users /> Manage Users
          </button>
          </Link>
           <Link to={'/admin/analytics'}>
             <button className="px-6 cursor-pointer py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold shadow-sm hover:bg-indigo-100 transition-all flex items-center gap-2">
            <Icons.Analytics /> View Analytics
          </button>
           </Link>
        </div>
      </div>

      
      {
        isDashboardDataLoading  ?  <Loading size="sm" color="black" />
         : 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {dashboardData && dashboardData.dashboardInfo.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-4">
              {stat.label.toLowerCase().includes('users') ? <Icons.Users /> : stat.label.toLowerCase().includes('active') ? <Icons.Explore /> : <Icons.Plus /> }
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {stat.label}
            </p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
               {(stat.label.toLowerCase().includes('pending') && stat.value !== 0) && (<span className={`text-xs font-bold px-2 py-0.5 rounded-full text-gray-500 bg-gray-50`}>Urgent</span>)}
            </div>
          </div>
        ))}
        <div
           
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block mb-4">
              <Icons.Dashboard />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              System Health
            </p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-black text-gray-900">100%</p>
               
            </div>
          </div>
      </div> 
      }

     
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex gap-4 items-center justify-between">
          <h3 className=" text-[17px] md:text-xl font-black text-gray-900 uppercase tracking-widest">
            All Events Moderation
          </h3>
          <div className="flex gap-2">
            <Link to={'/admin/approvals'}>
                <button className="text-xs cursor-pointer md:text-sm text-nowrap font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
              Review Pending
            </button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="w-full bg-white">
            <div className="hidden md:flex bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4 border-b border-gray-100">
              <div className="flex-1">Event</div>
              <div className="flex-1">Organizer</div>
              <div className="w-32 text-center">Status</div>
              
            </div>

            <div className="divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-20 flex justify-center">
                  <Loading size="md" color="black" />
                </div>
              ) : currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex flex-col md:flex-row md:items-center px-6 md:px-10 py-6 hover:bg-gray-50/50 transition-colors gap-4 md:gap-0"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={event.imageUrl}
                          className="w-15 h-12 rounded-lg object-cover shadow-sm"
                          alt={event.title}
                        />
                        
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block text-sm leading-tight">
                          {event.title}
                        </span>
                        
                      </div>
                    </div>

                    <div className="flex-1 text-sm font-medium text-gray-500">
                      {event.organizedBy?.organizationName ||
                        "Organizer Deleted"}
                    </div>

                    <div className="w-full md:w-32 flex justify-start md:justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          event.status.toLowerCase() === "approved"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : event.status.toLowerCase() === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                            : event.status.toLowerCase() === "rejected"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-gray-50 text-gray-700 border-gray-100"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <p className="text-gray-400 font-black uppercase tracking-widest">
                    No Events found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Footer */}
        {allEvents.length > itemsPerPage && (
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {indexOfFirstEvent + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-gray-900">
                {Math.min(indexOfLastEvent, allEvents.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {allEvents.length}
              </span>{" "}
              events
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-2 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => paginate(idx + 1)}
                  className={`w-8 h-8 cursor-pointer rounded-xl text-xs font-bold transition-all ${
                    currentPage === idx + 1
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-900"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-2 rounded-xl cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 min-w-0">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
            Growth Trends
          </h3>
          <TrendChart data={dashboardData?.attendanceTrend || []} />
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 min-w-0">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
            Category Distribution
          </h3>
          <CategoryBarChart data={dashboardData?.categoryDistribution || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
