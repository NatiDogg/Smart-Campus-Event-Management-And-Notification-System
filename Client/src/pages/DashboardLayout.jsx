import React,{useContext} from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
import { AppContext } from '../context/ContextProvider'
import CreateOrganizer from '../components/CreateOrganizer'
import DeleteUser from '../components/DeleteUser'
import CreateAnnouncement from '../components/createAnnouncement'
import CancelEvent from './organizer/CancelEvent'

const DashboardLayout = () => {
   const { activeModal } = useContext(AppContext)

  return (
      <section className='flex flex-col gap-6'>
             <Header />
              <div>
                <Outlet />
                 {/* if i have modals i will put them here*/}
                  {activeModal.name === 'invite-organizer' && <CreateOrganizer />}
                  {activeModal.name === 'delete-user' && <DeleteUser />}
                  {activeModal.name === 'create-announcement' && <CreateAnnouncement />}
                  {activeModal.name === 'cancel-event' && <CancelEvent />}
              </div>
      </section>
  )
}

export default DashboardLayout