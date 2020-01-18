/*
用来指定商品详情的富文本编辑器组件
 */
import React, { useState, useEffect } from 'react'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const { EditorState, convertToRaw, ContentState } = require('draft-js')
const { Editor } = require('react-draft-wysiwyg')
const draftToHtml = require('draftjs-to-html')
const htmlToDraft = require('html-to-draftjs')

interface RichTextEditorProps {
    detail: string;
    setEditor:Function;
}

const RichTextEditor = (props: RichTextEditorProps) => {
    // 创建一个没有内容的编辑对象
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    useEffect(() => {

        const html = props.detail
        if (html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState);
        } else {
            // 创建一个没有内容的编辑对象
            setEditorState(EditorState.createEmpty());
        }
       props.setEditor(getDetail())
    }, [])


    /*
    输入过程中实时的回调
     */
    const onEditorStateChange = (editorState: any) => {
        console.log('onEditorStateChange()')
        setEditorState(editorState)
    }

    const getDetail = () => {
        // 返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    const uploadImageCallBack = (file: any) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url // 得到图片的url
                    resolve({ data: { link: url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    return (
        <Editor
            editorState={editorState}
            editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
                image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
            }}
        />
    )
}

export default RichTextEditor;