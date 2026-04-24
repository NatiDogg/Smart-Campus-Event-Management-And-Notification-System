import React from 'react'
import {format} from 'date-fns'
import { Link } from 'react-router-dom'
const EventCard = ({event}) => {
  return (
    <Link to={`/student/details/${event._id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            {event.category.name}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          <div className="space-y-1.5 mb-4 flex-1">
            <div className="flex items-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 mr-1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              {format(new Date(event.startDate), "PPP")} •{" "}
              {format(new Date(event.startDate), "p")} -{" "}
              {format(new Date(event.endDate), "p")}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 mr-1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {event.location}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <button className="text-xs cursor-pointer font-semibold text-blue-600 hover:text-blue-700">
              Register →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard