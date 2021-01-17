import React, { memo } from 'react'
import style from "./loading.module.css"
export default memo(function index() {
    return (
        <div className={style.bgc}>
            <div className={style.loading}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    )
})
