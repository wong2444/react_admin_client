import React, {Component} from 'react'
import {Card, Button, Table, Modal, Divider, message} from 'antd'
import {PAGE_SIZE} from "../../utils/constants";
import dateUtils from "../../utils/dateUtils";
import {reqDeleteUsers, reqRoles, reqUserAddOrUpdate, reqUsers} from '../../api'
import UserForm from './user-form'

const {confirm} = Modal
export default class User extends Component {
    state = {
        users: [],
        roleList: [],
        showStatus: false,

    }
    initColumn = () => {
        this.columns = [
            {title: '用戶名', dataIndex: 'username'},
            {
                title: '郵箱', dataIndex: 'email'
            },
            {
                title: '電話', dataIndex: 'phone'
            },
            {title: '注冊時間', dataIndex: 'create_time', render: dateUtils},
            {title: '所屬角色', dataIndex: 'role_id', render: (role) => role.name},
            {
                title: '操作', render: (user) => (
                    <span>
                       <a onClick={() => {
                           this.user = user
                           this.setState({showStatus: true})
                       }}>修改</a>
                        <Divider type="vertical"/>
                        {<a onClick={() => this.showDeleteConfirm(user._id)}>刪除</a>}


      </span>
                )
            }
        ]
    }
    handleCancel = () => {


        this.setState({showStatus: false})
        this.form.resetFields()//重置表單數據
    }

    showAddUserForm = () => {

        this.setState({showStatus: true})
        this.user = null
    }


    showDeleteConfirm = (userId) => {
        confirm({
            title: '確定刪除此用戶?',
            onOk: async () => {
                const result = await reqDeleteUsers(userId)
                if (result.status === 0) {
                    message.success('用戶刪除成功')
                    this.getUser()
                } else {
                    message.success('用戶刪除失敗')
                }
            },
            onCancel() {
            }
        })
    }


    componentWillMount() {
        this.initColumn()
    }

    addOrUpdateUser = () => {

        let result = {}
        this.form.validateFields(async (err, values) => {
            if (!err) {
                delete values['prefix']
                if (this.user) {
                    values['_id'] = this.user._id
                }
                result = await reqUserAddOrUpdate(values)
                if (result.status === 0) {
                    message.success('用戶新增/更新成功')
                    this.state.showStatus = false
                    this.getUser()
                    this.form.resetFields()//重置表單數據

                } else {
                    message.success('用戶新增/更新失敗')
                }

                // console.log(values)
                // console.log(this.pw.current.getImgs())//使用子組件方法
                // console.log(this.editor.current.getDetail())//拿到富文本編輯器的內容
            }
        })





    }
    getUser = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            this.setState({users: result.data})
        }
    }
    getRole = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            this.setState({roleList: result.data})
        }
    }

    componentDidMount() {
        this.getUser()
        this.getRole()
    }



    render() {
        const {roleList} = this.state
        const title = <Button type='primary' onClick={this.showAddUserForm}>創建用戶</Button>
        return (<Card title={title}>

            <Table
                rowKey='_id'
                dataSource={this.state.users}
                columns={this.columns}
                bordered
                pagination={{
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true
                }}

            />

            <Modal
                title="新增用戶"
                visible={this.state.showStatus === true}
                onOk={this.addOrUpdateUser}
                onCancel={this.handleCancel}
            >
                <UserForm roleList={roleList} user={this.user} setForm={(form) => this.form = form}/>

            </Modal>
        </Card>)
    }

}
