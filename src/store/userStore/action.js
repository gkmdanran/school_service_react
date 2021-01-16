import {CHANGE_USER_INFO} from './constant'
export const changeUserInfoAction=(userInfo)=>({
    type:CHANGE_USER_INFO,
    userInfo,
})
