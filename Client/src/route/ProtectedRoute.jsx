import React,{useContext} from 'react'
import {AppContext} from '../context/ContextProvider'
import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({children, role}) => {
      const {user} = useContext(AppContext)

     if(!user || !user.role){
       return  <Navigate to={'/login'} replace />
     }
     
     if(role && user.role.toLowerCase() !== role.toLowerCase()){
        return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
     } 

  return children
    }
export default ProtectedRoute;