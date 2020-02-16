import React, {Component} from 'react'
import './login.less'
import logo from '../../assets/images/logo.png'
import {Form, Icon, Input, Button, message} from 'antd';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'

class Login extends Component {
    handleSubmit = e => {
        e.preventDefault()//阻止表單提交
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.login(values.username, values.password)
                if (!this.props.user.errorMsg) {
                    message.success('登錄成功')
                    this.props.history.replace('/home')
                } else {
                    message.error(this.props.user.errorMsg)
                }
            }
        })
    }
    vaildatePwd = (rule, value, callback) => {
        if (!value) {
            callback('必須輸入密碼')
        } else if (value.length < 4) {
            callback('密碼長度最少4位')
        } else if (value.length > 12) {
            callback('密碼長度最大12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密碼必須以英文字母,數字或下劃線組成')
        } else {
            callback()
        }

    }

    render() {
        const user=this.props.user
        if (user && user._id) {
            return <Redirect to='/'/>
        }
        const {getFieldDecorator} = this.props.form;
        return (<div className='login'>
            <header className='login-header'>
                <img src={logo} alt=""/>
                <h1>後台管理系統</h1>
            </header>
            <section className='login-content'>
                <h2>用戶登錄</h2>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {/*username是組件名可拿值*/}
                        {getFieldDecorator('username', {
                            //聲明式驗證,直按用別人定義好的驗證規則
                            rules: [{required: true, message: '必須輸入用戶名'},
                                {min: 4, message: '用戶名至少4位'},
                                {max: 12, message: '用戶名最多12位'},
                                {pattern: /^[a-zA-z0-9_]+$/, message: '用戶名只能是英文字母或數字,下劃線'}],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {validator: this.vaildatePwd}],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder="Password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>

                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>

                    </Form.Item>
                </Form>
            </section>
        </div>)
    }

}

export default connect(state => ({user: state.user}), {login})(Form.create({name: 'normal_login'})(Login))


