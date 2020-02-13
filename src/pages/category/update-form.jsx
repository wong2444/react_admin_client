import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item


class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (<Form>

            <Item>
                {getFieldDecorator('categoryName', {
                    rules: [{required: true, message: '請輸入分類名稱'}],
                    initialValue: this.props.categoryName
                })(
                    <Input
                        placeholder="請輸入分類名稱"
                    />,
                )}

            </Item>
        </Form>)
    }

}

export default Form.create()(UpdateForm)
