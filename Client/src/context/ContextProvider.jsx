import React, {createContext,useState} from 'react'
import { useNavigate } from 'react-router-dom';
export const AppContext = createContext()
const ContextProvider = ({children}) => {
     const [openMenu, setOpenMenu] = useState(false);
     const [user, setUser] = useState(null);
     const [token, setToken] = useState(null);
     const navigate = useNavigate()



     const values = {
      
         openMenu,
         setOpenMenu,
         user,
         setUser,
         token,
         setToken,
         navigate
     }
  return (
     <AppContext.Provider value={values}>
             {children}
     </AppContext.Provider>
  )
}

export default ContextProvider