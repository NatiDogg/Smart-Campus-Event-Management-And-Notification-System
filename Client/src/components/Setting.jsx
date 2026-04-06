import React, { useState,useContext, useEffect } from 'react';
import {AppContext} from '../context/ContextProvider.jsx'
import { useUpdateProfile } from '../hooks/useProfile.js';
import Loading from '../components/Loading.jsx'
import { useGetCategories } from '../hooks/useCategory.js';
import { useGetSubscribedCategories,useSubscribeCategory } from '../hooks/useStudent.js';



const Setting = () => {

     const {user,setUser} = useContext(AppContext)
     const {mutate,isPending} = useUpdateProfile()
     const {data:categories ,isLoading,error,isFetching} = useGetCategories()
     const {mutate: subscribeCategory, isPending: isSubscribingCategory} = useSubscribeCategory()
     const {data: userSubscribedCategories,isLoading:isSavedCategoriesLoading} = useGetSubscribedCategories()


  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState( '********');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [organizationName, setOrganizationName] = useState(user?.organizationName || '');
   const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

   const [subscribedCategories, setSubscribedCategories] = useState([]);
   
   
    const handleSubscription = (categoryId)=>{
       
        if(subscribedCategories?.includes(categoryId)){
           
           setSubscribedCategories(prevSub => prevSub.filter(id => id !== categoryId));
        }
        else{
          setSubscribedCategories(prevSub=>([
            ...prevSub,
            categoryId
          ]))
        }
       

    }

    
    const saveSubscription = ()=>{
       subscribeCategory({ categories: subscribedCategories });
    }

    useEffect(()=>{
      const preferred = userSubscribedCategories?.preferredCategories;
       if(user.role.toLowerCase() === 'student' && Array.isArray(preferred)){
         
         const categoryIds = preferred.map(cat => (typeof cat === 'object' ? cat._id : cat));
         
        setSubscribedCategories(categoryIds);
       }
    },[userSubscribedCategories,user.role])

      
 
   
    const ROLE_FIELDS = {
      student: [
        { label: 'Major', value: department, setter: setDepartment },
        { label: 'Student ID', value: studentId, setter: setStudentId },
      ],
      organizer: [
        { label: 'Organization Name', value: organizationName, setter: setOrganizationName },
        { label: 'Phone Number', value: phoneNumber, setter: setPhoneNumber }
      ],
      admin: [
       { label: 'Phone Number', value: phoneNumber, setter: setPhoneNumber }
      ]
};

    
   

     const onSubmitHandler = ()=>{
        
        const updateData = {
          fullName: fullName,
          email: email,
          password: password
         }
         if (user.role === "student") {
           updateData.studentId = studentId;
           updateData.department = department;
         } else if (user.role === "organizer") {
           updateData.organizationName = organizationName;
           updateData.phoneNumber = phoneNumber;
         } else if (user.role === "admin") {
           updateData.phoneNumber = phoneNumber;
         }
 
          if (password === '********' || !password) {
              delete updateData.password;
          }
          if(user.provider?.toLowerCase() === 'google'){
             delete updateData.email
             delete updateData.password
          }
          
         
         mutate(updateData,{
           onSuccess:(data)=>{
             setUser(data.updatedUser)

           }
         })
     }

  
    if (!user) return <Loading size='md' />;
  

  return (
    <div className="max-w-4xl mx-auto space-y-12 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="relative">
            <img
              src={
                user.profile ||
                `https://ui-avatars.com/api/?name=kebede&background=2563EB&color=fff&size=128`
              }
              className="w-30 h-30 rounded-3xl md:rounded-full object-cover shadow-2xl border-4 border-white"
              alt="ProfileLarge"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {user.fullName}
            </h1>
            <p className="text-sm md:text-lg text-gray-400 font-medium">
              {user.email}
            </p>
            <div className="flex gap-3 pt-2">
              <span className="px-4 py-1.5 grid place-content-center bg-blue-100 text-blue-700 text-[8px] md:text-[9px] font-black rounded-full uppercase ">
                {user.role}
              </span>
              <span className="px-4 text-center py-1.5 bg-green-100 text-green-700 text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest">
                Verified Account
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          user.role.toLowerCase() !== "student"
            ? "grid grid-cols-1 "
            : "grid grid-cols-1 md:grid-cols-2 gap-12"
        } `}
      >
        {/* Personal Info */}
        <div className="bg-white  rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black  text-gray-900 tracking-tight">
              Account Details
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full text-sm px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              />
            </div>
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled={user.provider?.toLowerCase() === "google"}
                onChange={(e) => setEmail(e.target.value)}
                className={`${
                  user.provider.toLowerCase() === "google" &&
                  "cursor-not-allowed bg-gray-100 "
                } w-full text-sm px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              />
            </div>
            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                disabled={user.provider?.toLowerCase() === "google"}
                onChange={(e) => setPassword(e.target.value)}
                className={`${
                  user.provider.toLowerCase() === "google" &&
                  "cursor-not-allowed bg-gray-100 "
                } w-full text-sm px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLE_FIELDS[user.role]?.map((field, index) => (
                <div key={index} className="space-y-2 flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full text-sm px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-700"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={isPending}
            onClick={onSubmitHandler}
            className="w-full hover:-translate-y-1.5 cursor-pointer py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-100 active:scale-[0.98]"
          >
            {isPending ? <Loading size="sm" /> : "Update Profile"}
          </button>
        </div>

        {/* Personalization */}
        {user.role.toLowerCase() === "student" && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-10">
            <div className="flex justify-center items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122l9.37-9.37a9.003 9.003 0 11-12.728 0l.33.33.35.34 9.37 9.37a9.003 9.003 0 11-12.728 0l.33.33L9.53 16.122z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Preferences
              </h2>
            </div>
            <div className="space-y-4 pt-6 border-t flex flex-col gap-2 border-gray-100">
              <label className="text-[14px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Subscribed Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {(isLoading || isFetching || isSavedCategoriesLoading ) && <div className='p-3 w-full flex justify-center items-center'><Loading size='sm' color='black' /></div>}
                { categories && categories?.map((cat,index) => (
                  <button
                    key={cat.name}
                     onClick={()=>handleSubscription(cat._id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black border transition-all ${
                    subscribedCategories?.includes(cat._id) 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-50' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
                  }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
               <button
                disabled={isSubscribingCategory}
                onClick={saveSubscription}
            className="w-full hover:-translate-y-1.5 cursor-pointer py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-100 active:scale-[0.98]"
          >
            {isSubscribingCategory ? 
                <div className='flex flex-row w-full items-center justify-center gap-1'>
                   <Loading size='sm' />
                   <span className='text-xs'>saving</span>
                </div>
                :
                ('Save')
            }
          </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;


{/*
  ${preferences.aiRecommendationsEnabled ? 'bg-blue-600' : 'bg-gray-200'}
   ${preferences.aiRecommendationsEnabled ? 'right-1' : 'left-1'}
  */}











