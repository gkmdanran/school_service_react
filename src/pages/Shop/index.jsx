import React, { memo,useState,useCallback,useEffect,useRef} from 'react'
import { NavLink } from 'react-router-dom';
import { Breadcrumb,Space,Button,Table,Input,Form,message,Popconfirm,Image,Select} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {list,changeStatus} from '@/services/shop.js'
import dayjs from 'dayjs'
import style from './shop.module.css'
const { Option } = Select;
export default memo(function Lose() {
    const [searchParams, setSearchParams] = useState({page:1,limit:5,goods_type:'',status:'',goods_name:''})
    const [ShopList, setShopList] = useState([])
    const [total, setTotal] = useState(0)
    const formRef=useRef()
    const getList=useCallback(
        async () => {
            const res=await list(searchParams)
            if(res.code===200){
                setTotal(res.data.total)
                setShopList(res.data.list)
            }
        },
        [searchParams]
    )
    const columns=[
        {
            title: '发起账号',
            dataIndex: 'username',
            key: 'username',
            width:130,
        },
        {
            title: '联系方式',
            dataIndex: 'contact_number',
            key: 'contact_number',
            width:200,
            render: (text, record) => (
                <span>
                    {record.contact_way+':'+text}
                </span>
                   
            ),
        },
        {
            title: '物品名称',
            dataIndex: 'goods_name',
            key: 'goods_name',
            ellipsis: true,
        },
        {
            title: '物品类型',
            dataIndex: 'goods_type',
            key: 'goods_type',
            width:100,
            render: (text,record) => (
                <span>
                    {record.goods_type==='0'?'生活用品':record.goods_type==='1'?'学习用品':record.goods_type==='2'?'电子产品':'衣物'}
                </span>
                   
            ),
        },
       
        {
            title: '物品描述',
            dataIndex: 'goods_desc',
            key: 'goods_desc',
            ellipsis: true,
        },
        {
            title: '价格',
            dataIndex: 'goods_price',
            key: 'goods_price',
            
        },
        {
            title: '图片',
            dataIndex: 'goods_pic',
            key: 'goods_pic',
            width:120,
            render: (text, record) => (
                <div >
                    <Image src={record.goods_pic}   width={80} alt=""/>
                </div>
                
            ),
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            ellipsis: true,
        },
        {
            title: '商品状态',
            dataIndex: 'status',
            key: 'status',
            width:100,
            render: (text,record) => (
                <span>
                    {record.status==='0'?'在售':record.status==='1'?'买家下单':record.status==='2'?'双方确认':record.status==='3'?'交易完成':'下架'}
                </span>
                   
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            width:170,
            render: (text, record) => (
                <span>
                    {dayjs(text).format("YYYY-MM-DD HH:mm:ss")}
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
                    <Popconfirm placement="top" title={'确认下架该商品吗?'} onConfirm={()=>changeType(record)} okText="确认" cancelText="取消">
                    {
                        record.status!=='4'?<Button type="danger" >下架</Button>:<span style={{color:'red'}}>已下架</span>
                        
                    }
                    </Popconfirm>
                    <span></span>
                </Space>
            ),
          }
        
    ]
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
        
        const res=await changeStatus({id:record.id})
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
                <Breadcrumb.Item >失物招领管理</Breadcrumb.Item>
            </Breadcrumb>
            <div className={style.search_area}>
                <Form className={style.searchform} ref={formRef} initialValues={{goods_name:'',goods_type:'',status:''}}>
                    <Form.Item label="商品名" name="goods_name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="状态" name="status" style={{width:'200px',marginLeft:'15px'}}>
                        <Select allowClear>
                            <Option value={'0'}>在售</Option>
                            <Option value={'1'}>买家下单</Option>
                            <Option value={'2'}>双方接受</Option>
                            <Option value={'3'}>交易完成</Option>
                            <Option value={'4'}>已下架</Option>
                            
                        </Select>
                    </Form.Item>
                    <Form.Item label="商品分类" name="goods_type"  style={{width:'200px',marginLeft:'15px'}}>
                        <Select allowClear>
                            <Option value={'0'}>生活用品</Option>
                            <Option value={'1'}>学习用品</Option>
                            <Option value={'2'}>电子产品</Option>
                            <Option value={'3'}>衣物</Option>
                            >
                        </Select>
                    </Form.Item>
                    <Form.Item   style={{width:'150px',marginLeft:'20px'}}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={()=>searchUser()}>搜索</Button>
                    </Form.Item>
                </Form>
            </div>
            <Table dataSource={ShopList} columns={columns} rowKey="id" 
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
})

