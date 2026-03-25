import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
const DashboardLayout = () => {
  return (
      <section className='flex flex-col gap-6'>
             <Header />
              <div>
                <Outlet />
                 {/* if i have modals i will put them here*/}
              </div>
      </section>
  )
}

export default DashboardLayout