import React, {createContext,useState} from 'react'

export const AppContext = createContext()
const ContextProvider = ({children}) => {
     const [openMenu, setOpenMenu] = useState(false);
     const values = {
         openMenu,
         setOpenMenu
     }
  return (
     <AppContext.Provider value={values}>
             {children}
     </AppContext.Provider>
  )
}

export default ContextProvider