import { useState,useContext } from 'react'
import {Route,Routes} from 'react-router-dom'
import Landing from './pages/Landing'
import Header from './components/Header'
import Signin from './pages/SignIn'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from './route/ProtectedRoute'
import { AppContext } from './context/ContextProvider'
import DashboardLayout from './pages/DashboardLayout'
import Home from '../src/pages/student/Home';
import Events from '../src/pages/student/Events';
import Calendar from '../src/pages/student/Calendar';
import MyEvents from '../src/pages/student/MyEvents';
import Notifications from './pages/Notifications'
import Announcements from './pages/student/Announcements'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import OrganizerEvents from './pages/organizer/OrganizerEvents'
import CreateEvents from './pages/organizer/CreateEvents'
import CheckIn from './pages/organizer/CheckIn'
import OrganizerAnalytics from './pages/organizer/OrganizerAnalytics'
import Feedback from './pages/organizer/Feedback'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import Approval from './pages/admin/Approval'
import AuditLog from './pages/admin/AuditLog'
import Categories from './pages/admin/Categories'
import Users from './pages/admin/Users'

function App() {
    const {user} = useContext(AppContext)
 
  return (
     <main className='flex flex-col min-h-screen'>
          <Toaster position='bottom-right' />
          <Routes>
                   {/*Public Routes*/}
                 <Route path='/' element={<Landing />} />
                 <Route path='/signin' element={<Signin />} />
                  <Route path='/login' element={<Login />} />

                    {/*Student Routes*/}
                    <Route path='student/dashboard' element={<ProtectedRoute role= "student">
                         <DashboardLayout />
                    </ProtectedRoute>}>
                        <Route index element={<Home />} />
                        <Route path='events' element={<Events />} />
                        <Route path='my-events' element={<MyEvents />} />
                        <Route path='calendar' element={<Calendar />} />
                        <Route path='announcements' element={<Announcements />} />
                        <Route path='notification' element={<Notifications />} />
                    </Route>

                    {/*Organizer Routes*/}
                     <Route path='/organizer/dashboard' element={<ProtectedRoute role='organizer'><DashboardLayout /></ProtectedRoute>}>
                       <Route index element={<OrganizerDashboard />} />
                       <Route path='events'  element={<OrganizerEvents />} />
                       <Route path='create'  element={<CreateEvents />} />
                        <Route path='check-in'  element={<CheckIn />} />
                        <Route path='analytics'  element={<OrganizerAnalytics />} />
                        <Route path='feedback'  element={<Feedback />} />
                     </Route>

                     {/*Admin Routes*/}

                     <Route path='/admin/dashboard' element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path='analytics' element={<AdminAnalytics />} />
                            <Route path='approvals' element={<Approval />} />
                            <Route path='users' element={<Users />} />
                            <Route path='categories' element={<Categories />} />
                            <Route path='audit-log' element={<AuditLog />} />
                     </Route>
          </Routes>
     </main>
  )
}

export default App
