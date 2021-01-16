import {request} from './request.js'
export const list=(searchParams)=>request({
        url:'article/list',
        params:{...searchParams} 
})
export const delArticle=(data)=>request({
        url:'article/delete',
        data,
        method:'post'
})

export const hideArticle=(data)=>request({
        url:'article/hide',
        data,
        method:'post'
})