
import {CHANGE_USER_INFO} from './constant'
const defaultState=({
    userInfo:{}
})
export default function reducer(state=defaultState,action){
    switch(action.type){
        case CHANGE_USER_INFO:
            return {...state,userInfo:action.userInfo}
        
        default:
            return state;
    }
}