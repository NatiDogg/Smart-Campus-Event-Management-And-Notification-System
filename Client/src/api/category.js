import api from './axios'

export const createCategory = async(categoryData)=>{
     const response = await api.post("/api/category/create", categoryData);
     return response.data
}

export const getCategories = async()=>{
    const response = await api.get('/api/category/get');
    return response.data.categories
    
}
export const deleteCategory = async(id)=>{
   const response = await api.delete(`/api/category/delete/${id}`)
   return response.data
}