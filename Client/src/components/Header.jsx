import React, { useContext, useState } from "react";
import NavBar from "./NavBar.jsx";
import aauLogo from '../assets/aauLogo4.jpg'
import { Link } from "react-router-dom";
import { Menu, LogOut, X, Settings, Bell } from 'lucide-react'
import { AppContext } from "../context/ContextProvider.jsx";
import { Icons } from "./Icons.jsx";
import { useLogoutUser } from "../hooks/useAuth.js";
import Loading from '../components/Loading.jsx'

const Header = () => {
  const { openMenu, setOpenMenu, user, navigate } = useContext(AppContext)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isPending, mutate } = useLogoutUser()

  const handleLogout = () => {
    mutate(undefined, {
      onSettled: () => {
        setOpenMenu(false); // Close sidebar on logout
       
      }
    })
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-6 h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Link
                to={`/${user.role}`}
                className="flex items-center space-x-2 group"
              >
                <div className="p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                  <img
                    src={aauLogo}
                    width={50}
                    height={50}
                    alt="aau logo"
                    className="object-contain"
                  />
                </div>
                <span className="text-xl hidden md:flex font-bold tracking-tight text-slate-900">
                  CampusEvents
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <NavBar setMenuOpen={setOpenMenu} />
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3">
              {/* Notification Icon */}
              <button
                onClick={() => navigate(`${user.role}/notification`)}
                className="p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all relative"
              >
                <Icons.Notifications />
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex cursor-pointer items-center gap-3 p-1 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <img
                    src={
                      user.profile && user.profile.trim() !== ""
                        ? user.profile.replace("http://", "https://")
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.fullName
                          )}&background=2563EB&color=fff`
                    }
                    alt="user"
                    onError={(e) => {
                      
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.fullName
                      )}&background=2563EB&color=fff`;
                    }}
                    className="h-10 w-10 rounded-full shadow-sm object-cover"
                  />
                  <div className="text-left hidden lg:block pr-2">
                    <p className="text-xs font-bold text-gray-900 leading-none">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-1 tracking-wider">
                      {user.role}
                    </p>
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate(`${user.role}/setting`);
                        }}
                        className="w-full cursor-pointer text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Settings size={18} /> Setting
                      </button>
                      <button
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full cursor-pointer text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-semibold"
                      >
                        {isPending ? (
                          <Loading size="sm" color="blue" />
                        ) : (
                          <>
                            <LogOut size={18} /> Log Out
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="lg:hidden ml-2">
                <button
                  onClick={() => setOpenMenu(true)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Menu size={25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- PROFESSIONAL MOBILE SIDEBAR --- */}

      {/* 1. Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity duration-300 lg:hidden ${
          openMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenMenu(false)}
      />

      {/* 2. Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-70 bg-white z-70 shadow-2xl transition-transform duration-300 ease-in-out transform lg:hidden ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <img src={aauLogo} width={30} alt="logo" />
              <span className="font-black text-gray-900 tracking-tight">
                Menu
              </span>
            </div>
            <button
              onClick={() => setOpenMenu(false)}
              className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <NavBar setMenuOpen={setOpenMenu} />
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/50">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
            >
              <LogOut size={20} /> Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;