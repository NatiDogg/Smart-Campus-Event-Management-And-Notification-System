import React,{useContext,useState} from 'react'
import { AppContext } from '../context/ContextProvider';
import { useCreateAnnouncement } from '../hooks/useAdmin';
import {toast} from 'react-hot-toast';
import Loading from '../components/Loading'

const CreateAnnouncement = () => {
     const {setActiveModal} = useContext(AppContext);
     const [announcementData, setAnnouncementData] = useState({
        title: '',
        content: ''
     })
     const {mutate,isPending} = useCreateAnnouncement()

     const handleInput = (e)=>{
      const {value, name} = e.target

      setAnnouncementData((prevData)=>({
        ...prevData,
        [name]: value
      }))
     }


     const onSubmitHandler = (e)=>{
         e.preventDefault()
         const allFilled = Object.values(announcementData).every(value => value !== '');

         if(!allFilled){
           return toast.error("Please fill all required fields");
         }
         mutate(announcementData, {
            onSuccess:()=>{
                setActiveModal({name: null, data: null})
            }
         });
     }
    
  return (
    <div
      onClick={() => setActiveModal({ name: null, data: null })}
      className="fixed  inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-10 space-y-8 animate-in zoom-in-95 duration-200"
      >
        <h2 className="text-2xl md:text-3xl font-black text-gray-900">
          Create Announcement
        </h2>
        <form
          onSubmit={onSubmitHandler}
          id="announcement-form"
          className="space-y-4 grid grid-cols-1 gap-2 "
        >
          <div className="space-y-1 flex flex-col gap-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Title
            </label>
            <input
              
              name="title"
              onChange={(e)=>handleInput(e)}
              value={announcementData.title}
              type="text"
              className="w-full px-6 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm"
              placeholder="announcement title.."
            />
          </div>
          <div className="space-y-1 flex flex-col gap-1">
            <label htmlFor='content-input' className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Content
            </label>
            <textarea placeholder='announcement description...' value={announcementData.content} onChange={(e)=>handleInput(e)} name="content" id="content-input" rows={4}  className="w-full resize-none px-6 py-3 text-sm rounded-2xl bg-gray-50 border border-gray-100"></textarea>
          </div>
          

          
        </form>
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <button
            type="button"
            onClick={() => setActiveModal({ name: null, data: null })}
            className="flex-1 cursor-pointer py-4 text-gray-500 hover:text-red-600 font-bold"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            form="announcement-form"
            className="flex-1 transition-all duration-150 hover:-translate-y-1 py-4 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer font-bold rounded-2xl shadow-xl"
          >
            {isPending ? (<Loading size='sm' />) : ('Create Announcement')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAnnouncement;

