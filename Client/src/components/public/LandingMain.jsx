import React from 'react'
import LandingImage from '../../assets/landingImage.avif'
import { Link } from 'react-router-dom'
const LandingMain = () => {
  return (
    <section>
         <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2  bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold  tracking-wider mb-8 border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Now Live for 2026 Semester
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 max-w-4xl leading-tight mb-8">
          The Hub for Every <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            Campus Experience
          </span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-12">
          Discover, register, and attend university events with ease. Our
          AI-powered system ensures you never miss a workshop, seminar, or
          social that matches your path.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={'/signin'}>
           <button className="bg-gray-950 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:bg-gray-900 transition-all hover:-translate-y-0.5 cursor-pointer ">
            Get Started Now
          </button>
          </Link>
          <Link to={'/login'}>
            <button className="bg-white text-gray-900 border-2 cursor-pointer border-gray-100 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all">
            Browse Events
          </button>
          </Link>
        </div>

        <div className="mt-20 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={LandingImage}
            alt="Dashboard Preview"
            className="w-full h-auto"
          />
        </div>
      </main>

      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a6.01 6.01 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Recommendations</h3>
            <p className="text-gray-500 leading-relaxed">
              Our smart engine suggests events based on your major, interests,
              and past attendance.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">One-Tap Registration</h3>
            <p className="text-gray-500 leading-relaxed">
              Fast-track your entry. Register for any campus event in seconds
              and sync directly with your calendar.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Detailed Analytics</h3>
            <p className="text-gray-500 leading-relaxed">
              For organizers: get deep insights into attendance, feedback, and
              engagement levels.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}

export default LandingMain