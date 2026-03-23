import React, {createContext} from 'react'

export const AppContext = createContext()
const ContextProvider = ({children}) => {
     const values = {
        
     }
  return (
     <AppContext.Provider value={values}>
             {children}
     </AppContext.Provider>
  )
}

export default ContextProvider