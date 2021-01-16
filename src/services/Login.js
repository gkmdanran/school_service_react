import {request} from './request.js'
export const login=(data)=>request({
    url:'login',
    data,
    method:'post'
})