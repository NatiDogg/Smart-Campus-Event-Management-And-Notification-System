import React,{useContext,useState} from 'react'
import { AppContext } from '../context/ContextProvider'
import {toast} from 'react-hot-toast'
import { useCreateOrganizer } from '../hooks/useCreateOrganizer'
import Loading from './Loading.jsx'
const CreateOrganizer = () => {
  const { setActiveModal } = useContext(AppContext)
  const {mutate,isPending, data} = useCreateOrganizer()
   const [formData, setFormData] = useState({
     fullName: '',
    email: '',
    organizationName: '',
    phoneNumber: ''
   });



     const handleInput = (e)=>{
       const {value, name} = e.target
       setFormData((prevData)=>({
         ...prevData,
         [name]: value
       }))
     }
     const onSubmitHandler = (e)=>{
          e.preventDefault()
          const allFilled = Object.values(formData).every(value=> value !== '');
          if(!allFilled){
             return toast.error("Please fill all required fields");
          }

          mutate(formData, {
            onSuccess:()=>{
              setFormData({
                fullName: "",
                email: "",
                organizationName: "",
                phoneNumber: "",
              });
               setActiveModal(null)
               
            }
          })


          
     }
  return (
    <div onClick={()=>setActiveModal({name: null, data: null})} className="fixed  inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={(e)=>e.stopPropagation()} className="bg-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-10 space-y-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Create Event Organizer</h2>
            <form onSubmit={onSubmitHandler} id="organizer-form" className="space-y-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</label>
                <input required name='fullName' value={formData.fullName} onChange={(e)=>handleInput(e)} type="text" className="w-full px-6 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm" placeholder="Organizer Name" />
              </div>
              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"> Email</label>
                <input required name='email' value={formData.email} onChange={(e)=>handleInput(e)}  type="email" className="w-full px-6 py-3 text-sm rounded-2xl bg-gray-50 border border-gray-100" placeholder="dept@university.edu" />
              </div>
              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organization Name / Club</label>
                <input required name='organizationName' value={formData.organizationName} onChange={(e)=>handleInput(e)}  type="text" className="w-full px-6 py-3 text-sm rounded-2xl bg-gray-50 border border-gray-100" placeholder="tech club" />
              </div>
              
              <div className="space-y-1 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</label>
                <input required name='phoneNumber' value={formData.phoneNumber} onChange={(e)=>handleInput(e)} type="tel" className="w-full px-6 py-3 text-sm rounded-2xl bg-gray-50 border border-gray-100"  />
              </div>
            </form>
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <button type='button' onClick={() => setActiveModal({name: null, data: null})} className="flex-1 cursor-pointer py-4 text-gray-500 hover:text-red-600 font-bold">Cancel</button>
              <button disabled={isPending} form="organizer-form"  className="flex-1 transition-all duration-150 hover:-translate-y-1 py-4 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer font-bold rounded-2xl shadow-xl">{isPending ? (<Loading size='sm' />) : ('Create Account')}</button>
            </div>
          </div>
        </div>
  )
}

export default CreateOrganizer