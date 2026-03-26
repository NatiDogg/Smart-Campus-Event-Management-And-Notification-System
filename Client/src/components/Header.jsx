import React,{useContext, useState} from "react";
import NavBar from "./NavBar.jsx";
import aauLogo from '../assets/aauLogo4.jpg'
import { Link } from "react-router-dom";
import {Menu, LogOut} from 'lucide-react'
import { AppContext } from "../context/ContextProvider.jsx";
import { Icons } from "./Icons.jsx";
import { useLogoutUser } from "../hooks/useAuth.js";
import Loading from '../components/Loading.jsx'
const Header = () => {

   const {openMenu, setOpenMenu,user,navigate} = useContext(AppContext)
   const [profileOpen, setProfileOpen] = useState(false)
   const {data,isPending, error,mutate} = useLogoutUser()
       const handleLogout = ()=>{
             mutate(undefined, {
              onSuccess: ()=>{
                navigate('/')
              },
              onError:(error)=>{
                console.error("Logout failed:", error);
                navigate("/")
              }
             })
       }
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer group">
               <Link
            to={`/${user.role}`}
            className="flex items-center space-x-2 text-blue-600 group"
          >
            <div className=" p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <img src={aauLogo} width={50} height={50} alt="aau logo" />
            </div>
            <span className="text-xl hidden md:flex font-bold tracking-tight text-slate-900">
            SmartCampus
          </span>
          </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <NavBar setMenuOpen = {setOpenMenu} />
          </div>
          

          <div className="flex items-center gap-3">
            <div className="flex lg:hidden">
            <Menu
              className="cursor-pointer"
              onClick={() => setOpenMenu((prevMenu) => !prevMenu)}
              size={25}
            />
          </div>
          {openMenu && (
            <div className="fixed lg:hidden shadow-gray-300 shadow-2xl right-10 top-15 p-5 min-w-55 flex flex-col items-center gap-4 z-50 border border-white rounded-xl bg-white">
              <NavBar menu={setOpenMenu} />
            </div>
          )}
            <button onClick={()=> navigate(`${user.role}/notification`)} className={`p-2 rounded-xl cursor-pointer transition-all relative `}>
              <Icons.Notifications />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex cursor-pointer items-center gap-3 p-1 rounded-xl hover:bg-gray-100 transition-all border border-transparent `}
              >
                <img
                  src={
                    user.profile ||
                    `https://ui-avatars.com/api/?name=${user.fullName}&background=2563EB&color=fff`
                  }
                  alt="Profile"
                  className="h-10 w-10 rounded-xl shadow-sm object-cover"
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
                        navigate(`${user.role}/setting`)
                      }}
                      className="w-full cursor-pointer text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Icons.Settings /> Setting
                    </button>
                    <button onClick={handleLogout} disabled={isPending} className="w-full cursor-pointer text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-semibold">
                     {isPending ? (<Loading size="sm" color="blue" />) : ( <><Icons.Logout /> Log Out</>)}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;