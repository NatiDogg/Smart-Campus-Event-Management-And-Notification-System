import React,{useState} from 'react'
import {toast} from 'react-hot-toast'
import { useCreateEvent } from '../../hooks/useEvent';
import Loading from '../../components/Loading'
import { useGetCategories } from '../../hooks/useCategory';
const CreateEvents = () => {
     
     const [image, setImage] = useState(null);
     const [imageFile, setImageFile] = useState(null);
      const [eventData, setEventData] = useState({
         title: '',
         description: '',
         location: '',
         category: '',
         capacity: 0,
         startDate: '',
         endDate: ''

      })

      const {data,error,mutate,isPending} = useCreateEvent()
      const {data:categories,isLoading,error:isCategoryError} = useGetCategories()

     const handleFileChange = (e)=>{
        const file = e.target.files[0]

        if(file){
           setImageFile(file)
          const imageUrl = URL.createObjectURL(file);
           setImage(imageUrl);
        }
     }

     const handleInput = (e)=>{
       const {name,value} = e.target
        setEventData(prevData=>(
          {
            ...prevData,
            [name]: value
          }
        ))
     }

     const onSubmitHandler = (e)=>{
         e.preventDefault()
        const formData = new FormData()

       const isAllFilled = Object.values(eventData).every(value=> value !== '' && value !== 0) && imageFile;
 
        if(!isAllFilled){
            return toast.error("Please fill all required fields");
        }

        

        Object.keys(eventData).forEach((key)=>{
           formData.append(key,eventData[key])
        })
        formData.append("image",imageFile)

        mutate(formData, {
          onSuccess:()=>{
             setEventData({
         title: '',
         description: '',
         location: '',
         category: '',
         capacity: 0,
         startDate: '',
         endDate: ''

      })
       setImageFile(null)
       setImage(null)
          }
        })


        
     }



  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Create Event
        </h1>
        <p className="text-gray-500 text-lg">
          Bring your community together. Fill in the details to list your event.
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
                onChange={(e) => handleInput(e)}
                value={eventData.title}
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
                onChange={(e) => handleInput(e)}
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
              onChange={(e) => handleInput(e)}
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
                type="datetime-local"
                onChange={(e) => handleInput(e)}
                value={eventData.startDate}
                name="startDate"
                placeholder="Oct 24, 2023"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                End Date
              </label>
              <input
                type="datetime-local"
                onChange={(e) => handleInput(e)}
                value={eventData.endDate}
                name="endDate"
                min={eventData.startDate}
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                onChange={(e) => handleInput(e)}
                value={eventData.location}
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
                onChange={(e) => handleInput(e)}
                value={eventData.capacity}
                name="capacity"
                placeholder="5"
                min={10}
                max={500}
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Banner Upload  */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Event Banner
            </span>

            <label className="w-full h-48 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-blue-300 transition-all cursor-pointer group relative">
              {/* The actual hidden input */}
              <input
                onChange={handleFileChange}
                accept="image/*"
                type="file"
                className="hidden"
              />
              {image ? (
                /* --- THIS IS THE MISSING PIECE --- */
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt="Event Banner"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Overlay to allow re-uploading */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold bg-blue-600 px-4 py-2 rounded-xl">
                      Change Image
                    </p>
                  </div>
                </div>
              ) : (
                /* Your existing Placeholder UI */
                <div className="flex flex-col items-center p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <p className="text-sm font-bold text-gray-500 text-center">
                    Drag and drop banner image or{" "}
                    <span className="text-blue-600 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                    Recommended: 1600x900px (JPG, PNG)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex flex-col gap-4 md:flex-row items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 max-w-sm">
            Note: New events will be sent to the campus admin for approval
            before becoming public.
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-6 py-3 cursor-pointer text-sm font-bold text-gray-600 hover:text-red-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 cursor-pointer hover:-translate-y-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              {isPending ? <Loading size="sm" /> : "Launch Event Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEvents