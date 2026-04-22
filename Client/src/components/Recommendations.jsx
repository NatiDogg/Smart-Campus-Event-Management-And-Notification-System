import React from 'react'
import { useGetRecommendations } from '../hooks/useStudent'
import EventCard from '../components/EventCard'
import Loading from '../components/Loading'
import { Icons } from '../components/Icons'

const Recommendations = () => {
  const { data: recommendations, isLoading, isError } = useGetRecommendations()

  return (
    <div className="flex flex-col gap-10 p-6 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-2xl">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Recommended Events</h1>
            <p className="text-gray-500 font-medium">Personalized opportunities based on your campus activity</p>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loading size="lg" color="black" />
          <p className="mt-4 text-gray-500 font-medium animate-pulse text-lg">
            Our AI is curating your perfect campus experience...
          </p>
        </div>
      ) : isError ? (
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center p-12 bg-red-50/50 rounded-4xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl">⚠️</div>
          <h3 className="text-xl font-bold text-red-900">System Overload</h3>
          <p className="text-red-700 mt-2 leading-relaxed">
            The AI recommendation engine is experiencing high demand. 
            Don't worry, your data is safe just give it a moment and try refreshing.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : recommendations?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <Icons.Explore />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Nothing here yet!</h3>
          <p className="text-gray-500 max-w-sm mt-2">
            The more events you attend and interact with, the better our AI can find the right matches for you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {recommendations.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Recommendations