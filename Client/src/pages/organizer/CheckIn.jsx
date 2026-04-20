import React, { useEffect, useState } from 'react'
import { useGetOrganizerDashboard, useGetRegisteredStudents, useMarkStudentAttendance } from '../../hooks/useOrganizer';
import Loading from '../../components/Loading'
import { Search, ChevronLeft, ChevronRight } from "lucide-react"; // Added Chevron icons
import { useSearchParams } from 'react-router-dom'

const CheckIn = () => {
  const [eventId, setEventId] = useState("");
  const { data: organizerData, isLoading: isOrganizerDataLoading } = useGetOrganizerDashboard()
  const { data: registrationList, isLoading: isRegistrationListLoading, error } = useGetRegisteredStudents(eventId, { enabled: !!eventId })
  const { mutate: markAttendance, isPending } = useMarkStudentAttendance()

  const [checkedInStudent, setCheckedInStudent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    if (id) {
      setEventId(id)
    }
  }, [id])
  useEffect(() => {
  setCurrentPage(1);
}, [searchQuery]);

  useEffect(() => {
    if (registrationList) {
      const attendedStudents = registrationList?.registeredStudent.filter((reg) => reg.isPresent === true).length
      setCheckedInStudent(attendedStudents || 0)
      
      setCurrentPage(1);
    }
  }, [eventId, registrationList])

 
  const allStudents = registrationList?.registeredStudent || [];
  const filteredAllStudents = allStudents.filter((reg) => 
  reg.student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
);
  const totalPages = Math.ceil(filteredAllStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredAllStudents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const markAttendanceHandler = (studentId, currentStatus) => {
    if (!eventId) return;
    markAttendance({
      eventId: eventId,
      data: {
        studentId: studentId,
        isPresent: !currentStatus
      }
    })
  }



  return (
    <div className="space-y-8 p-5">
      {/* Header & Select Section */}
      <div className="flex flex-col md:flex-row md:items-center p-4 justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Attendance Check-In</h1>
          <p className="text-gray-500 text-sm">Mark students as present for your live events.</p>
        </div>
        <select
          onChange={(e) => setEventId(e.target.value)}
          value={eventId}
          className="px-6 py-4 w-full md:w-[30%] rounded-2xl bg-white border border-gray-200 shadow-sm font-bold text-gray-700 text-sm focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select an Event</option>
          {isOrganizerDataLoading && <option value='' disabled>Loading Events...</option>}
          {organizerData?.activeEvents.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registration List</span>
               
              {allStudents.length > 0 ? (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {checkedInStudent} / {allStudents.length} Checked In
                </span>
              ) : (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Empty List</span>
              )}

              
            </div>
            
            {
              allStudents.length > 0 && ( <div className=' w-full group flex md:flex-row md:justify-end items-end px-2 '>
                         <input 
                           onChange={(e)=>setSearchQuery(e.target.value)}
                           type="text" 
                           placeholder="Search by name..." 
                           className=" pl-5 w-full md:w-[50%] lg:w-[35%]  py-3 bg-gray-50 border border-gray-200 rounded-3xl text-sm focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                           
                         />
             </div>)
            }
            
              

                

            <div className="divide-y divide-gray-50 flex-1">
              {!eventId && (
                <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                  Please select an event to see attendees
                </div>
              )}

              {isRegistrationListLoading ? (
                <div className="p-20 flex justify-center"><Loading size="md" color="black" /></div>
              ) : currentStudents.length > 0 ? (
                currentStudents.map(reg => (
                  <div key={reg._id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 hidden md:flex h-12 rounded-full bg-gray-100 items-center justify-center overflow-hidden">
                        <img src={reg.student.profile} alt="student profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{reg.student.fullName}</p>
                        <p className="text-xs text-gray-500">{reg.student.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => markAttendanceHandler(reg.student._id, reg.isPresent)}
                      disabled={isPending}
                      className={`px-6 cursor-pointer py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reg.isPresent ? 'bg-green-600 text-white shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-blue-200'}`}
                    >
                      {reg.isPresent ? 'Present' : 'CheckIn'}
                    </button>
                  </div>
                ))
              ) : (eventId && !isRegistrationListLoading) && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <Search className="text-gray-400 mb-3" size={28} />
                  <h3 className="text-xl font-semibold text-gray-900">No Students Registered</h3>
                  <p className="text-sm text-gray-500 mt-1">Once students sign up, they will appear here.</p>
                </div>
              )}
            </div>

            {/* --- Pagination Footer --- */}
            {filteredAllStudents.length > itemsPerPage && (
              <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  Showing <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, allStudents.length)}</span> of <span className="font-bold text-gray-900">{allStudents.length}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    className="p-2 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => paginate(idx + 1)}
                      className={`w-8 h-8 cursor-pointer rounded-xl text-xs font-bold transition-all ${currentPage === idx + 1 ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    className="p-2 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

       
        {/*<div className="space-y-6">
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl space-y-4">
            <h3 className="text-xl font-bold">Quick QR Scan</h3>
            <p className="text-blue-100 text-sm">Scan student code for instant attendance.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              Open Camera
            </button>
          </div>
        </div>*/}
      </div>
    </div>
  );
}

export default CheckIn;