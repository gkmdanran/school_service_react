import {request} from './request.js'
export const list=(searchParams)=>request({
        url:'school/list',
        params:{...searchParams} 
})
export const delSchool=(data)=>request({
    url:'school/delete',
    data,
    method:'post'
})
export const addSchools=(data)=>request({
    url:'school/add',
    data,
    method:'post'
})
export const detail=(name,number)=>request({
    url:'school/detail',
    params:{name,number} 
})
export const editSchool=(data)=>request({
    url:'school/edit',
    data,
    method:'post'
})