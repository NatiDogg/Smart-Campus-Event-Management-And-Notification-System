import React from 'react'

const Terms = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Community Standards</h2>
          <p className="text-xl text-gray-500 leading-relaxed">By using SmartCampus, you agree to uphold the values of our academic community and ensure a safe environment for everyone.</p>
        </div>
        <div className="prose prose-lg text-gray-600 max-w-4xl mx-auto space-y-12 bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">1. Acceptable Use</h4>
            <p className="leading-relaxed">SmartCampus is for university-sanctioned events and community building. Harassment, spam, or unauthorized commercial activity is strictly prohibited and will result in immediate account suspension.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">2. Organizer Responsibility</h4>
            <p className="leading-relaxed">Organizers must provide accurate event information and adhere to campus safety protocols for all physical gatherings. You are responsible for the safety and conduct of your event.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">3. Account Security</h4>
            <p className="leading-relaxed">You are responsible for maintaining the confidentiality of your university credentials used to access the platform. Any activity under your account is your responsibility.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">4. Content Ownership</h4>
            <p className="leading-relaxed">You retain rights to any content you post, but grant SmartCampus a license to display it within the university ecosystem for the purpose of event discovery and promotion.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">5. Termination</h4>
            <p className="leading-relaxed">We reserve the right to suspend accounts that violate university code of conduct or these terms. The university administration has final say in all moderation matters.</p>
          </div>
        </div>
        <div className="p-10 bg-yellow-50 border border-yellow-100 rounded-[3rem] text-center max-w-4xl mx-auto">
          <p className="text-sm text-yellow-800 font-bold uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })} These terms are subject to periodic review by the University Governance Committee.</p>
        </div>
      </div>
    </div>
  )
}

export default Terms