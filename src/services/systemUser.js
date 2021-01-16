import {request} from './request.js'
export const list=(searchParams)=>request({
        url:'systemuser/list',
        params:{...searchParams} 
})
export const delUser=(data)=>request({
    url:'systemuser/delete',
    data,
    method:'post'
})
export const addSysUser=(data)=>request({
    url:'systemuser/add',
    data,
    method:'post'
})
export const detail=(username)=>request({
    url:'systemuser/detail',
    params:{username} 
})
export const editUser=(data)=>request({
    url:'systemuser/edit',
    data,
    method:'post'
})
export const editPassword=(data)=>request({
    url:'systemuser/password',
    data,
    method:'post'
})