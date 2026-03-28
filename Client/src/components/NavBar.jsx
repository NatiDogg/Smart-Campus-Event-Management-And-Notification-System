import React,{useContext} from 'react'
import { Link,NavLink } from 'react-router-dom'
import { AppContext } from '../context/ContextProvider';
const NavBar = ({setMenuOpen}) => {
      const {user} = useContext(AppContext)
     const navLinksByRole = {
        student: [
          { label: "Home", path: "/student" },
          { label: "Events", path: "events" },
          { label: "My Events", path: "my-events" },
          { label: "Announcements", path: "announcements" },
           { label: "Calendar", path: "calendar" },
          
          
        ],
        organizer: [
          { label: "Dashboard", path: "/organizer" },
          { label: "Events", path: "events"},
          { label: "Create", path: "create"},
           { label: "Check-In", path: "check-in"},
           { label: "Analytics", path: "analytics"},
            { label: "Feedback", path: "feedback"},
        ],
        admin: [
             { label: "Dashboard", path: "/admin" },
             { label: "Analytics", path: "analytics"},
             { label: "Approvals", path: "approvals"},
             { label: "Users", path: "users"},
             { label: "Categories", path: "categories"},
             { label: "Audit Log", path: "audit-log"},


        ],


      };
      const navLinks = navLinksByRole[user.role]
  return (
        <>
          {
            navLinks.map((link,index)=>{
              return <NavLink onClick={()=>setMenuOpen(false)} key={index} to={link.path} end className={({isActive})=> `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}>{link.label}</NavLink>
            })
          }
        </>
  )
}

export default NavBar

