import React, {Component} from 'react'
import {Card, Icon, Input, Button, Form, Cascader, Upload, message} from 'antd'
import {reqCategory, reqProductAddOrUpdate} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input
// const options = [
//     {
//         value: 'zhejiang',
//         label: 'Zhejiang',
//         isLeaf: false,
//     },
//     {
//         value: 'jiangsu',
//         label: 'Jiangsu',
//         isLeaf: false,
//     },
// ]

class AddUpdate extends Component {

    constructor(props) {
        super(props)
        //創建用來保存ref標識的標籤對象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    state = {
        options: []
    }

    submit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let imgs = this.pw.current.getImgs()
                let detail = this.editor.current.getDetail()
                let product = {}
                if (this.product._id) {
                    let {_id} = this.product
                    product = {...values, imgs, detail, _id}
                } else {
                    let [pCategoryId, categoryId] = values.categoryIds
                    product = {...values, imgs, detail, pCategoryId, categoryId}
                }
                const result = await reqProductAddOrUpdate(product)
                if (result.status === 0) {
                    message.success('產品新增/更新成功')
                    this.props.history.goBack()
                } else {
                    message.error('產品新增/更新失敗')
                }
                // console.log(values)
                // console.log(this.pw.current.getImgs())//使用子組件方法
                // console.log(this.editor.current.getDetail())//拿到富文本編輯器的內容
            }
        })
    }
    validatePrice = (rule, value, callback) => {

        if (value * 1 < 0) {
            callback('價格必須大於0');
        } else {
            callback();
        }
    }
    validateCategory = (rule, value, callback) => {
        if (value.length < 2) {
            callback('商品只能添加為二級分類');
        } else {
            callback();
        }
    }
    getCategory = async (targetOption = {}) => {
        const parentId = targetOption.value || '0'
        const result = await reqCategory(parentId)
        if (result.status === 0) {
            let options = []
            if (parentId === '0') {
                options = result.data.map(category => ({value: category._id, label: category.name, isLeaf: false}))
                this.setState({options})
                console.log(this.product)
                if (this.product._id) {
                    let cate = options.find(category => category.value === this.product.pCategoryId._id)
                    this.getCategory(cate)//更新產品時直接拿2級category
                }
            } else {
                if (result.data.length === 0) {
                    targetOption.isLeaf = true
                } else {
                    options = result.data.map(category => ({value: category._id, label: category.name, isLeaf: true}))
                    targetOption.children = options
                }
                targetOption.loading = false
                this.setState({options: [...this.state.options]})
            }

        }
    }
    onChange = (value, selectedOptions) => {
        // console.log(value, selectedOptions)
    }

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        // console.log(targetOption)//是選中option的obj
        targetOption.loading = true

        this.getCategory(targetOption)

    }

    componentDidMount() {
        this.getCategory()

    }

    componentWillMount() {
        let product = {}
        if (this.props.location.state) {
            product = this.props.location.state.product
        }


        this.product = product || {}

    }

    render() {
        const {getFieldDecorator} = this.props.form;

        let {name, desc, price, detail, imgs, categoryId, pCategoryId} = this.product
        if (!categoryId) {
            categoryId = ''
            pCategoryId = ''
        }

        const formItemLayout = {
            labelCol: {
                span: 2//左側label的寬度
            },
            wrapperCol: {
                span: 8,//右側包裹的寬度

            },
        }
        const title = (
            <span>
                <a onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{marginRight: 5}}/>
                </a>
                <span>{this.product._id ? '更新' : '新增'}商品</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form  {...formItemLayout}>
                    <Item label="商品名稱">
                        {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [{required: true, message: '請輸入商品名稱'}],
                        })(<Input placeholder='商品名稱'/>)}
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: desc,
                            rules: [{required: true, message: '商品描述'}],
                        })(<TextArea placeholder='商品描述' autoSize={{minRows: 2, maxRows: 6}}/>)}
                    </Item>
                    <Item label="商品價格">
                        {getFieldDecorator('price', {
                            initialValue: price,
                            rules: [
                                {required: true, message: '請輸入商品價格'},
                                {validator: this.validatePrice}

                            ],
                        })(<Input addonBefore="$" type='number' placeholder='商品價格' min={0}/>)}
                    </Item>
                    <Item label="商品分類">
                        {getFieldDecorator('categoryIds', {
                            initialValue: [pCategoryId._id, categoryId._id] || [],
                            rules: [
                                {required: true, message: '請輸入商品分類'},
                                {validator: this.validateCategory}


                            ],
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                onChange={this.onChange}

                            />
                        )}
                    </Item>
                    <Item label="產品圖片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="產品介紹" wrapperCol={{span: 16}} labelCol={{span: 2}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                </Form>
                <Button type='primary' onClick={this.submit}>提交</Button>
            </Card>
        )
    }

}

export default Form.create()(AddUpdate)
