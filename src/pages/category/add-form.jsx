import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'


const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    static propTypes = {
        categoryList: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired,
        parentId:PropTypes.string.isRequired
    }
    componentDidMount() {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {categoryList,parentId} = this.props
        return (<Form>
            <Item>
                {getFieldDecorator('parentId', {
                    rules: [{required: true, message: '請選擇分類'}],
                    initialValue: parentId
                })(
                    <Select>
                        <Option value='0' key='0'>一級分類</Option>
                        {categoryList.map(category => (<Option value={category._id} key={category._id}>{category.name}</Option>)
                        )}
                    </Select>
                )}
            </Item>
            <Item>
                {getFieldDecorator('categoryName', {
                    rules: [{required: true, message: '請輸入分類名稱'}],
                })(
                    <Input
                        placeholder="請輸入分類名稱"
                    />,
                )}

            </Item>
        </Form>)
    }

}

export default Form.create()(AddForm)
