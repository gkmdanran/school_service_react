import axios from 'axios';
import { BASE_URL, TIMEOUT } from "./config";
import { message} from 'antd';
export  function request(config){
    const instance=axios.create({
        baseURL: BASE_URL,
        timeout: TIMEOUT
    })
    instance.interceptors.request.use(config => {
        config.headers.authorization='Bearer '+(sessionStorage.getItem('school_token')||'')
        return config
    },err => {
        console.log(err)
    })
    instance.interceptors.response.use(res => {
        if(res.data.code!==200)
             return message.warning(res.data.msg, 0.9)
        return res.data
    }, err => {
        console.log(err)
    })
    return instance(config)
}