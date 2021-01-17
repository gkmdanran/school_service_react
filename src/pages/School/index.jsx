import React, { memo,useState,useCallback,useEffect,useRef} from 'react'
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs'

import { Breadcrumb,Space,Button,Table,Input,message,Popconfirm,Modal,Form, Select} from 'antd';
import { EditOutlined,DeleteOutlined,PlusOutlined } from '@ant-design/icons';
import {list,delSchool,addSchools,detail,editSchool} from '@/services/school.js'
import {getProvinces,getCityByPid,} from '@/services/City.js'
import checkLogin from '../../components/PrivateRoute'
import style from './school.module.css'
var id=''
const { Option } = Select;
export default checkLogin(memo(function School() {
    const [searchParams, setSearchParams] = useState({page:1,limit:5,name:''})
    const [SchoolList, setSchoolList] = useState([])
    const [CityList, setCityList] = useState([])
    const [ProvinceList, setProvinceList] = useState([])
    const [total, setTotal] = useState(0)
    const [title, setTitle] = useState('新增学校')
    const [visible, setVisible] = useState(false)
    const formRef=useRef()
    const cityselect=useRef()
    const columns=[
        {
            title: '学校',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '省份',
            dataIndex: 'province_name',
            key: 'provinceName',
        },
        {
            title: '城市',
            dataIndex: 'city_name',
            key: 'CityName',
        },
        {
            title: '学校编码',
            dataIndex: 'number',
            key: 'number',
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
                    <Popconfirm placement="top" title={'确认删除该学校吗？'} onConfirm={e=>deleteSchool(record)} okText="确认" cancelText="取消">
                        <Button type="danger" shape="circle"   icon={<DeleteOutlined />}  />
                    </Popconfirm>
                    
                </Space>
            ),
          },
    ]
    const getList=useCallback(
        async () => {
            const res=await list(searchParams)
            if(res.code===200){
                setTotal(res.data.total)
                setSchoolList(res.data.list)
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
    const onSearch = value => {
        
        setSearchParams({...searchParams,name:value,page:1,limit:5})
    }
    async function deleteSchool(record){
        const res=await delSchool({id:record.id})
        if(res.code===200){
            message.success('删除成功',0.8)
            setSearchParams({...searchParams,page:1,limit:5})
        }
    }
    async function edit(record){
        const res=await detail(record.name,record.number)
        console.log(res.data[0])
        setTitle('编辑学校')
        setVisible(true)
        getProvinceList()
        id=record.id
        if(formRef.current)
            formRef.current.setFieldsValue(res.data[0])
        const res1=await getCityByPid(res.data[0].province_id)
        setCityList(res1.data.list)
    }
    async function addSchool(){
        try {
            var values =await formRef.current.validateFields();
            console.log(values)
            if(title==='新增学校'){
                const res=await addSchools({...values})
                if(res.code===200){
                    message.success('新增成功',0.8)
                    getList()
                    setVisible(false)
                }
            }else{
                const res2=await editSchool({...values,id})
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
    function showDialog(){
        setVisible(true)
        setTitle('新增学校')
        getProvinceList()
        if(formRef.current)
        formRef.current.resetFields()
    }
    async function getProvinceList(){
        if(ProvinceList.length===0){
            const res=await getProvinces()
            console.log(res.data.list)
            setProvinceList(res.data.list)
        }
        
    }
    async function onChangeProvince(value) {
        console.log(`selected ${value}`);
        const res=await getCityByPid(value)
        formRef.current.setFieldsValue({city_id:''})
        setCityList(res.data.list)
        
    }
    return (
        <div>
            <Breadcrumb separator=">">
                <Breadcrumb.Item >
                    <NavLink to="/homepage">首页</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >高校管理</Breadcrumb.Item>
            </Breadcrumb>
            <div className={style.search_area}>
                <Input.Search allowClear placeholder="请输入校名" onSearch={onSearch} enterButton style={{width:'400px',marginRight:'10px'}}/>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>showDialog()}>新增</Button>
            </div>
            <Table dataSource={SchoolList} columns={columns} rowKey="id" 
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
            <div className="dialog">
                <Modal title={title} visible={visible}  onCancel={()=>setVisible(false)}  onOk={addSchool} okText='确认' cancelText='取消'>
                <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="校名"
                    name="schoolName"
                    validateTrigger="onBlur"
                   
                    rules={[{ required: true, message: '请输入学校名称' }]}>
                        <Input  />
                    </Form.Item>
                    <Form.Item
                    label="学校编码"
                    name="number"
                    validateTrigger="onBlur"
                    rules={[
                        { required: true, message: '请输入学校编码' },
                            ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="省份"
                    name="province_id"
                    rules={[{ required: true, message: '请选择省份' }]}>
                        <Select onChange={onChangeProvince} ref={cityselect}>
                            {
                                ProvinceList.map(item=><Option value={item.class_id} key={item.class_id}>{item.class_name}</Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                    label="城市"
                    name="city_id"
                    rules={[{ required: true, message: '请选择城市' }]}>
                        <Select>
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
}))
