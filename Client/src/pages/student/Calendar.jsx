import React,{useContext} from 'react'
import { AppContext } from '../../context/ContextProvider'
const Calendar = () => {
    const {user,token} = useContext(AppContext)
  return (
      <div>
          calander
          

      </div>
  )
}

export default Calendar