import React,{useState} from 'react'
import {formatDistanceToNow} from 'date-fns'
import {Icons} from '../components/Icons'
const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'approval', title: 'Event Approved', message: 'Your "Modern Web Dev Workshop" has been approved and is now public.', time: '10 mins ago', unread: true },
    { id: '2', type: 'reminder', title: 'Upcoming Event', message: 'The Startup Pitch Night starts in 2 hours at the Innovation Hub.', time: '2 hours ago', unread: true },
    { id: '3', type: 'system', title: 'System Maintenance', message: 'The platform will be down for scheduled maintenance tonight at 12 AM.', time: '5 hours ago', unread: false },
    { id: '4', type: 'event', title: 'New Event Recommendation', message: 'A new workshop on "Cloud Architecture" was just added to your department.', time: '1 day ago', unread: false },
  ]);

  

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 text-lg">Stay updated with the latest campus activity.</p>
        </div>
        <button 
          
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div key={n.id} className={`p-8 flex items-start gap-6 hover:bg-gray-50/50 transition-colors group ${n.unread ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  n.type === 'approval' ? 'bg-green-100 text-green-600' :
                  n.type === 'reminder' ? 'bg-orange-100 text-orange-600' :
                  n.type === 'system' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {n.type === 'approval' && <Icons.Plus />}
                  {n.type === 'reminder' && <Icons.Calendar />}
                  {n.type === 'system' && <Icons.Settings />}
                  {n.type === 'event' && <Icons.Explore />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">{n.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400 font-medium">{n.time}</span>
                      <button 
                        
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{n.message}</p>
                </div>
                
                {n.unread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Icons.Notifications />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest">All caught up!</p>
            <p className="text-gray-500 text-sm">No new notifications to show.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications