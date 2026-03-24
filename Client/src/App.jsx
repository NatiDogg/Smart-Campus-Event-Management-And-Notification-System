import { useState } from 'react'
import {Route,Routes} from 'react-router-dom'
import Landing from './pages/Landing'
import Header from './components/Header'
import Signin from './pages/SignIn'
import Login from './pages/Login'
function App() {
    
 
  return (
     <main className='flex flex-col min-h-screen'>
        
          <Routes>
                   {/*Public Routes*/}
                 <Route path='/' element={<Landing />} />
                 <Route path='/signin' element={<Signin />} />
                  <Route path='/login' element={<Login />} />
          </Routes>
     </main>
  )
}

export default App
