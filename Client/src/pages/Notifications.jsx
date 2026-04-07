import React,{useState} from 'react'
import {formatDistanceToNow} from 'date-fns'
import {Icons} from '../components/Icons'
import { useDeleteNotification, useGetNotification } from '../hooks/useNotification';
import Loading from '../components/Loading'
const Notifications = () => {
  

   const {data:notifications,isLoading, isFetching,error} = useGetNotification()
   const {isPending,mutate,data:deletedNotification} = useDeleteNotification()

  

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-gray-500 text-lg">
            Stay updated with the latest campus activity.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {(isLoading || isFetching) && (
          <div className="p-4 flex flex-col  justify-center items-center">
            <Loading size="md" color="black" />
          </div>
        )}
        {notifications && notifications.length > 0 && (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-8 flex items-start gap-6 hover:bg-gray-50/50 transition-colors group `}
              >
                <div
                  className={`w-14 h-14 hidden rounded-2xl md:flex items-center justify-center shrink-0 ${
                    n.title.toLowerCase().includes("Approved") ||
                    n.title.toLowerCase().includes("registered")
                      ? "bg-green-100 text-green-600"
                      : n.title.includes("reminder") ||
                        n.title.includes("updated")
                      ? "bg-orange-100 text-orange-600"
                      : n.title.toLowerCase().includes("rejected") ||
                        n.title.toLowerCase().includes("unregistered") ||
                        n.title.toLowerCase().includes("canceled")
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {n.title.toLowerCase().includes("new event submission") && (
                    <Icons.Plus />
                  )}

                  {(n.title.toLowerCase().toLowerCase().includes("reminder") ||
                    n.title.includes("updated")) && <Icons.Calendar />}

                  {(n.title.toLowerCase().includes("rejected") ||
                    n.title.toLowerCase().includes("unregistered") ||
                    n.title.toLowerCase().includes("canceled")) && (
                    <Icons.Report className="rotate-45" />
                  )}
                   
                  {n.title.toLowerCase().includes(" approved") && <Icons.Plus />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">
                      {n.title}
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <span className="text-xs text-gray-400 font-medium">
                        {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                      </span>
                      <button
                        onClick={() => mutate(n._id)}
                        className="p-2 cursor-pointer text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {n.message}
                    
                    {n.eventId?.title &&
                      !n.message.includes(n.eventId.title) && (
                        <span className="font-semibold block mt-1">
                          Event: {n.eventId.title}
                        </span>
                      )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {(error || (notifications && notifications.length === 0)) && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Icons.Notifications />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest">
              All caught up!
            </p>
            <p className="text-gray-500 text-sm">
              No new notifications to show.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications