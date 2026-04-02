import React,{useState,useContext} from 'react'
import {Icons} from '../../components/Icons'
import { AppContext } from '../../context/ContextProvider'
const Users = () => {
   const { setActiveModal } = useContext(AppContext)
  const users = [
    { id: '1', name: 'Alice Smith', email: 'alice@uni.edu', role: 'STUDENT', status: 'ACTIVE' },
    { id: '2', name: 'Bob Johnson', email: 'bob@uni.edu', role: 'ORGANIZER', status: 'ACTIVE' },
    { id: '3', name: 'Charlie Davis', email: 'charlie@uni.edu', role: 'STUDENT', status: 'PENDING' },
    { id: '4', name: 'Diana Prince', email: 'diana@uni.edu', role: 'ADMIN', status: 'ACTIVE' },
  ];

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
          onClick={() => setActiveModal("invite-organizer")}
          className="flex cursor-pointer items-center gap-2 justify-center bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
        >
          <Icons.Plus />
          Invite Event Organizer
        </button>
      </div>

      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header Row - Hidden on mobile if you want, or kept for structure */}
        <div className="hidden md:flex bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4">
          <div className="flex-1">User Details</div>
          <div className="w-48">Role</div>
          <div className="w-20 text-right">Actions</div>
        </div>

        {/* List Body */}
        <div className="divide-y divide-gray-50">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-col md:flex-row md:items-center px-10 py-6 hover:bg-gray-50/50 transition-colors gap-4"
            >
              {/* User Details Column */}
              <div className="flex-1 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-600 shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{u.name}</p>
                  <p className="text-sm text-gray-400 truncate">{u.email}</p>
                </div>
              </div>

              {/* Role Column */}
              <div className="md:w-48">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${
                    u.role === "ADMIN"
                      ? "bg-red-50 text-red-600"
                      : u.role === "ORGANIZER"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {u.role}
                </span>
              </div>

              {/* Actions Column */}
              <div className="md:w-20 text-right">
                <button onClick={()=>setActiveModal('delete-user')} className="p-2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors hover:bg-blue-50 rounded-xl">
                  <Icons.Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Users