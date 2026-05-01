import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useGetCalendarData } from '../../hooks/useStudent';

const Calendar = () => {
  const [viewDate, setViewDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [showAllEvents, setShowAllEvents] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { data: calendarEvents, isLoading } = useGetCalendarData(viewDate.month, viewDate.year);

  const displayEvents = useMemo(() => {
    if (!calendarEvents) return [];
    if (showAllEvents) return calendarEvents;
    return calendarEvents.filter(event => event.extendedProps.status === 'registered');
  }, [calendarEvents, showAllEvents]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderEventContent = (eventInfo) => {
    const { status, category } = eventInfo.event.extendedProps;
    const isRegistered = status === 'registered';
    const isRecommended = status === 'recommended';

    if (eventInfo.view.type === 'listWeek') {
      return (
        <div className="flex items-center gap-3 py-1">
          <div className={`w-3 h-3 rounded-full ${
            isRegistered ? 'bg-blue-600' : isRecommended ? 'bg-purple-600' : 'border-2 border-blue-400'
          }`} />
          <span className="font-bold text-gray-800">{eventInfo.event.title}</span>
          {isRecommended && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-black">AI</span>}
        </div>
      );
    }

    let containerClass = "bg-white border-2 border-dashed border-blue-400 text-blue-700"; 
    let dotClass = "bg-blue-400";
    let label = category;

    if (isRegistered) {
      containerClass = "bg-blue-600 text-white border-none shadow-md";
      dotClass = "bg-blue-200 animate-pulse";
    } else if (isRecommended) {
      containerClass = "bg-purple-600 text-white border-none shadow-lg shadow-purple-100";
      dotClass = "bg-purple-200 animate-bounce";
      label = "✨ AI Recommendation";
    }

    return (
      <div className={`flex flex-col p-1.5 w-full overflow-hidden transition-all duration-300 rounded-xl ${containerClass}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
          <span className="text-[9px] font-black uppercase opacity-80 tracking-widest truncate">
             {label}
          </span>
        </div>
        <span className="text-xs font-bold truncate leading-tight">
          {eventInfo.event.title}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen font-sans text-gray-900">
      <style>{`
        .fc { --fc-border-color: #f3f4f6; font-family: inherit; }
        .fc .fc-toolbar-title { font-weight: 900; color: #111827; }
        .fc .fc-button-primary { 
          background-color: white !important; 
          border: 1px solid #e5e7eb !important; 
          color: #374151 !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
        }
        .fc .fc-button-active { background-color: #2563eb !important; color: white !important; border-color: #2563eb !important; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid #f3f4f6 !important; }
        .fc-day-today { background: #f0f7ff !important; }
        .fc-h-event { background: transparent; border: none; }
      `}</style>

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-50">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-blue-500">
              Your Calendar
            </h1>
            <p className="text-gray-400 text-sm font-medium">Your personalized academic schedule.</p>
          </div>

          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
            <button 
              onClick={() => setShowAllEvents(false)}
              className={`flex-1 md:flex-none cursor-pointer px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${!showAllEvents ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Schedule
            </button>
            <button 
              onClick={() => setShowAllEvents(true)}
              className={`flex-1 cursor-pointer md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${showAllEvents ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Discover
            </button>
          </div>
        </div>

        {/* Legend / Key Section */}
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-50 flex flex-wrap gap-6 items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">Legend:</span>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
            <span className="text-xs font-bold text-gray-600">Registered</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600 shadow-sm animate-pulse" />
            <span className="text-xs font-bold text-gray-600">AI Recommended</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-blue-400 bg-white" />
            <span className="text-xs font-bold text-gray-600">Suggested</span>
          </div>
        </div>

        {/* Calendar Implementation */}
        <div className={`p-4 md:p-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: isMobile ? 'listWeek,dayGridDay' : 'dayGridMonth,timeGridWeek'
            }}
            events={displayEvents}
            eventContent={renderEventContent}
            height={isMobile ? "auto" : "75vh"}
            dayMaxEvents={3}
            datesSet={(dateInfo) => {
              const currentStart = dateInfo.view.currentStart;
              setViewDate({
                month: currentStart.getMonth() + 1,
                year: currentStart.getFullYear()
              });
            }}
            eventClick={(info) => console.log("Event Details:", info.event.extendedProps)}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;