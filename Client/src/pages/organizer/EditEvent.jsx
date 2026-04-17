import React, { useEffect,useState,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrganizerDashboard } from '../../hooks/useOrganizer'
import { useGetCategories } from '../../hooks/useCategory'
import {useEditEvent} from '../../hooks/useEvent'
import Loading from '../../components/Loading'
import { AppContext } from '../../context/ContextProvider'
import toast from 'react-hot-toast'
const EditEvent = () => {
  const {navigate} = useContext(AppContext)
   const {id} = useParams()
   const {data , isLoading:isDashboardLoading} = useGetOrganizerDashboard()
   const {data:categories,isLoading,error:isCategoryError} = useGetCategories()
   const {mutate,isPending} = useEditEvent()
   const [eventData, setEventData] = useState({
     title: '',
     description: '',
     location: '',
     category: '',
     capacity: 0,
     startDate: '',
     endDate: ''
   });

   useEffect(()=>{
       if(id && data && categories){
         
         const event = data?.activeEvents?.find(e=> e._id === id)
          if (!event) return;
         const category = categories?.find(c=> c._id === event.category) || ''
         const formatForInput = (dateString) => {
           if (!dateString) return '';
           // it converts 2026-04-11T14:43:00.000Z to 2026-04-11T14:43
        return dateString.split('.')[0].slice(0, 16);
        };
         setEventData(prevData=>({
          ...prevData,
          title: event.title,
          description: event.description,
          location: event.location,
          category: category.name,
          capacity: event.capacity,
          startDate: formatForInput(event.startDate),
          endDate: formatForInput(event.endDate)
         }))
       }

   },[id,data,categories])

    const handleInput = (e)=>{
       const {value, name} = e.target
       setEventData(prevData=>({
        ...prevData,
        [name]: value
       }))
    }
    const onSubmitHandler = (e)=>{
       e.preventDefault()
       const isAllFilled = Object.values(eventData).every(value=> value !== '' && value !== 0)
       if(!isAllFilled){
         return toast.error("Please fill all required fields");
       }
       mutate({id,updateData: eventData},{
        onSuccess:()=>{
          navigate('/organizer')
        }
       })
    }
   

   if(isDashboardLoading || isLoading){
    return  <div className=' min-h-screen flex flex-col justify-center items-center'> <Loading size='md' color='black' /></div>
   }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 ">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Edit Event
        </h1>
        <p className="text-gray-500 text-sm">
          
          Update your event details below.
        </p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden"
      >
        <div className="p-8 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Event Title
              </label>
              <input
                type="text"
                 value={eventData.title}
                 onChange={(e)=>handleInput(e)}
                name="title"
                placeholder="e.g. Annual Tech Symposium"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Category
              </label>
              <select
                onChange={(e)=>handleInput(e)}
                value={eventData.category}
                name="category"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {isLoading && (
                  <option value='' disabled>
                    Loading categories...
                  </option>
                )}

                {categories &&
                  categories.map((category) => {
                    return (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
                {categories && categories.length === 0 && (
                  <option className='p-12 text-center text-gray-500 italic' disabled value="">
                    No categories created yet
                  </option>
                )}
                {
                  isCategoryError && <option disabled value=""> Error loading categories</option>
                }
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
            onChange={(e)=>handleInput(e)}
              value={eventData.description}
              name="description"
              rows={4}
              placeholder="Tell everyone what the event is about..."
              required
              className="w-full px-5 resize-none py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Start Date
              </label>
              <input
               onChange={(e)=>handleInput(e)}
                type="datetime-local"
                value={eventData.startDate}
                
                required
                name='startDate'
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                End Date
              </label>
              <input
                type="datetime-local"
                value={eventData.endDate}
                min={eventData.startDate ? eventData.startDate.substring(0, 16) : ""}
                onChange={(e) => handleInput(e)}
                name="endDate"
                
                required
                className={`w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium ${ eventData.endDate && eventData.endDate < eventData.startDate 
    ? 'border-red-500' 
    : 'border-gray-100'
    }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={eventData.location}
                 onChange={(e) => handleInput(e)}
                name="location"
                placeholder="6 kilo,Mandela Hall"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Capacity
              </label>
              <input
                type="number"
                value={eventData.capacity}
                 onChange={(e) => handleInput(e)}
                name="capacity"
                placeholder="5"
                min={10}
                max={500}
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
          </div>

          
          
        </div>

        <div className="bg-gray-50 px-8 py-6 flex  gap-4 md:flex-row items-center justify-between">
           <div>
               <button
              onClick={()=>navigate('/organizer')}
              type="button"
              className="px-6 py-3 cursor-pointer text-sm font-bold text-gray-600 hover:text-red-900"
            >
              Cancel
            </button>
           </div>
          <div className="flex gap-4">
            
            <button
              type="submit"
               disabled={isPending}
              className="px-8  cursor-pointer hover:-translate-y-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
               {isPending ? <Loading size="sm" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditEvent