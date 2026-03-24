import React from 'react'
import { Icons } from '../Icons'
const Support = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tight">We're Here to Help</h2>
          <p className="text-xl text-gray-500 leading-relaxed">Need assistance? Our support team and comprehensive documentation are available 24/7 to ensure your experience is seamless.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button className="p-12 bg-white border border-gray-100 rounded-[3rem] text-left hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Icons.Plus />
            </div>
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Knowledge Base</h4>
            <p className="text-gray-500 mt-4 leading-relaxed">Browse hundreds of articles and video tutorials covering everything from event creation to AI settings.</p>
          </button>
          <button className="p-12 bg-white border border-gray-100 rounded-[3rem] text-left hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Icons.Notifications />
            </div>
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Live Support</h4>
            <p className="text-gray-500 mt-4 leading-relaxed">Chat with our campus ambassadors during business hours for immediate assistance with your account or events.</p>
          </button>
        </div>
        <div className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100">
          <h4 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Frequently Asked Questions</h4>
          <div className="space-y-6">
            <details className="group bg-white p-6 rounded-2xl border border-gray-100">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-gray-700 hover:text-blue-600 py-2">
                How do I become an organizer?
                <span className="group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-gray-500 py-4 leading-relaxed">Contact your department head or the Student Union to request organizer privileges. Once approved, your role will be updated automatically.</p>
            </details>
            <details className="group bg-white p-6 rounded-2xl border border-gray-100">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-gray-700 hover:text-blue-600 py-2">
                Is my data shared with professors?
                <span className="group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-gray-500 py-4 leading-relaxed">No. Your event attendance and interests are private. Professors only see attendance data if the event is explicitly part of a course requirement.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support