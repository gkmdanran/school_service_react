import React, { memo } from 'react'
import checkLogin from '../../components/PrivateRoute'
export default checkLogin(memo(function Welcome() {
    return (
        <div>
            欢迎使用！
        </div>
    )
}))
