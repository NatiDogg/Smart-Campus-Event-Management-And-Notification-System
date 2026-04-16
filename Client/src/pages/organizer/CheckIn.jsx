import React,{useEffect, useState} from 'react'
import { useGetOrganizerDashboard, useGetRegisteredStudents } from '../../hooks/useOrganizer';

const CheckIn = () => {
  const [eventId, setEventId] = useState(null);
   const {data:organizerData, isLoading:isOrganizerDataLoading} = useGetOrganizerDashboard()
   const {data:registationList,isLoading} = useGetRegisteredStudents(eventId, {enabled: !!eventId})
   

   useEffect(()=>{
       if(registationList){
        console.log(registationList)
       }
   },[eventId,registationList])
   

  const attendees = [
    { id: 'S1', name: 'John Doe', email: 'jd@uni.edu' },
    { id: 'S2', name: 'Sarah Miller', email: 'sm@uni.edu' },
    { id: 'S3', name: 'James Wilson', email: 'jw@uni.edu' },
    { id: 'S4', name: 'Emily Chen', email: 'ec@uni.edu' },
    { id: 'S5', name: 'Michael Brown', email: 'mb@uni.edu' },
  ];
  const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Modern Web Development Workshop',
    description: 'Learn the latest trends in React, TypeScript, and Tailwind CSS. Perfect for beginners and intermediate developers.',
    date: 'Oct 24, 2023',
    time: '14:00 - 17:00',
    location: 'Science Building Hall A',
    category: 'Technology',
    organizer: 'Tech Students Club',
    attendeesCount: 45,
    image: 'https://picsum.photos/seed/tech/800/450',
    status: 'APPROVED',
    aiBadge: true,
  },
  {
    id: '2',
    title: 'Campus Startup Pitch Night',
    description: 'Present your ideas to local investors and entrepreneurs. Prizes for top 3 teams.',
    date: 'Oct 26, 2023',
    time: '18:30 - 21:00',
    location: 'Business Innovation Hub',
    category: 'Entrepreneurship',
    organizer: 'Entrepreneurship Society',
    attendeesCount: 120,
    image: 'https://picsum.photos/seed/pitch/800/450',
    status: 'APPROVED',
  },
  {
    id: '3',
    title: 'University Art Exhibition',
    description: 'Showcasing masterpieces from the Fine Arts department graduating class of 2023.',
    date: 'Oct 28, 2023',
    time: '10:00 - 16:00',
    location: 'Main Gallery',
    category: 'Arts & Culture',
    organizer: 'Fine Arts Dept',
    attendeesCount: 85,
    image: 'https://picsum.photos/seed/art/800/450',
    status: 'APPROVED',
    aiBadge: true,
  },
  {
    id: '4',
    title: 'Global Climate Summit: Student Edition',
    description: 'A dedicated session for students to discuss sustainable campus initiatives.',
    date: 'Nov 02, 2023',
    time: '11:00 - 13:00',
    location: 'Auditorium C',
    category: 'Science',
    organizer: 'Eco Warriors',
    attendeesCount: 200,
    image: 'https://picsum.photos/seed/climate/800/450',
    status: 'PENDING',
  },
  {
    id: '5',
    title: 'Intro to Python Workshop',
    description: 'A hands-on session for learning the basics of Python programming. This event took place last week.',
    date: 'Oct 15, 2023',
    time: '13:00 - 15:00',
    location: 'Computer Lab 4',
    category: 'Technology',
    organizer: 'CS Club',
    attendeesCount: 32,
    image: 'https://picsum.photos/seed/python/800/450',
    status: 'APPROVED',
    isPast: true,
  },
  {
    id: '6',
    title: 'Annual Sports Gala 2022',
    description: 'A week-long celebration of sports and athletics. Relive the moments of the biggest campus event of 2022.',
    date: 'Nov 15, 2022',
    time: '09:00 - 18:00',
    location: 'Campus Stadium',
    category: 'Sports',
    organizer: 'Sports Committee',
    attendeesCount: 500,
    image: 'https://picsum.photos/seed/sports/800/450',
    status: 'APPROVED',
    isPast: true,
  },
  {
    id: '7',
    title: 'Hackathon 2022: Future Tech',
    description: '48 hours of coding, innovation, and fun. Check out the winning projects from last year.',
    date: 'Dec 10, 2022',
    time: '10:00 - 22:00',
    location: 'Tech Hub',
    category: 'Technology',
    organizer: 'CS Club',
    attendeesCount: 150,
    image: 'https://picsum.photos/seed/hack/800/450',
    status: 'APPROVED',
    isPast: true,
  },
  {
    id: '8',
    title: 'New Campus Safety Protocols 2024',
    description: 'The administration has released new safety guidelines for all students and staff. Please review the updated emergency procedures and contact points.',
    date: 'Oct 30, 2023',
    time: '09:00 - 10:00',
    location: 'Campus-wide',
    category: 'Administrative',
    organizer: 'University Administration',
    attendeesCount: 0,
    image: 'https://picsum.photos/seed/safety/800/450',
    status: 'APPROVED',
    isAnnouncement: true,
  },
];

  return (
    <div className="space-y-8 p-5 ">
      <div className="flex flex-col md:flex-row md:items-center p-2 justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Attendance Check-In</h1>
          <p className="text-gray-500 text-sm">Mark students as present for your live events.</p>
        </div>
        <select 
          onChange={(e)=>setEventId(e.target.value)}
          className="px-6 py-4 z-50 rounded-2xl bg-white border border-gray-200 shadow-sm font-bold text-gray-700 text-sm focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
                  Select an Event
                </option>
                {isOrganizerDataLoading && (
                  <option value='' disabled>
                    Loading Events...
                  </option>
                )}
          {organizerData?.activeEvents.map(e => <option  key={e._id} value={e._id}>{e.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registration List</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{1} / {attendees.length} Checked In</span>
            </div>
            <div className="divide-y divide-gray-50">
              {attendees.map(a => (
                <div key={a.id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.email}</p>
                    </div>
                  </div>
                  <button 
                   
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white border-2 border-gray-100 text-gray-400 hover:border-blue-200`}
                  >
                    CheckIn
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-5">
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl space-y-4">
            <h3 className="text-xl font-bold">Quick QR Scan</h3>
            <p className="text-blue-100 text-sm">Open the campus camera to quickly scan student digital IDs for instant check-in.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
              Open Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckIn