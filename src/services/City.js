import {request} from './request.js'
export const getCities=(name)=>request({
        url:'city',
        params:{name} 
})
export const getProvinces=()=>request({
        url:'province',
       
})
export const getCityByPid=(pid)=>request({
        url:'citypid',
        params:{pid} 
})
