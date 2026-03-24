import React from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  PlusSquare,
  User,
  LogOut,
  Terminal,
  Shield,
  Menu,
} from "lucide-react";
const NavBar = () => {
     const navLinksByRole = {
        student: [
          { label: "Home", path: "/dashboard", logo: <Home size={18} /> },
          { label: "Create", path: "create", logo: <PlusSquare size={18} /> },
          { label: "Profile", path: "profile", logo: <User size={18} /> },
        ],
        organizer: [
          { label: "Dashboard", path: "/admin", logo: <Home size={18} /> },
          { label: "Profile", path: "profile", logo: <User size={18} /> },
        ],
        admin: [

        ],


      };
  return (
    <div>NavBar</div>
  )
}

export default NavBar