import React, {createContext,useState} from 'react'

export const AppContext = createContext()
const ContextProvider = ({children}) => {
     const [openMenu, setOpenMenu] = useState(false);
     const [user, setUser] = useState({
        id: 1,
        role: 'admin'
     });
     const [token, setToken] = useState(null);
     const values = {
         openMenu,
         setOpenMenu,
         user,
         setUser,
         token,
         setToken
     }
  return (
     <AppContext.Provider value={values}>
             {children}
     </AppContext.Provider>
  )
}

export default ContextProvider