import React from 'react'
import { Redirect } from 'react-router-dom'


const checkLogin=(ComposeComponent)=>{
    
    return class extends React.Component{
        render(){
            return (
                <div>
                    {
                       (sessionStorage.getItem('school_token')||'')!==''?<ComposeComponent {...this.props}/>:<Redirect to="/"></Redirect>
                    }
                </div>
            )
        }
    }
   
}
export default checkLogin
