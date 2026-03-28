import React from 'react'

const Organizer = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Empowering Campus Leaders</h2>
          <p className="text-xl text-gray-500 leading-relaxed">Whether you're a student club president or a department head, SmartCampus gives you the professional tools needed to run world-class events.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-6 p-10 bg-white border border-gray-100 rounded-[3rem] hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black">1</div>
            <div>
              <h4 className="font-black text-gray-900 text-2xl mb-4 uppercase tracking-tight">Streamlined Approvals</h4>
              <p className="text-gray-500 leading-relaxed">Submit your event once and track its approval status through the administration pipeline in real-time. No more chasing emails or physical signatures.</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 p-10 bg-white border border-gray-100 rounded-[3rem] hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black">2</div>
            <div>
              <h4 className="font-black text-gray-900 text-2xl mb-4 uppercase tracking-tight">Audience Insights</h4>
              <p className="text-gray-500 leading-relaxed">Understand who is attending your events. Get anonymized demographic data to help you tailor your content and marketing strategies for maximum impact.</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 p-10 bg-white border border-gray-100 rounded-[3rem] hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black">3</div>
            <div>
              <h4 className="font-black text-gray-900 text-2xl mb-4 uppercase tracking-tight">Automated Feedback</h4>
              <p className="text-gray-500 leading-relaxed">SmartCampus automatically prompts attendees for feedback after the event, providing you with actionable data to improve your next session without manual work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Organizer