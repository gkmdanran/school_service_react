import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Input,Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {login} from '../../services/Login'
import {changeUserInfoAction} from '../../store/userStore/action'
import style from './login.module.css'
export default memo(function Login(props) {
    const dispatch=useDispatch()
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        if(!values.username||!values.password)
            return message.warning('请输入用户名或密码', 0.9)
        const res=await login(values)
        if(res.code===200){
            message.success('登陆成功', 0.8)
            sessionStorage.setItem('school_token',res.data.token)
            dispatch(changeUserInfoAction(res.data))
            props.history.push("/homepage")
        }
    };

    return (
        <div className={style.login_style}>
            <div className={style.contents}>
                <div className={style.left}>
                    <div className={style.title}>校园服务后台管理系统</div>
                    <div className={style.eng}>
                        SCHOOL SERVICE BACKGROUNG MANAGEMENT SYSTEM
                    </div>
                </div>
                <div className={style.right}>
                    <div className={style.login_infos}>
                        <div className={style.welcome}>
                            欢迎登陆
                        </div>
                        <div className={style.names}>
                            校园服务后台管理系统
                        </div>
                        <Form name="normal_login"  onFinish={onFinish} className={style.myform}>
                            <Form.Item name="username">
                                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                            </Form.Item>
                            <Form.Item name="password">
                                <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className={style.footbutton}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                        
                    </div>
                    <div className={style.forget} >忘记密码?寻求帮助</div>
                </div>
            </div>
            
        </div>
    )
})
