import React, { useState, useEffect } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg, uploadImg } from '../../api'
import { BASE_IMG_URL,UPLOAD_IMG_URL } from "../../utils/constants";
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

interface PicturesWallProps {
    imgs: Array<string>;
    setImgs:Function;
}

/*
用于图片上传的组件
 */
const PicturesWall = (props: PicturesWallProps) => {

    // 标识是否显示大图预览Modal
    const [previewVisible, setPreviewVisible] = useState(false);
    // 大图的url
    const [previewImage, setPreviewImage] = useState('')
    /*{
       uid: '-1', // 每个file都有自己唯一的id
       name: 'xxx.png', // 图片文件名
       status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
       url: 'http://img.julyyoung.com/ra/img/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
     },*/
    const [fileList, setFileList] = useState(Array<any>())

    // 初始化状态
    useEffect(() => {
        // 如果传入了imgs属性
        const { imgs } = props;
        if (imgs && imgs.length > 0) {
            setFileList(
                imgs.map((img, index) => ({
                    uid: -index, // 每个file都有自己唯一的id
                    name: img, // 图片文件名
                    status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                    url: BASE_IMG_URL + img
                }))
            );
        }
        setPreviewVisible(false);// 标识是否显示大图预览Modal
        setPreviewImage(''); // 大图的url
        setFileList(imgs); // 所有已上传图片的数组
        props.setImgs(getImgs());
    }, [])

    /*
    获取所有已上传图片文件名的数组
     */
    const getImgs = () => {
        return fileList.map((file: any) => file.name)
    }

    /*
    隐藏Modal
     */
    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = (file: any) => {
        // 显示指定file对应的大图
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
    };

    /*
    file: 当前操作的图片文件(上传/删除)
    fileList: 所有已上传图片文件对象的数组
     */
    const handleChange = async (data: UploadChangeParam<UploadFile<any>>) => {
        let { file, fileList } = data;
       
        console.log('handleChange()', file.status, fileList.length, file === fileList[fileList.length - 1])

        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if (file.status === 'done') {
            const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if (result.status === 0) {
                message.success('上传图片成功!')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') { // 删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }

        // 在操作(上传/删除)过程中更新fileList状态
        setFileList([...fileList])
    };

    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div>Upload</div>
        </div>
    );

    const upload =async (option:any)=>{
        const formData = new FormData();
        formData.append('file',option.file);
        const result =await uploadImg(formData )
        if (result.status === 0) {
            message.success('上传图片成功!')
            const url =BASE_IMG_URL+ result.msg
            setFileList((fl:Array<any>)=>{
                const file = fl[fl.length - 1];
                if(file){
                    file.url=url;
                    file.status='done';
                }
                return  [...fl]
            });
           
        } else {
            message.error('上传图片失败')
        }
    } 
    

    return (
        <div>
            <Upload
                // action={upload}
                accept='image/*'  /*只接收图片格式*/
                name='image' /*请求参数名*/
                method='post'
                listType="picture-card"  /*卡片样式*/
                fileList={fileList}  /*所有已上传图片文件对象的数组*/
                onPreview={handlePreview}
                onChange={handleChange}
                customRequest={upload}
            >
                {fileList.length >= 4 ? null : uploadButton}
            </Upload>

            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}

export default PicturesWall;