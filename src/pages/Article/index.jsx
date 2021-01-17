import React, { memo,useState,useCallback,useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import { Breadcrumb,Space,Button,Table,message,Popconfirm,Input} from 'antd';
import {list,delArticle,hideArticle} from '@/services/article.js'
import { EditOutlined,DeleteOutlined,EyeInvisibleOutlined,EyeOutlined,PlusOutlined} from '@ant-design/icons';
import dayjs from 'dayjs'
import checkLogin from '../../components/PrivateRoute'
export default checkLogin(memo(function Article(props) {
    const [searchParams, setSearchParams] = useState({page:1,limit:5,title:''})
    const [ArticleList, setArticleList] = useState([])
    const [total, setTotal] = useState(0)
    const getList=useCallback(
        async () => {
            const res=await list(searchParams)
            if(res.code===200){
                setTotal(res.data.total)
                setArticleList(res.data.list)
            }
        },
        [searchParams]
    )
    async function deleteArticle(record){
        console.log(record)
        const res=await delArticle({id:record.id})
        if(res.code===200){
            message.success('删除成功',0.8)
            setSearchParams({...searchParams,page:1,limit:5})
        }
    }
    async function hide(record){
        var type=record.status==='0'?'1':'0'
        const res=await hideArticle({id:record.id,type})
        if(res.code===200){
            message.success('修改成功',0.8)
            getList()
        }
    }
    const columns=[
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '作者',
            dataIndex: 'username',
            key: 'username',
            ellipsis: true,
        },
        {
            title: '简介',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
            render: (text, record) => (
                <span>
                    {text.slice(0,30)+'...'}
                </span>
            )
        },
        {
            title: '是否隐藏',
            dataIndex: 'status',
            key: 'status',
            width:100,
            render: (text, record) => (
                <span>
                    {text==='0'?'显示':'隐藏'}
                </span>
            )
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
            )
        },
        {
            title: '更新时间',
            dataIndex: 'updateAt',
            key: 'updateAt',
            width:170,
            render: (text, record) => (
                <span>
                    {dayjs(text).format("YYYY-MM-DD HH:mm:ss")}
                </span>
            )
        },
        {
            title: '操作',
            key: 'action',
            width:150,
            
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle"  onClick={()=>props.history.push(`/homepage/addarticle?id=${record.id}`)} icon={<EditOutlined />}/>
                    <Popconfirm placement="top" title={'确认删除该文章吗？'} onConfirm={e=>deleteArticle(record)} okText="确认" cancelText="取消">
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />}/>
                    </Popconfirm>
                    
                    <Popconfirm placement="top" title={record.status==='0'?'确认隐藏此文章吗？':'确认显示此文章吗？'} onConfirm={e=>hide(record)} okText="确认" cancelText="取消">
                    {
                        record.status==='0'?<Button type="danger" shape="circle" title="隐藏" icon={<EyeInvisibleOutlined />}/>:
                        <Button type="primary" shape="circle" title="显示" icon={<EyeOutlined />}/>
                    }
                    </Popconfirm>
                    
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
    const onSearch = value => {
        setSearchParams({...searchParams,title:value,page:1,limit:5})
    }
    return (
        <div>
            <Breadcrumb separator=">">
                <Breadcrumb.Item >
                    <NavLink to="/homepage">首页</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >推文管理</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{margin:'15px 0'}}>
                <Input.Search allowClear placeholder="请输入标题" onSearch={onSearch} enterButton style={{width:'400px',marginRight:'10px'}}/>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>{props.history.push("/homepage/addarticle")}}>新增</Button>
            </div>
            <Table dataSource={ArticleList} columns={columns} rowKey="id" 
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
