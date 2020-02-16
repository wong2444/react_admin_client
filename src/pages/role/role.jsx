import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from "./add-form";
import UpdateForm from "./update-form"
import dateUtils from '../../utils/dateUtils'

import {connect} from 'react-redux'
import {logout} from '../../redux/actions'


class Role extends Component {


    constructor(props) {
        super(props)


        this.state = {
            roles: [],
            role: {},//選中的role
            showStatus: 0
        }
    }

    initColumn = () => {
        this.columns = [
            {title: '角色名稱', dataIndex: 'name'},
            {
                title: '創建時間', dataIndex: 'create_time', render: dateUtils
            },
            {
                title: '授權時間', dataIndex: 'auth_time', render: dateUtils
            },
            {title: '授權人', dataIndex: 'auth_name'},
        ]
    }

    componentWillMount() {
        this.initColumn()
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role})
            }
        }
    }
    onSelect = (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, selectedRows)
        this.setState({role: selectedRows[0]})
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            this.setState({roles: result.data})
        }
    }

    addRole = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const {roleName} = values
                const result = await reqAddRole(roleName)

                if (result.status === 0) {
                    this.setState(state => ({
                        //數組新增數據建議使用函數方法
                        roles: [...state.roles, result.data]
                    }))
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

    updateRole = async () => {
        const role = this.state.role
        let menus = this.auth.getMenus()
        let user = this.props.user

        role.menus = menus
        role.auth_name = user.username
        role.auth_time = Date.now()
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            if (role._id === user.role_id) {
                message.success('所屬角色權限更新成功,請重新登入')
                this.props.logout()
            } else {
                this.setState({showStatus: 0, roles: [...this.state.roles]})
                message.success('角色權限更新成功')
            }


        } else {
            message.error('角色權限更新失敗')
        }

    }

    handleCancel = () => {
        this.form.resetFields()//重置表單數據
        this.setState({showStatus: 0})
    }

    showAddRoleForm = () => {
        this.setState({showStatus: 1})
    }
    showUpdateRoleForm = () => {
        this.setState({showStatus: 2})
    }

    componentDidMount() {
        this.getRoles()
    }

    onRef = (ref) => {
        this.auth = ref
    }

    render() {
        const {roles, role} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={this.showAddRoleForm}>創建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={this.showUpdateRoleForm}>設置角色權限</Button>
            </span>
        )

        return (<Card title={title}>

            <Table
                rowKey='_id'
                dataSource={roles}
                columns={this.columns}
                bordered
                rowSelection={{type: 'radio', selectedRowKeys: [role._id], onChange: this.onSelect}}
                onRow={this.onRow}
                pagination={{
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true
                }}

            />

            <Modal
                title="新增角色"
                visible={this.state.showStatus === 1}
                onOk={this.addRole}
                onCancel={this.handleCancel}
            >
                <AddForm setForm={(form) => this.form = form}/>

            </Modal>

            <Modal
                title="更新角色"
                visible={this.state.showStatus === 2}
                onOk={this.updateRole}
                onCancel={() => {
                    this.setState({showStatus: 0})
                }}
            >
                <UpdateForm role={role} onRef={this.onRef}/>


            </Modal>
        </Card>)
    }

}

export default connect(state => ({user: state.user}), {logout})(Role)
