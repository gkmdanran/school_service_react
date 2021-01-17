import React, { memo ,useState,useEffect,useCallback,useRef} from 'react'
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs'
import { Breadcrumb,Space,Button,Table,Input,message,Popconfirm,Modal,Form,Select } from 'antd';
import { EditOutlined,DeleteOutlined,PlusOutlined } from '@ant-design/icons';
import style from './systemuser.module.css'
import {list,delUser,addSysUser,detail,editUser} from '@/services/systemUser'
import {getCities} from '@/services/City.js'
import checkLogin from '../../components/PrivateRoute'
const { Option } = Select;
var id=''
const cmp=memo(function SystemUser() {
    
    const [searchParams, setSearchParams] = useState({page:1,limit:5,username:''})
    const [SystemUserList, setSystemUserList] = useState([])
    const [CityList, setCityList] = useState([])
    const [total, setTotal] = useState(0)
    const [title, setTitle] = useState('新增区域管理员')
    const [visible, setVisible] = useState(false)
    const formRef=useRef()
    const getList=useCallback(
        async () => {
            const res=await list(searchParams)
            if(res.code===200){
                setTotal(res.data.total)
                setSystemUserList(res.data.list)
            }
        },
        [searchParams]
    )
    useEffect(() => {
        getList()
    }, [searchParams,getList])
    const columns=[
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '手机',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '管辖区域',
            dataIndex: 'city_name',
            key: 'manageCityName',
        },
        {
            title: '角色',
            dataIndex: 'role',
            render: (text, record) => (
                <span>
                    {text===0?'超级管理员':'区域管理员'}
                </span>
                   
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (text, record) => (
                <span>
                    {dayjs(text).format("YYYY-MM-DD HH:mm:ss")}
                </span>
                   
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<EditOutlined />}  onClick={()=>edit(record)}/>
                    <Popconfirm placement="top" title={'确认删除该用户吗？'} onConfirm={e=>deleteUser(record)} okText="确认" cancelText="取消">
                        <Button type="danger" shape="circle"   icon={<DeleteOutlined />}  />
                    </Popconfirm>
                    
                </Space>
            ),
          },
    ]
    const onSearch = value => {
        
        setSearchParams({...searchParams,username:value,page:1,limit:5})
    }
    function changePage(page){
        const {current,pageSize}=page
        setSearchParams({...searchParams,page:current,limit:pageSize})
    }
    async function deleteUser(record){
        const res=await delUser({id:record.id,username:record.username})
        if(res.code===200){
            message.success('删除成功',0.8)
            setSearchParams({...searchParams,page:1,limit:5})
        }
    }
    function showDialog(){
        setVisible(true)
        setTitle('新增区域管理员')
        getCityList('')
        if(formRef.current)
        formRef.current.resetFields()
    }
    async function addUser(){
        try {
            var values =await formRef.current.validateFields();
            console.log(values)
            if(title==='新增区域管理员'){
                const res=await addSysUser({...values})
                if(res.code===200){
                    message.success('新增成功',0.8)
                    getList()
                    setVisible(false)
                }
                    
               
            }else{
                const res2=await editUser({...values,id})
                if(res2.code===200){
                     message.success('修改成功',0.8)
                    getList()
                    setVisible(false)
                }
            }
           
          } catch (error) {
            console.log(error)
          }
    }
    async function edit(record){
        if(record.username==='admin')return message.warning('admin不能随意修改',0.9)
        const res=await detail(record.username)
        
        setTitle('编辑区域管理员')
        setVisible(true)
        getCityList('')
        id=record.id
        console.log(id)
        if(formRef.current)
            formRef.current.setFieldsValue(res.data[0])
    }
    
    
    async function getCityList(name){
        if(CityList.length===0){
            const res=await getCities(name)
            console.log(res.data.list)
            setCityList(res.data.list)
        }
        
    }
    return (
        <div >
            <Breadcrumb separator=">">
                <Breadcrumb.Item >
                    <NavLink to="/homepage">首页</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >系统人员管理</Breadcrumb.Item>
            </Breadcrumb>
            <div className={style.search_area}>
                <Input.Search allowClear placeholder="请输入用户名" onSearch={onSearch} enterButton style={{width:'400px',marginRight:'10px'}}/>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>showDialog()}>新增</Button>
            </div>
            <Table dataSource={SystemUserList} columns={columns} rowKey="id" 
             onChange={(page)=>{changePage(page)}}
            pagination={{
                total:total,
                showSizeChanger: true, 
                showQuickJumper: true,
                pageSize:searchParams.limit,
                current:searchParams.page,
                pageSizeOptions:[1,5,10],
                showTotal:((total) => {
                    return `共 ${total} 条`;
                  })}}/>;
            <div className="dialog">
                <Modal title={title} visible={visible}  onCancel={()=>setVisible(false)}  onOk={addUser} okText='确认' cancelText='取消'>
                <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="用户名"
                    name="username"
                    validateTrigger="onBlur"
                   
                    rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input  disabled={title==='编辑区域管理员'}/>
                    </Form.Item>
                    {
                        title==='新增区域管理员'&&(<Form.Item
                        label="密码"
                        name="password"
                        validateTrigger="onBlur"
                        rules={[{ required: true, message: '请输入密码' }]}>
                            <Input />
                        </Form.Item>)
                    }
                    <Form.Item
                    label="手机号"
                    name="phone"
                    validateTrigger="onBlur"
                    rules={[
                        { required: true, message: '请输入手机号' },
                        {pattern:/^1[3|4|5|8][0-9]\d{4,8}$/,message: '请输入合法手机号'}
                            ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="城市"
                    name="manage_city_id"
                    rules={[{ required: true, message: '请选择城市' }]}>
                       <Select
                            showSearch
                            placeholder="选择城市"
                            
                            filterOption={(input, option) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {
                                CityList.map(item=><Option value={item.class_id} key={item.class_id}>{item.class_name}</Option>)
                            }
                                
                        </Select>
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        </div>
    )
})
export default checkLogin(cmp)
