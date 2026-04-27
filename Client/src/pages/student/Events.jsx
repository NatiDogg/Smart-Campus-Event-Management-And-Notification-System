import React, { useState, useMemo, useEffect } from 'react' // Added useMemo for performance
import { useGetAllEvents } from '../../hooks/useEvent';
import { Icons } from '../../components/Icons';
import { useGetCategories } from '../../hooks/useCategory';
import { useGetAllOrganizers } from '../../hooks/useUser'
import EventCard from '../../components/EventCard';
import Loading from '../../components/Loading'
import { ChevronLeft, ChevronRight } from "lucide-react";

const Events = () => {
  const { data: events, isLoading: isEventsLoading, error } = useGetAllEvents()
  const { data: categories, isLoading: isCategoriesLoading, error: isCategoriesError } = useGetCategories()
  const { data: organizers, isLoading: isOrganizerLoading, error: isOrganizerError } = useGetAllOrganizers()

  

  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOrganizer, setSelectedOrganizer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  
  const filteredEvents = useMemo(() => {
    const allEvents = events?.result || [];

    return allEvents.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'All' || event.category._id === selectedCategory;

     
      const matchesOrganizer = 
        selectedOrganizer === '' || event.organizedBy._id === selectedOrganizer;

      return matchesSearch && matchesCategory && matchesOrganizer;
    });
  }, [events, searchQuery, selectedCategory, selectedOrganizer]);

  // --- Pagination Logic (Based on Filtered Results) ---
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleFilterChange = (setter, value) => {
    setter(value);
    
    setCurrentPage(1); 
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 p-5">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Explore Events</h1>
            <p className="text-gray-500 text-sm font-medium">Explore your campus events here.</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Icons.Search />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              placeholder="Search by title or location..."
              className="w-full pl-12 text-sm pr-4 text-gray-600 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="space-y-2 flex flex-col gap-0.5 flex-1 min-w-50">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
            
            {isCategoriesLoading ? <Loading size="sm" color="black" /> : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange(setSelectedCategory, 'All')}
                  className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-bold transition-all border ${selectedCategory === 'All' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                >
                  All
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleFilterChange(setSelectedCategory, cat._id)}
                    className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat._id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400 hover:text-gray-600 border-gray-100 hover:border-gray-200'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-12 w-px bg-gray-100 hidden lg:block"></div>

          {/* Organizer Select */}
          <div className="space-y-2 w-full lg:w-48">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Organizer</label>
            <select 
              value={selectedOrganizer}
              onChange={(e) => handleFilterChange(setSelectedOrganizer, e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 focus:border-blue-500 transition-all"
            >
              <option value="">All Organizers</option>
              {organizers?.result.map((org) => (
                <option key={org._id} value={org._id}>{org.organizationName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {isEventsLoading ? (
        <div className="flex justify-center p-20"><Loading size="md" color="black" /></div>
      ) : currentEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[3rem]  ">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
           </div>
          <p className="text-gray-400 font-bold capitalize text-sm ">No matching events found</p>
          <button 
            onClick={() => {setSearchQuery(''); setSelectedCategory('All'); setSelectedOrganizer('');}}
            className="mt-4 text-blue-500 text-sm font-semibold hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
          
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {currentEvents.map((event) => <EventCard key={event._id} event={event} />)}
          </div>

          {/* Pagination Controls */}
          {filteredEvents.length > itemsPerPage && (
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm gap-4">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{indexOfFirstEvent + 1}</span> to <span className="font-bold text-gray-900">{Math.min(indexOfLastEvent, filteredEvents.length)}</span> of <span className="font-bold text-gray-900">{filteredEvents.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="p-3 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button key={idx} onClick={() => paginate(idx + 1)} className={`w-10 h-10 cursor-pointer rounded-xl text-xs font-bold transition-all ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>{idx + 1}</button>
                  ))}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="p-3 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Events;











