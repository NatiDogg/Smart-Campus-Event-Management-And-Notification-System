import React,{useContext} from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/ContextProvider';
const NavBar = () => {
      const {user} = useContext(AppContext)
     const navLinksByRole = {
        student: [
          { label: "Home", path: "/student/dashboard" },
          { label: "Events", path: "events" },
          { label: "My Events", path: "my-events" },
          { label: "Announcements", path: "announcements" },
           { label: "Calendar", path: "calendar" },
          
          
        ],
        organizer: [
          { label: "Dashboard", path: "/organizer/dashboard" },
          { label: "Events", path: "events"},
          { label: "Create", path: "create"},
           { label: "Check-In", path: "check-in"},
           { label: "Analytics", path: "analytics"},
            { label: "Feedback", path: "feedback"},
        ],
        admin: [
             { label: "Dashboard", path: "/admin/dashboard" },
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
              return <Link key={index} to={link.path}>{link.label}</Link>
            })
          }
        </>
  )
}

export default NavBar