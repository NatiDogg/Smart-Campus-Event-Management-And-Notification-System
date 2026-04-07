import React, { useState, useContext } from 'react'
import { Icons } from '../../components/Icons'
import { AppContext } from '../../context/ContextProvider'
import { useGetAllUsers } from '../../hooks/useAdmin.js'
import Loading from '../../components/Loading.jsx'
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

const Users = () => {
  const { setActiveModal } = useContext(AppContext)
  const { data, error, isLoading, isFetching } = useGetAllUsers()

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;   

  
  const allUsers = data?.users || [];
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);
  
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  

  return (
    <div className="space-y-8 p-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 text-sm">
            Control users across the entire campus community.
          </p>
        </div>
        <button
          onClick={() => setActiveModal({name: "invite-organizer"})}
          className="flex cursor-pointer items-center gap-2 justify-center bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
        >
          <Icons.Plus />
          Invite Event Organizer
        </button>
      </div>

      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:flex bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4">
          <div className="flex-1">User Details</div>
          <div className="w-48">Role</div>
          <div className="w-20 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-50">
          {(isLoading || isFetching) && (
            <div className='p-4 text-center'>
              <Loading size='md' color='black' />
            </div>
          )}

         
          {currentUsers.map((u) => (
            <div
              key={u._id}
              className="flex flex-col md:flex-row md:items-center px-10 py-6 hover:bg-gray-50/50 transition-colors gap-4"
            >
              <div className="flex-1 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-blue-600 shrink-0 overflow-hidden">
                  <img src={u.profile} alt="user profile" className='w-full h-full object-cover' />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{u.fullName}</p>
                  <p className="text-sm text-gray-400 truncate">{u.email}</p>
                </div>
              </div>

              <div className="md:w-48">
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${
                    u.role.toLowerCase() === "admin"
                      ? "bg-red-50 text-red-600"
                      : u.role.toLowerCase() === "organizer"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <div className="md:w-20 text-right">
                <button onClick={() => setActiveModal({name: 'delete-user', data: u._id})} className="p-2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors hover:bg-blue-50 rounded-xl">
                  <Icons.Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {(error || (allUsers.length === 0)) && !isLoading && (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Icons.Users />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest">No Users found</p>
            </div>
          )}
        </div>

       
        {allUsers.length > itemsPerPage && (
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{indexOfFirstUser + 1}</span> to <span className="font-bold text-gray-900">{Math.min(indexOfLastUser, allUsers.length)}</span> of <span className="font-bold text-gray-900">{allUsers.length}</span> users
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-2 cursor-pointer rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => paginate(idx + 1)}
                  className={`w-8 h-8 cursor-pointer  rounded-xl text-xs font-bold transition-all ${
                    currentPage === idx + 1 
                    ? "bg-gray-900 text-white shadow-lg" 
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-900"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-2 rounded-xl cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;