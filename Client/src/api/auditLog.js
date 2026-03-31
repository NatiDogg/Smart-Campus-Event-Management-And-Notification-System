import api from './axios'
//https://jsonplaceholder.typicode.com/posts?_page=1&_limit=2
export const getAuditLog = async({pageParam})=>{
    const response = await api.get(`/api/audit/get?_page=${pageParam}&_limit=5`)
    return response.data
}