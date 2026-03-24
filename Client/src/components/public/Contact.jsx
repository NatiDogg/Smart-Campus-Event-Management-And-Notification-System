import React from 'react'
const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Get in Touch</h2>
          <p className="text-xl text-gray-500 leading-relaxed">Have a question, a bug report, or a feature request? We'd love to hear from you and help you get the most out of SmartCampus.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-12 bg-gray-50 rounded-[3rem] text-center space-y-4 border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📧</div>
            <p className="font-black text-gray-900 text-xl uppercase tracking-tight">Email</p>
            <p className="text-gray-500 font-medium">support@smartcampus.edu</p>
          </div>
          <div className="p-12 bg-gray-50 rounded-[3rem] text-center space-y-4 border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📍</div>
            <p className="font-black text-gray-900 text-xl uppercase tracking-tight">Location</p>
            <p className="text-gray-500 font-medium"> AAIT Innovation Hub, NB 4, Level 2</p>
          </div>
          <div className="p-12 bg-gray-50 rounded-[3rem] text-center space-y-4 border border-gray-100 shadow-sm">
            <div className="grid place-content-center"><svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l1.589 4.829c.191.528.098.737.655.737.43 0 .621-.197.861-.43l2.07-2.012 4.305 3.179c.794.437 1.365.212 1.563-.73l2.827-13.326c.289-1.159-.442-1.686-1.46-.966z" fill="#24A1DE"/>
</svg></div>
            <p className="font-black text-gray-900 text-xl uppercase tracking-tight">Social</p>
            <p className="text-gray-500 font-medium">@SmartCampus_Uni</p>
          </div>
        </div>
        <form className="space-y-8 bg-white p-16 border border-gray-100 rounded-[4rem] shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
              <input type="text" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 font-bold" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">University Email</label>
              <input type="email" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 font-bold" placeholder="your@email.edu" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Your Message</label>
            <textarea rows={6} className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 font-bold" placeholder="How can we help you today?"></textarea>
          </div>
          <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 hover:-translate-y-1 cursor-pointer transition-all shadow-2xl shadow-blue-200 uppercase tracking-widest text-lg">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact