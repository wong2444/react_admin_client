import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item


class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }


    render() {
        const {getFieldDecorator} = this.props.form;

        return (<Form>

            <Item>
                {getFieldDecorator('roleName', {
                    rules: [{required: true, message: '請輸入角色名稱'}],

                })(
                    <Input
                        placeholder="請輸入角色名稱"
                    />,
                )}

            </Item>
        </Form>)
    }

}

export default Form.create()(AddForm)
