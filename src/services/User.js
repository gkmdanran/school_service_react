import {request} from './request.js'
export const list=(searchParams)=>request({
        url:'client/list',
        params:{...searchParams} 
})
export const changeActive=(data)=>request({
        url:'client/change',
        data,
        method:'post'
})