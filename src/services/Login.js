import {request} from './request.js'

export const login=(data)=>request({
    url:'login',
    data,
    method:'post'
})
export const check=(data)=>request({
    url:'checklogin',
    data,
    method:'post'
})

