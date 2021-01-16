import {request} from './request.js'
export const list=(searchParams)=>request({
        url:'shop/list',
        params:{...searchParams} 
})
export const changeStatus=(data)=>request({
        url:'shop/change',
        data,
        method:'post'
})