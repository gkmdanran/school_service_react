import React, { memo,useState,useCallback,useEffect,useRef} from 'react'
import { NavLink } from 'react-router-dom';
import { Breadcrumb,Space,Button,Table,Input,Row, Col,Form,message,Popconfirm,Image} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {list,changeActive} from '@/services/User.js'
import dayjs from 'dayjs'

import style from './user.module.css'
import checkLogin from '../../components/PrivateRoute'
export default checkLogin(memo(function School() {
    const [searchParams, setSearchParams] = useState({page:1,limit:5,username:'',nickname:'',realname:''})
    const [CilentList, setCilentList] = useState([])
    const [total, setTotal] = useState(0)
    const formRef=useRef()
    const columns=[
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width:130,
           
        },
        {
            title: '头像',
            dataIndex: 'photo',
            key: 'photo',
            width:120,
            render: (text, record) => (
                <div className={style.img}>
                    <Image src={record.photo}   width={80} alt=""/>
                </div>
                
            ),
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            width:130
            
        },
        {
            title: '城市',
            dataIndex: 'city_name',
            key: 'city_name',
            width:120
        },
        {
            title: '学校',
            dataIndex: 'school_name',
            key: 'school_name',
            ellipsis: true,
        },
        {
            title: '学院',
            dataIndex: 'college',
            key: 'college',
            ellipsis: true,
        },
        {
            title: '班级',
            dataIndex: 'clazz',
            key: 'clazz',
            ellipsis: true,
        },
        {
            title: '学号',
            dataIndex: 'studentnum',
            key: 'studentnum',
            ellipsis: true,
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            width:60,
            render: (text, record) => (
                <span>
                    {record.sex===1?'男':'女'}
                </span>
                   
            ),
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            width:120
        },
        {
            title: '姓名',
            dataIndex: 'realname',
            key: 'realname',
            ellipsis: true,
        },
        {
            title: '身份证',
            dataIndex: 'cardnum',
            key: 'cardnum',
            width:165
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            key: 'is_active',
            width:60,
            render: (text, record) => (
                <span>
                    {record.is_active===1?'激活':'封禁'}
                </span>
            ),
        },
        {
            title: '注册日期',
            dataIndex: 'createAt',
            key: 'createAt',
            width:110,
            render: (text, record) => (
                <span>
                    {dayjs(text).format("YYYY-MM-DD")}
                </span>
                   
            ),
           
        },
        {
            title: '操作',
            key: 'action',
            width:100,
            fixed:'right',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm placement="top" title={record.is_active===0?'确认解封该用户吗':'确认封禁该用户吗'} onConfirm={()=>changeType(record)} okText="确认" cancelText="取消">
                    {
                        record.is_active===0?<Button type="primary" >解封</Button>:<Button type="danger"  >封号</Button>
                    }
                    </Popconfirm>
                </Space>
            ),
          }

    ]
    const getList=useCallback(
        async () => {
            const res=await list(searchParams)
            if(res.code===200){
                setTotal(res.data.total)
                setCilentList(res.data.list)
            }
        },
        [searchParams]
    )
    useEffect(() => {
        getList()
    }, [searchParams,getList])
    function changePage(page){
        const {current,pageSize}=page
        setSearchParams({...searchParams,page:current,limit:pageSize})
    }
    async function searchUser(){
        var values =await formRef.current.validateFields();
        setSearchParams({...searchParams,page:1,limit:5,...values})
    }
    async function changeType(record){
        var type=record.is_active===1?0:1
        const res=await changeActive({id:record.id,type})
        if(res.code===200){
            message.success('操作成功',0.8)
            getList()
            
        }
    }
    return (
        <div>
            <Breadcrumb separator=">">
                <Breadcrumb.Item >
                    <NavLink to="/homepage">首页</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >用户管理</Breadcrumb.Item>
            </Breadcrumb>
            <div className={style.search_area}>
                <Form ref={formRef} initialValues={{username:'',realname:'',nickname:''}}>
                    <Row>
                        <Col span={5} style={{display:"flex"}}>
                            <div className={style.titletxt}>用户名：</div>
                            <Form.Item name="username">
                                <Input placeholder="输入用户名" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={5} style={{display:"flex"}}>
                            <div className={style.titletxt}>昵称：</div>
                            <Form.Item name="nickname">
                                <Input placeholder="输入昵称" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={5} style={{display:"flex"}} >
                            <div className={style.titletxt}>姓名：</div>
                            <Form.Item name="realname">
                                <Input placeholder="输入姓名" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={5}  offset={1}>
                            <Button type="primary" icon={<SearchOutlined />} onClick={()=>searchUser()}>搜索</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Table dataSource={CilentList} columns={columns} rowKey="id" 
                scroll={{ x: 1800 }}
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
            })}}/>
            
        </div>
    )
}))
