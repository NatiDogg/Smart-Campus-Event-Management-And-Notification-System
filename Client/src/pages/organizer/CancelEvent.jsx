import React,{useContext} from 'react'
import { AppContext } from '../../context/ContextProvider'
import { Icons } from '../../components/Icons'
import { useCancelEvent } from '../../hooks/useEvent'
import Loading from '../../components/Loading'
const CancelEvent = () => {

    const {activeModal, setActiveModal} = useContext(AppContext)
    const {mutate,isPending} = useCancelEvent()
   


     const cancelEventHandler = (eventId)=>{
        console.log(eventId)
         if(eventId){
            mutate(eventId,{
                onSuccess:()=>{
                    setActiveModal({name: null, data: null})
                }
            })
         }
     }


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
         
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" 
            onClick={()=>setActiveModal({name: null, data:null})} 
          />
    
          
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-gray-100 p-10 animate-in fade-in zoom-in duration-200">
            
           
            <div className="w-20 h-20 bg-red-50 rounded-4xl flex items-center justify-center mb-8 mx-auto">
              <Icons.Delete className="w-10 h-10 text-red-500" />
            </div>
    
            {/* Text Area */}
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-gray-900 mb-3">Are you sure?</h3>
              <p className="text-gray-500 leading-relaxed">
                You are about to cancel <span className="font-bold text-gray-900">this Event</span>. 
                This action is permanent and cannot be undone.
              </p>
            </div>
    
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                 disabled={isPending}
                 onClick={()=>cancelEventHandler(activeModal.data)}
                className="w-full cursor-pointer py-5 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-bold text-sm capitalize tracking-widest transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
              >
                 {isPending ? (<Loading size='sm' color='white' />) : (' Cancel Event ')}
              </button>
              
              <button
                 onClick={()=>setActiveModal({name: null, data: null})}
                className="w-full py-5 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-3xl font-bold text-sm hover:text-red-600 capitalize tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
  )
}

export default CancelEvent