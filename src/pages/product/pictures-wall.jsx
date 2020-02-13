import React, {Component} from 'react'
import {Upload, Icon, Modal, message} from 'antd';
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_UL} from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        //在创建一个新的 FileReader对象后，我们新建了它的onload 函数，然后调用readAsDataURL()函数开始后台读取文件。
        // 当整个图片文件的内容都被全部加载完后，它们被转换成了一个被传递到onload回调函数的data:URL。
        // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容。
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props)
        let fileList = []
        const {imgs} = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                    uid: -index,
                    name: img,
                    status: 'done',
                    url: BASE_IMG_UL + img
                })
            )
        }
        this.state = {
            previewVisible: false,//是否顯示大圖預覽
            previewImage: '',//大圖地址
            fileList
        }

    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }



    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({file, fileList, event}) => {
        console.log(file, fileList, event)
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上傳圖片成功')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]//修改圖片列表的最後一個元素
                file.name = name
                file.url = url

            } else {
                message.error('上傳圖片失敗')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('圖片刪除成功')
            } else {
                message.error('圖片刪除失敗')
            }

        }
        this.setState({fileList})
    }


    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    accept='image/*'
                    action="/manage/img/upload"
                    listType="picture-card"
                    fileList={fileList}//已上傳文件列表
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    name='image'//請求參數名
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

