import React, {Component} from 'react'
import {Card, Select, Input, Button, Icon, Table, Divider, message} from "antd";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class Home extends Component {
    state = {
        products: [],
        total: 0,
        loading: false,
        searchType: 'productName',
        searchWord: ''


    }
    initColumns = () => {
        this.columns = [{
            title: '商品名稱',
            dataIndex: 'name',

        },
            {
                title: '商品描述',
                dataIndex: 'desc',

            },
            {
                title: '價格',
                dataIndex: 'price',//指定了dataIndex傳入的就是該數據
                render: (price) => `$ ${price}`
            },
            {
                title: '狀態',
                width: 150,

                render: (product) => {
                    const {_id, status} = product
                    if (status === 1) {
                        return (<span>
                            <Button type='primary' onClick={() => this.updateStatus(_id, 2)}>下架</Button>
                            <br/>
                            在售
                        </span>)
                    } else {
                        return (<span>
                            <Button type='primary' onClick={() => this.updateStatus(_id, 1)}>上架</Button>
                            <br/>
                            已下架
                        </span>)
                    }
                }
            },
            {
                title: '操作',
                width: 150,
                render: (product) => (<span>
                    <a onClick={() => this.props.history.push('/product/detail', {product})}>詳情</a>
                     <Divider type="vertical"/>
                    <a onClick={()=>this.props.history.push('/product/addupdate',{product})}>修改</a>
                </span>)
            },
        ]
    }
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading: true})
        const result = await reqProducts(pageNum, PAGE_SIZE)
        this.setState({loading: false})
        if (result.status === 0) {
            const {total, list} = result.data
            this.setState({total, products: list})
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    searchProducts = async (pageNum) => {
        this.setState({loading: true})
        const {searchType, searchWord} = this.state
        if (!searchWord) {
            this.getProducts(1)//如沒有關鍵字轉一般request
            return
        }
        pageNum = pageNum * 1 ? pageNum : 1
        this.pageNum = pageNum
        let result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, [searchType]: searchWord})

        this.setState({loading: false})
        if (result.status === 0) {
            const {total, list} = result.data
            this.setState({total, products: list})
        }
    }
    updateStatus = async (productId, status) => {

        const result = await reqUpdateStatus({productId, status})

        if (result.status === 0) {
            message.success('商品狀態更新成功')
            this.getProducts(this.pageNum)
        }
    }

    render() {
        const {products, searchWord} = this.state
        const title = (<span>
            <Select value={this.state.searchType} style={{width: 150}}
                    onChange={(val) => {
                        this.setState({searchType: val})
                    }}>
                <Option value='productName'>按名字搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input placeholder='關鍵字' style={{width: 150, margin: '0 15px'}} value={this.state.searchWord}
                   onChange={(event) => this.setState({searchWord: event.target.value})}/>
            <Button type='primary'
                    onClick={this.searchProducts}>搜索</Button>
        </span>)
        const extra = (<Button type='primary'  onClick={()=>this.props.history.push('/product/addupdate')}>
            <Icon type='plus'/>
            添加商品
        </Button>)

        return (<Card title={title} extra={extra}>
            <Table
                rowKey='_id'
                dataSource={products}
                columns={this.columns}
                bordered
                pagination={{
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    total: this.state.total,
                    onChange: searchWord ? this.searchProducts : this.getProducts,
                    current:this.pageNum
                }}

            />
        </Card>)
    }

}
