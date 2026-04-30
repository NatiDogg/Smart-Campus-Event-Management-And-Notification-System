import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const Calendar = () => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle Responsive View Switching
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dummy Data - Replace with your hooks (e.g., useGetRecommendations, useGetStudentEvents)
  const events = [
    {
      id: '1',
      title: 'React Architecture Workshop',
      start: '2026-05-10T10:00:00',
      end: '2026-05-10T12:00:00',
      extendedProps: { status: 'registered', category: 'Tech' }
    },
    {
      id: '2',
      title: 'Networking & Pizza',
      start: '2026-05-12T18:00:00',
      end: '2026-05-12T20:00:00',
      extendedProps: { status: 'suggested', category: 'Social' }
    }
  ];

  // Custom Event Renderer
  const renderEventContent = (eventInfo) => {
    const isRegistered = eventInfo.event.extendedProps.status === 'registered';
    
    // In List view, we use a simpler style; in Grid view, we use the "Fancy Card"
    if (eventInfo.view.type === 'listWeek') {
      return (
        <div className="flex items-center gap-3 py-1">
          <div className={`w-3 h-3 rounded-full ${isRegistered ? 'bg-blue-600' : 'border-2 border-blue-400'}`} />
          <span className="font-bold text-gray-800">{eventInfo.event.title}</span>
        </div>
      );
    }

    return (
      <div className={`
        flex flex-col p-1.5 w-full overflow-hidden transition-all duration-300
        ${isRegistered 
          ? 'bg-blue-600 text-white rounded-xl shadow-md border-none' 
          : 'bg-white border-2 border-dashed border-blue-400 text-blue-700 rounded-xl'}
      `}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isRegistered ? 'bg-blue-200 animate-pulse' : 'bg-blue-400'}`} />
          <span className="text-[9px] font-black uppercase opacity-80 tracking-widest truncate">
             {eventInfo.event.extendedProps.category}
          </span>
        </div>
        <span className="text-xs font-bold truncate leading-tight">
          {eventInfo.event.title}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen font-sans">
      <style>{`
        /* FullCalendar Custom Overrides */
        .fc { --fc-border-color: #f3f4f6; font-family: inherit; }
        .fc .fc-toolbar-title { font-weight: 900; color: #111827; }
        .fc .fc-button-primary { 
          background-color: white !important; 
          border: 1px solid #e5e7eb !important; 
          color: #374151 !important;
          font-weight: 700 !important;
          text-transform: capitalize !important;
          padding: 8px 16px !important;
          border-radius: 12px !important;
        }
        .fc .fc-button-primary:hover { background-color: #f9fafb !important; }
        .fc .fc-button-active { background-color: #2563eb !important; color: white !important; border-color: #2563eb !important; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid #f3f4f6 !important; }
        .fc-day-today { background: #f0f7ff !important; }
        .fc-h-event { background: transparent; border: none; }
        
        @media (max-width: 767px) {
          .fc .fc-toolbar { flex-direction: column; gap: 1rem; }
          .fc-toolbar-chunk { display: flex; justify-content: center; width: 100%; }
          .fc-list-event-time { display: none; }
          .fc-list-day-cushion { background: #f9fafb !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
        
        {/* Top Navigation / Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-50">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Campus.Calendar</h1>
            <p className="text-gray-400 text-sm font-medium">Your academic journey, organized.</p>
          </div>

          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
            <button 
              onClick={() => setShowAllEvents(false)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${!showAllEvents ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Schedule
            </button>
            <button 
              onClick={() => setShowAllEvents(true)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${showAllEvents ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Discover
            </button>
          </div>
        </div>

        {/* Calendar Implementation */}
        <div className="p-4 md:p-8">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: isMobile ? 'listWeek,dayGridDay' : 'dayGridMonth,timeGridWeek'
            }}
            events={events}
            eventContent={renderEventContent}
            height={isMobile ? "auto" : "75vh"}
            dayMaxEvents={3}
            eventClick={(info) => {
              alert('Event: ' + info.event.title + '\nStatus: ' + info.event.extendedProps.status);
              // You can open your registration modal here
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;