import React, { useEffect, useState } from 'react';
import { useGetSubscribedCategories } from '../../hooks/useStudent';
import { useGetAllEvents } from '../../hooks/useEvent';
import EventCard from '../../components/EventCard';
import Loading from '../../components/Loading';
import { Icons } from '../../components/Icons';

const Subscription = () => {
  // 1. Data Fetching (React Query handles the caching)
  const { 
    data: subscribedCategories, 
    isLoading: isSubscribedLoading, 
    isError: subError 
  } = useGetSubscribedCategories();
  
  const { 
    data: allEvents, 
    isLoading: isAllEventsLoading, 
    isError: allEventsError 
  } = useGetAllEvents();

  // 2. Local state for the filtered results
  const [subscriptionFeed, setSubscriptionFeed] = useState([]);

  // 3. Filtering Logic (O(n + m) complexity)
  useEffect(() => {
    const categories = subscribedCategories?.preferredCategories;
    const events = allEvents?.result;

    if (categories && events) {
      const subscribedNamesSet = new Set(categories.map(c => c.name));
      const filtered = events.filter((event) => 
        subscribedNamesSet.has(event.category.name)
      );

      setSubscriptionFeed(filtered);
    }
  }, [allEvents, subscribedCategories]);

  // 4. Loading & Error UI States
  const isLoading = isSubscribedLoading || isAllEventsLoading;
  const isError = subError || allEventsError;

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
                className="w-6 h-6 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Subscribed Feed</h1>
            <p className="text-gray-500 font-medium">Personalized events based on the categories you follow</p>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loading size="lg" color="black" />
          <p className="mt-4 text-gray-500 font-medium animate-pulse text-lg">
            Fetching your personalized feed...
          </p>
        </div>
      ) : isError ? (
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center p-12 bg-red-50/50 rounded-4xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl">⚠️</div>
          <h3 className="text-xl font-bold text-red-900">Unable to load feed</h3>
          <p className="text-red-700 mt-2 leading-relaxed">
            We're having trouble connecting to the event service. 
            Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : subscriptionFeed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <Icons.Explore />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Your feed is quiet</h3>
          <p className="text-gray-500 max-w-sm mt-2">
            Try subscribing to more categories in your preferences to see new events here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {subscriptionFeed.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;