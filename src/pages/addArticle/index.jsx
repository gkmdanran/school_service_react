import React, { memo,useState,useRef,useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux'
import { Breadcrumb,Input,Form,Button,message} from 'antd';
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {insertArticle,getArticle,edit} from '@/services/article.js'
import {BASE_URL} from '../../services/config'
import checkLogin from '../../components/PrivateRoute'
var id=''
export default checkLogin(memo(function AddArticle(props) {
    const editref = useRef()
    const formRef=useRef()
    const [contentHtml, setContentHtml] = useState(EditorState.createEmpty())
    const [contentText, setcontentText] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    
    useEffect(() => {
        console.log(props.location)
        id=props.location.search.replace('?','').split("=")[1]
        if(id){
            setIsEdit(true)
            getDetails(id)
        }
        
    }, [props.location])
    const {userInfo} = useSelector(state => ({
        userInfo:state.UserReducer.userInfo
    }),shallowEqual)
    const onEditorStateChange=(editorState)=>{
        setContentHtml(editorState)
    }
    const onContentStateChange=(val)=>{
        var alltext=''
        for(let x of val.blocks){
            alltext+=x.text
        }
        setcontentText(alltext)
    }
    
    async function getDetails(id){
        const res=await getArticle(id)
        if(res.code===200){
            formRef.current.setFieldsValue({title:res.data[0].title})
            const contentBlock = htmlToDraft(res.data[0].html_content)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setcontentText(res.data[0].content)
            setContentHtml(editorState)
            
        }
    }
        
    async function add(){
        var HTML=draftToHtml(convertToRaw(contentHtml.getCurrentContent()))
        console.log(HTML,contentText)
        if(HTML===''||contentText==='')return message.warning('请输入内容',0.9)
        try {
            var values =await formRef.current.validateFields();
            const res=await insertArticle({...values,content:contentText,html_content:HTML,writer_id:userInfo.id,city_id:userInfo.manage_city_id})
            if(res.code===200){
                message.success('发送成功',0.9)
                props.history.push("/homepage/article")
            }
        } catch (error) {
        console.log(error)
        }
    }
    async function editArticle(){
        var HTML=draftToHtml(convertToRaw(contentHtml.getCurrentContent()))
        console.log(HTML,contentText)
        if(HTML===''||contentText==='')return message.warning('请输入内容',0.9)
        try {
            var values =await formRef.current.validateFields();
            const res=await edit({...values,content:contentText,html_content:HTML,writer_id:userInfo.id,city_id:userInfo.manage_city_id,id})
            if(res.code===200){
                message.success('发送成功',0.9)
                props.history.push("/homepage/article")
            }
        } catch (error) {
        console.log(error)
        }
    }
    function uploadImageCallBack(file){
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `${BASE_URL}upload/articleupload`)
            var token='Bearer '+(sessionStorage.getItem('school_token')||'')
            xhr.setRequestHeader("authorization", token);
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText)
              console.log(response)
              const url = response.url // 得到图片的url
              resolve({data: {link: url}})
            })
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText)
              reject(error)
            })
          }
        )
    }
    function submit(){
        if(isEdit){
            editArticle()
        }else{
            add()
        }
       
    }
    return (
        <div>
            <Breadcrumb separator=">">
                <Breadcrumb.Item >
                    <NavLink to="/homepage">首页</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    <NavLink to="/homepage/article">推文列表</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item >{isEdit===true?'编辑推文':'新增推文'}</Breadcrumb.Item>
            </Breadcrumb>
            <Form style={{marginTop:'20px'}} ref={formRef}>
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题' }]}
                    style={{width:'500px'}}
                >
                    <Input />
                </Form.Item>
                <Editor
                    ref={editref}
                    editorState={contentHtml}
                    editorStyle={{border: '1px solid black', minHeight: 500, paddingLeft: 10,marginBottom:20}}
                    onEditorStateChange={onEditorStateChange}
                    onContentStateChange={onContentStateChange}
                    toolbar={{
                        image: { uploadCallback:uploadImageCallBack, alt: { present: true, mandatory: true } },
                      }}
                />
                <Form.Item>
                    <Button type="primary" style={{marginLeft:'100px'}} onClick={e=>submit()}>提交</Button>
                </Form.Item>
            </Form>
            
        

        </div>
    )
}))
