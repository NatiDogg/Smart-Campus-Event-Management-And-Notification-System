import React from 'react'
import {Icons} from '../Icons.jsx'
const Features = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="space-y-8">
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Core Innovations</h2>
          <p className="text-xl text-gray-500 leading-relaxed">SmartCampus is built on three pillars of technological excellence designed to transform your university experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 space-y-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200">
              <Icons.Analytics />
            </div>
            <h4 className="text-2xl font-black text-blue-900">AI Recommendation</h4>
            <p className="text-blue-700 leading-relaxed">Our Event recommendation engine analyzes your registered events, subscribed categories, and interests to surface events that actually matter to you. No more scrolling through endless irrelevant lists.</p>
          </div>
          <div className="p-10 bg-purple-50 rounded-[3rem] border border-purple-100 space-y-6">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-200">
              <Icons.Calendar />
            </div>
            <h4 className="text-2xl font-black text-purple-900">Smart Calendar</h4>
            <p className="text-purple-700 leading-relaxed">Seamlessly sync campus events with your personal schedule. Our system detects conflicts with your class timetable and suggests the best times to attend workshops and socials.</p>
          </div>
          <div className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 space-y-6">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200">
              <Icons.Dashboard />
            </div>
            <h4 className="text-2xl font-black text-emerald-900">Digital Check-in</h4>
            <p className="text-emerald-700 leading-relaxed">Forget paper sign-in sheets. Use your unique digital ID to check into events instantly. Build an "Attendance Passport" that showcases your campus involvement to future employers.</p>
          </div>
          <div className="p-10 bg-orange-50 rounded-[3rem] border border-orange-100 space-y-6">
            <div className="w-16 h-16 bg-orange-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-200">
              <Icons.Notifications />
            </div>
            <h4 className="text-2xl font-black text-orange-900">Real-time Pulse</h4>
            <p className="text-orange-700 leading-relaxed">Get instant updates on room changes, waitlist openings, and trending events. Stay connected with the heartbeat of the campus in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features;