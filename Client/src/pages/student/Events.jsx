import React from 'react'
import { useGetAllEvents } from '../../hooks/useEvent';
import { Icons } from '../../components/Icons';
import { useGetCategories } from '../../hooks/useCategory';
import {useGetAllOrganizers} from '../../hooks/useUser'
import EventCard from '../../components/EventCard';
const Events = () => {
   const {data:events,isLoading} = useGetAllEvents()
   const {data:categories, isLoading:isCategoriesLoading} = useGetCategories()
   const {data:organizers,isLoading:isOrganizerLoading,error: isOrganizerError} = useGetAllOrganizers()


  return (
       <div className="space-y-12 p-5">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Explore Events</h1>
            <p className="text-gray-500 text-sm font-medium">explore your campus events here.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search by title or description..."
              
              
              className="w-full pl-12 text-sm pr-4 text-gray-600 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-4xl border border-gray-100 shadow-sm">
          <div className="space-y-2 flex flex-col gap-0.5 flex-1 min-w-50">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories?.map(cat => (
                <button
                  key={cat._id}
                  
                  className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-bold transition-all border bg-gray-50 text-gray-400 hover:text-gray-600 border-gray-100 hover:border-gray-200`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-12 w-px bg-gray-100 hidden lg:block"></div>

          <div className="space-y-2 w-full lg:w-48">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Organizer</label>
            <select 
              
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 focus:border-blue-500 focus:ring-0 transition-all"
            >
               <option value="" disabled>
                  Select an Organizer
                </option>
                {isOrganizerLoading && (
                  <option value='' disabled>
                    Loading organizers...
                  </option>
                )}

                {organizers &&
                  organizers.result.map((org) => {
                    return (
                      <option key={org._id} value={org._id}>
                        {org.organizationName}
                      </option>
                    );
                  })}
                {organizers && organizers.length === 0 && (
                  <option className='p-12 text-center text-gray-500 italic' disabled value="">
                    No categories created yet
                  </option>
                )}
                {
                  isOrganizerError && <option disabled value=""> Error loading organizers</option>
                }
            </select>
          </div>

          <div className="h-12 w-px bg-gray-100 hidden lg:block"></div>

          <div className="space-y-2 w-full lg:w-48">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 focus:border-blue-500 focus:ring-0 transition-all"
            >
              <option value="All">Any Date</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="Oct">October</option>
              <option value="Nov">November</option>
              <option value="Dec">December</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {events?.result.map(event => (
          <EventCard 
            key={event._id} 
            event={event} 
            
          />
        ))}
      </div>

      {events?.result.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
           </div>
          <p className="text-gray-400 font-black uppercase tracking-widest">No matching events found</p>
          <button 
            
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Events