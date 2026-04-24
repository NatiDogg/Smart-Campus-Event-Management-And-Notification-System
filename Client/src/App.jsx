import React, { Suspense, lazy, useEffect,useContext } from 'react';
import { Route, Routes,Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './route/ProtectedRoute';
import DashboardLayout from './pages/DashboardLayout';
import { useVerifySession } from './hooks/useAuth';
import { AppContext } from './context/ContextProvider';
import api from './api/axios';
import GoogleSuccess from './route/GoogleSuccess';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/resetPassword';

import useFcmToken from './hooks/useFcmToken'



// Public Pages
const Landing = lazy(() => import('./pages/Landing'));
const Signin = lazy(() => import('./pages/SignIn'));
const Login = lazy(() => import('./pages/Login'));
// Shared Pages
const Notifications = lazy(() => import('./pages/Notifications'));
const Setting = lazy(()=>import('./components/Setting'))

// Student Pages
const Home = lazy(() => import('./pages/student/Home'));
const Events = lazy(() => import('./pages/student/Events'));
const Calendar = lazy(() => import('./pages/student/Calendar'));
const MyEvents = lazy(() => import('./pages/student/MyEvents'));
const Announcements = lazy(() => import('./pages/student/Announcements'));
const Recommendations = lazy(()=> import('./components/Recommendations'));
const EventDetails = lazy(()=> import('./components/EventDetails'));

// Organizer Pages
const OrganizerDashboard = lazy(() => import('./pages/organizer/OrganizerDashboard'));
const OrganizerEvents = lazy(() => import('./pages/organizer/OrganizerEvents'));
const CreateEvents = lazy(() => import('./pages/organizer/CreateEvents'));
const CheckIn = lazy(() => import('./pages/organizer/CheckIn'));
const OrganizerAnalytics = lazy(() => import('./pages/organizer/OrganizerAnalytics'));
const Feedback = lazy(() => import('./pages/organizer/Feedback'));
const EditEvent = lazy(()=>import('../src/pages/organizer/EditEvent') )

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const Approval = lazy(() => import('./pages/admin/Approval'));
const AuditLog = lazy(() => import('./pages/admin/AuditLog'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Users = lazy(() => import('./pages/admin/Users'));


const sharedRoutes = (
  <>
    <Route path='setting' element={<Setting />} />
    <Route path='notification' element={<Notifications />} />
  </>
);

// A simple loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

    

function App() {
     const {setUser,user, setToken} = useContext(AppContext)
     const {data,isPending} = useVerifySession()
     
    useFcmToken(user);


     useEffect(()=>{
        if(data){
          setUser(data.user);
      setToken(data.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        }
     },[data, setUser, setToken])

     if (isPending || (data && !user)) {
         return <PageLoader />;
      }
  return (
    <main className='flex flex-col min-h-screen'>
      <Toaster position='bottom-right' />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          
          <Route path='/' element={ user && user.role ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Landing />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/login' element={<Login />} />

           {/* Google callback Success Route */}
           <Route path='/auth/success' element={<GoogleSuccess />} />
           
              {/* Forgot password route */}
              <Route path='/forget-password' element={<ForgotPassword />} />

               {/* Reset password route */}
               <Route path='/reset-password' element={<ResetPassword />} />
 
          {/* Student Routes */}
          <Route path='/student' element={<ProtectedRoute role="student"><DashboardLayout /></ProtectedRoute>}>
            {/* NavLink to="/student/dashboard" with 'end' prop will match this index */}
            <Route index element={<Home />} />
            <Route path='events' element={<Events />} />
            <Route path='my-events' element={<MyEvents />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='announcements' element={<Announcements />} />
            <Route path='recommendations' element={<Recommendations />} />
            <Route path='details/:id' element={<EventDetails />} />
            {sharedRoutes}
             
          </Route>

          {/* Organizer Routes */}
          <Route path='/organizer' element={<ProtectedRoute role='organizer'><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<OrganizerDashboard />} />
            <Route path='events' element={<OrganizerEvents />} />
            <Route path='create' element={<CreateEvents />} />
            <Route path='check-in' element={<CheckIn />} />
            <Route path='analytics' element={<OrganizerAnalytics />} />
            <Route path='feedback' element={<Feedback />} />
            <Route path='edit/:id' element={<EditEvent />} />
             {sharedRoutes}
          </Route>

          {/* Admin Routes */}
          <Route path='/admin' element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path='analytics' element={<AdminAnalytics />} />
            <Route path='approvals' element={<Approval />} />
            <Route path='users' element={<Users />} />
            <Route path='categories' element={<Categories />} />
            <Route path='audit-log' element={<AuditLog />} />
              {sharedRoutes}
          </Route>
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
