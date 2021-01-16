import {request} from './request.js'
export const list=(searchParams)=>request({
        url:'lose/list',
        params:{...searchParams} 
})
export const changeStatus=(data)=>request({
        url:'lose/change',
        data,
        method:'post'
})