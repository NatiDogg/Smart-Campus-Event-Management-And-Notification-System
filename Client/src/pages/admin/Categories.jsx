import React,{useState} from 'react'
import { useCreateCategory, useDeleteCategory, useGetCategories } from '../../hooks/useCategory'
import Loading from '../../components/Loading'
import {Icons} from '../../components/Icons'
import {toast} from 'react-hot-toast'
const Categories = () => {
     const [categoryData, setcategoryData] = useState({
        name: '',
        description: ''
     })
      const {data,mutate,isPending} = useCreateCategory()
      const {data : categories,isLoading,isFetching,error,refetch} = useGetCategories()
      const { mutate: deleteMutate, isPending: isDeleting } = useDeleteCategory();


      const handleInput = (e)=>{
        const {name,value} = e.target
        setcategoryData((prevData)=>({
           ...prevData,
           [name]: value
        }))
      }
      const onSubmitHandler = (e)=>{
          e.preventDefault()
          const isAllfilled = Object.values(categoryData).every(value=> value !== '');
           if(!isAllfilled){
            return toast.error("Please Fill All Required Fields")
           }

           mutate(categoryData,{
              onSuccess:()=>{
                 setcategoryData({
                  name: '',
                  description: ''
                 })
              }
           })


      }

      

  return (
    <div className="space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className='flex flex-col gap-2'>
          <h1 className=" text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Event Categories
          </h1>
          <p className="text-gray-500 ">
            Manage the categories available for event organizers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6 flex flex-col gap-2">
            <h3 className=" text-lg md:text-xl font-black text-gray-900 uppercase tracking-widest">
              Add Category
            </h3>
            <div className="space-y-2 flex flex-col gap-2">
              <label htmlFor='name' className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Category Name
              </label>
              <input
               id='name'
               value={categoryData.name}
               onChange={(e)=>handleInput(e)} 
                 name='name'
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Workshop"
                required
              />
            </div>
            <div className="space-y-2 flex flex-col gap-2">
              <label htmlFor='description' className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Category Description
              </label>
               <textarea onChange={(e)=>handleInput(e)} value={categoryData.description}  className="w-full px-6 resize-none py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="write category description here.."
                required name="description" id="description"></textarea>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 cursor-pointer bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isPending ? (<><Loading />adding</>) : (<><Icons.Plus /> Add Category</>)}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-widest">
                Existing Categories
              </h3>
            </div>
            <div className="divide-y p-2 divide-gray-50">
              {isLoading  && !error && (
                <div className="py-12">
                  <Loading size="md" color="black" />
                </div>
              )}
              {error && (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      Failed to load categories
                    </h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      {error?.response?.data?.message ||
                        "There was a problem connecting to the server. Please try again."}
                    </p>
                  </div>

                  <button
                    onClick={() => refetch()}
                    className="inline-flex cursor-pointer items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                    {isFetching ? "Retrying..." : "Try Again"}
                  </button>
                </div>
              )}
              {categories &&
                categories.map((category) => (
                  <div
                    key={category._id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Icons.Explore />
                      </div>
                      <span className="font-bold  text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <button disabled={isDeleting} onClick={()=> deleteMutate(category._id)}
                      className="p-2 cursor-pointer text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Category"
                    >
                      {isDeleting ? <Loading size='sm'/> : <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>}
                    </button>
                  </div>
                ))}
              {categories && categories?.length === 0 && (
                <div className="p-12 text-center text-gray-500 italic">
                  No categories created yet.
                </div>
              )} 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories