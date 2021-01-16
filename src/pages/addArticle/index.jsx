import React, { memo,useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Breadcrumb,Input,Form,Button} from 'antd';
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default memo(function AddArticle() {
    const [content, setContent] = useState(EditorState.createEmpty())
    const onEditorStateChange=(editorState)=>{
        setContent(editorState)
    }
    function getDetail(){
        console.log(draftToHtml(convertToRaw(content.getCurrentContent())))
    }
    function submit(){
        getDetail()
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
                <Breadcrumb.Item >新增推文</Breadcrumb.Item>
            </Breadcrumb>
            <Form style={{marginTop:'20px'}}>
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题' }]}
                    style={{width:'500px'}}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '请输入内容' }]}
                  
                >
                   <Editor
                    editorState={content}
                    editorStyle={{border: '1px solid black', minHeight: 500, paddingLeft: 10}}
                    onEditorStateChange={onEditorStateChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" style={{marginLeft:'100px'}} onClick={e=>submit()}>提交</Button>
                </Form.Item>
            </Form>
            
        

        </div>
    )
})
