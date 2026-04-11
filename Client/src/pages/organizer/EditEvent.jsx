import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrganizerDashboard } from '../../hooks/useOrganizer'
import { useGetCategories } from '../../hooks/useCategory'

const EditEvent = () => {

   const {id} = useParams()
   const {data , isLoading:isDashboardLoading} = useGetOrganizerDashboard()
   const {data:categories,isLoading,error:isCategoryError} = useGetCategories()
   const [eventData, setEventData] = useState({
     
   });

   useEffect(()=>{
      
   },[id,data])
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Edit Event
        </h1>
        <p className="text-gray-500 text-sm">
          
          Update your event details below.
        </p>
      </div>

      <form
        
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
                
               
                name="endDate"
                
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
              type="button"
              className="px-6 py-3 cursor-pointer text-sm font-bold text-gray-600 hover:text-red-900"
            >
              Cancel
            </button>
           </div>
          <div className="flex gap-4">
            
            <button
              type="submit"
               
              className="px-8  cursor-pointer hover:-translate-y-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditEvent