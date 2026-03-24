import React,{useContext} from "react";
import NavBar from "./NavBar.jsx";
import aauLogo from '../assets/aauLogo4.jpg'
import { Link } from "react-router-dom";
import {Menu, LogOut} from 'lucide-react'
import { AppContext } from "../context/ContextProvider.jsx";

const Header = () => {

   const {openMenu, setOpenMenu} = useContext(AppContext)
  return (
    <header className="w-full fixed z-50 px-6 py-3 bg-white shadow">
      <div className="max-w-365 relative flex justify-between items-center p-2">
        <nav>
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-blue-600 group"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <img src="" alt="" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              DevConnect
            </span>
          </Link>
        </nav>
        <div className=" hidden md:flex items-center gap-6">
            <NavBar />
        </div>
        <div className="block md:hidden">
          <Menu className="cursor-pointer"
            onClick={() => setOpenMenu((prevMenu) => !prevMenu)}
            size={25}
          />
        </div>
            {
                openMenu && <div className="fixed md:hidden shadow-gray-300 shadow-2xl right-10 top-12 p-5 min-w-55 flex flex-col items-center gap-4 z-50 border border-white rounded-xl bg-white"> 

                    <NavBar menu={setOpenMenu} />
            </div>
            }
        

        <div className="hidden md:flex items-center">
          <button className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer">
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;