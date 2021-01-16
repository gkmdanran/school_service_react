import React, { memo ,useEffect,useState,useRef} from 'react'
import { renderRoutes } from 'react-router-config';
import { useSelector, shallowEqual } from 'react-redux'
import { Layout, Menu, Dropdown,Modal,Form,Input,message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import style from './homepage.module.css'
import menuList from '@/config/sider.js'
import { useDispatch } from 'react-redux'
import {changeUserInfoAction} from '../../store/userStore/action'
import {editPassword} from '@/services/systemUser'
const { Header, Sider } = Layout;
export default memo(function HomePage(props) {
    const dispatch=useDispatch()
    const { route } = props;
    const [visible, setVisible] = useState(false)
    const formRef=useRef()
    const [path, setPath] = useState(props.location.pathname)
    const {userInfo} = useSelector(state => ({
        userInfo:state.UserReducer.userInfo
    }),shallowEqual)
    useEffect(() => {
        console.log(props.location.pathname)
        var curpath=props.location.pathname
        if(curpath==='/homepage/addarticle')
            curpath='/homepage/article'
        setPath(curpath)
    }, [props.location.pathname])
    const menu = (
        <Menu>
          <Menu.Item onClick={()=>LoginOut()}>
            退出登录
          </Menu.Item>
          <Menu.Item onClick={()=>showDialog()}>
            修改密码
          </Menu.Item>
        </Menu>
    );
    function LoginOut(){
        props.history.push("/")
        sessionStorage.removeItem("school_token")
        dispatch(changeUserInfoAction({}))
    }
    async function changePassword(){
        try {
            var values =await formRef.current.validateFields();
            console.log(values)
            const res=await editPassword({...values,username:userInfo.username})
                if(res.code===200){
                    setVisible(false)
                    message.success('修改成功，请重新登录',0.8)
                    LoginOut()
                }
          } catch (error) {
            console.log(error)
          }
    }
    function showDialog(){
        setVisible(true)
        if(formRef.current)
        formRef.current.resetFields()
    }
    return (
        <Layout className={style.homepage_style}>
            <Header className={style.header} style={{color:'#fff'}}>
                <span className={style.title}>校园生活后台管理系统</span>
                <div className={style.user}>
                <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href="/a">
                    您好,{userInfo.username||''}<DownOutlined  style={{marginLeft:'5px'}}/>
                 </a>
                </Dropdown>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    selectedKeys={[path]}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%', borderRight: 0 }}
                    >
                        {
                            menuList.map(menu=><Menu.Item key={menu.path} onClick={()=>{props.history.push(menu.path)}} icon={menu.icon}>{menu.name}</Menu.Item>)
                        }
                </Menu>
                </Sider>
                <Layout style={{ padding: '20px',overflow:'auto' }}>
                   {renderRoutes(route.routes)}
                   <div className="dialog">
                        <Modal title="修改密码" visible={visible}  onCancel={()=>setVisible(false)}  onOk={changePassword} okText='确认' cancelText='取消'>
                        <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                            <Form.Item
                            label="旧密码"
                            name="oldpassword"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: '请输入旧密码' }]}>
                                <Input  type="password"/>
                            </Form.Item>
                            <Form.Item
                            label="新密码"
                            name="newpassword"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: '请输入新密码' }]}>
                                <Input  type="password"/>
                            </Form.Item>
                            <Form.Item
                            label="确认密码"
                            name="checkpassword"
                            validateTrigger="onBlur"
                            rules={[
                                { required: true, message: '请确认新密码' },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue('newpassword') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject('密码请输入一致');
                                  },
                                }),
                              ]}
                            >
                                <Input  type="password"/>
                            </Form.Item>
                        </Form>
                        </Modal>
                    </div>
                </Layout>
            </Layout>
        </Layout>
    )
})
