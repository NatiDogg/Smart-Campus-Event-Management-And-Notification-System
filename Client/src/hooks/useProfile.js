import {useMutation} from '@tanstack/react-query'
import {updateProfile} from '../api/user.js'
import {toast} from 'react-hot-toast'
export const useUpdateProfile = ()=>{
    return useMutation({
      mutationFn: updateProfile,
      onSuccess:(data)=>{
          toast.success(data.message)
      },
      onError: (error)=>{
         const errorMessage = error.response?.data.message || 'Failed to update Profile'
         toast.error(errorMessage)
      }

    })
}