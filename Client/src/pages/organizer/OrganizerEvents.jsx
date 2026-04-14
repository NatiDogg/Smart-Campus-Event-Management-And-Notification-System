import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Search,
  Tag
} from 'lucide-react';
import { useGetOrganizerAllEvents } from '../../hooks/useEvent';
import Loading from '../../components/Loading'
const OrganizerEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {data,isLoading,error} = useGetOrganizerAllEvents();

  

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-emerald-500 bg-emerald-50';
      case 'pending': return 'text-amber-500 bg-amber-50';
      case 'rejected': return 'text-rose-500 bg-rose-50';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  const filteredEvents = data?.events?.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 bg-white">
      
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1"> 
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 ">All Events</h1>
          <p className="text-gray-400 ">Your complete history and upcoming schedule.</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            className="w-full pl-11 pr-6 py-4 bg-gray-50 border-none rounded-3xl text-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {isLoading && <div> <Loading size='md' color='black' /></div>}
        {filteredEvents?.map((event) => (
          <div key={event._id} className="group flex flex-col h-full rounded-4xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 overflow-hidden">
            
            {/* Image Section */}
            <div className="relative aspect-16/10 overflow-hidden">
              <img 
                src={event.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={event.title} 
              />
              <div className="absolute top-6 right-6">
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-md border border-white/10 ${getStatusColor(event.status)}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                  <span className="text-[8px] font-black uppercase tracking-widest">{event.status}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase  text-gray-500">
                <Tag className="w-3 h-3" />
                {event.category.name}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors ">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
                  {event.description}
                </p>
              </div>

              {/* Footer info - pushed to bottom */}
              <div className="pt-6 mt-auto border-t border-gray-50 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-4 h-4 text-gray-900" />
                  <span className="text-xs font-bold text-gray-700">{format(event.startDate, 'MMMM do, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-900" />
                  <span className="text-xs font-bold text-gray-700">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents?.length === 0 && (
        <div className="py-32 text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-gray-50">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No matches found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default OrganizerEvents;