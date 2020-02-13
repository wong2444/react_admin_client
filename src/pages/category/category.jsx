import React, {Component} from 'react'
import {Card, Button, Icon, Table, Tag, Divider, message, Modal} from "antd";
import './category.less'
import {reqCategory, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {
    state = {
        categoryList: [],
        subCategoryList: [],//二級分類列表
        loading: false,
        parentId: '0',
        parentName: '',
        showStatus: 0//
    }

    initColumns() {
        this.title = '一級分類列表'
        //卡片右側
        this.extra = (<Button type='primary' onClick={() => {

            this.setState({showStatus: 1})
        }}>
            <Icon type='plus'></Icon>
            添加
        </Button>)

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',

            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>

                       <a onClick={() => {
                           this.category = category

                           this.setState({showStatus: 2})
                       }
                       }>修改分類</a>
                        <Divider type="vertical"/>
                        {this.state.parentId === '0' ?
                            <a onClick={() => this.showSubCategorys(category)}>查看子分類</a> : null}


      </span>
                ),
            },
        ];
    }

    showSubCategorys = (category) => {
        //異步方法
        this.setState({parentId: category._id, parentName: category.name},
            () => {
                //狀態更新且重新render後執行
                this.title = <span><a onClick={this.showCategorys}>{this.title}</a> -> {category.name}</span>
                this.getCategorys()
            }
        )

    }
    showCategorys = () => {
        this.setState({parentId: '0', parentName: '', subCategoryList: []})
        this.title = '一級分類列表'
    }
    getCategorys = async (parentId) => {
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategory(parentId)
        if (result.status !== 0) return message.error('獲取數據失敗')
        if (parentId !== '0') {
            this.setState({subCategoryList: result.data, loading: false})
        } else {
            this.setState({categoryList: result.data, loading: false})
        }

    }

    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const {categoryName, parentId} = values
                const result = await reqAddCategory(categoryName, parentId)

                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategorys() //在本頁中新增本頁中的分類才需要更新列表
                    } else if (parentId === '0' && this.state.parentId !== '0') {
                        this.getCategorys('0') //在子分類中新增父分類列表需要更新列表

                    }
                    message.success('新增成功')
                } else {
                    message.error('更新失敗')
                }
                this.form.resetFields()//重置表單數據
                this.setState({showStatus: 0})
            } else {
                message.error('請輸入資科')
            }
        })

    }
    updateCategory = () => {
        this.form.validateFields(async (err, values) => {//通過了表單驗證
            if (!err) {
                const {categoryName} = values
                const result = await reqUpdateCategory(this.category._id, categoryName)
                if (result.status === 0) {
                    this.getCategorys()
                    message.success('更新成功')
                } else {
                    message.error('更新失敗')
                }
                this.form.resetFields()//重置表單數據
                this.setState({showStatus: 0})
            } else {
                message.error('請輸入資科')
            }
        })


    }

    handleCancel = () => {
        this.form.resetFields()//重置表單數據
        this.setState({showStatus: 0})
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getCategorys()
    }

    render() {
        const {categoryList, subCategoryList, parentId, parentName, loading} = this.state
        const category = this.category || {}
        return (
            <Card title={this.title} extra={this.extra}>
                <Table bordered columns={this.columns} dataSource={parentId === '0' ? categoryList : subCategoryList}
                       rowKey='_id'
                       pagination={{
                           pageSize: 5,
                           defaultCurrent: 1
                       }} loading={loading}

                />

                <Modal
                    title="新增分類"
                    visible={this.state.showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categoryList={categoryList} setForm={(form) => this.form = form} parentId={parentId}/>

                </Modal>
                <Modal
                    title="更新分類"
                    visible={this.state.showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}/>
                </Modal>
            </Card>

        )
    }

}
