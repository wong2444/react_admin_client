import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'



const Item = Form.Item
const Option = Select.Option

class UserForm extends Component {
    static propTypes = {
        roleList: PropTypes.array.isRequired,
        // onRef: PropTypes.func.isRequired,
        setForm: PropTypes.func.isRequired,
        user: PropTypes.object

    }


    componentDidMount() {
        this.props.setForm(this.props.form)
        // this.props.onRef(this)
    }

    // addOrUpdateUser = async () => {
    //     const {user} = this.props
    //     let result = {}
    //     this.props.form.validateFields(async (err, values) => {
    //         if (!err) {
    //             delete values['prefix']
    //             if (user) {
    //                 values['_id'] = user._id
    //             }
    //             result = await reqUserAddOrUpdate(values)
    //             if (result.status === 0) {
    //                 message.success('用戶新增/更新成功')
    //
    //             } else {
    //                 message.success('用戶新增/更新失敗')
    //             }
    //
    //             // console.log(values)
    //             // console.log(this.pw.current.getImgs())//使用子組件方法
    //             // console.log(this.editor.current.getDetail())//拿到富文本編輯器的內容
    //         }
    //     })
    //
    // }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 15}
        }
        const phonePrefixSelector = getFieldDecorator('prefix', {
            initialValue: '852',
        })(
            <Select style={{width: 70}}>
                <Option value="852">+852</Option>
                <Option value="86">+86</Option>
            </Select>,
        )
        let {roleList, user} = this.props

        return (<Form {...formItemLayout}>
            <Item label='用戶名:'>
                {getFieldDecorator('username', {
                    rules: [{required: true, message: '請輸入用戶名稱'}],
                    initialValue: user ? user.username : ''
                })(
                    <Input
                        placeholder="請輸入用戶名稱"
                    />,
                )}

            </Item>
            {!user ? (<Item label='密碼:'>
                {getFieldDecorator('password', {
                    rules: [{required: true, message: '請輸入密碼'}],
                    initialValue: user ? user.password : ''
                })(
                    <Input type="password"
                           placeholder="請輸入密碼"
                    />,
                )}

            </Item>) : null}


            <Item label='電話:'>
                {getFieldDecorator('phone', {
                    rules: [{required: true, message: '請輸入手機號碼'}],
                    initialValue: user ? user.phone : ''
                })(
                    <Input addonBefore={phonePrefixSelector}
                           placeholder="請輸入手機號碼"
                    />,
                )}

            </Item>
            <Item label='電郵:'>
                {getFieldDecorator('email', {
                    rules: [{required: true, message: '請輸入電郵地址'}, {
                        type: 'email',
                        message: '請輸入正確電郵地址',
                    }],
                    initialValue: user ? user.email : ''
                })(
                    <Input
                        placeholder="請輸入電郵地址"
                    />,
                )}

            </Item>
            <Item label='角色:'>
                {getFieldDecorator('role_id', {
                    rules: [{required: true, message: '請選擇角色'}],
                    initialValue: user ? user.role_id._id : ''
                })(
                    <Select>
                        {roleList.map(role => (
                            <Option value={role._id} key={role._id}>{role.name}</Option>)
                        )}
                    </Select>
                )}
            </Item>

        </Form>)
    }

}

export default Form.create()(UserForm)
