import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import {BASE_IMG_UL} from '../../utils/constants'

const Item = List.Item

export default class Detail extends Component {

    render() {
        const {name, desc, price, detail, imgs, categoryId, pCategoryId} = this.props.location.state.product
        const title = (<span>
            <a onClick={() => this.props.history.goBack()}>
                <Icon type='arrow-left' style={{marginRight: 5}}/>
            </a>

            <span>商品詳情</span>
        </span>)
        return (<Card title={title} className='product-detail'>
            <List>
                <Item>
                    <span className='left'>商品名稱</span>
                    <span>{name}</span>
                </Item>
                <Item>
                    <span className='left'>商品描述</span>
                    <span>{desc}</span>
                </Item>
                <Item>
                    <span className='left'>商品價格</span>
                    <span>${price}</span>
                </Item>
                <Item>
                    <span className='left'>所屬分類</span>
                    <span>{categoryId.name} --> {pCategoryId.name}</span>
                </Item>
                <Item>
                    <span className='left'>商品圖片</span>
                    <span>
                        {imgs.map(img => (
                            <img className='product-img'
                                 key={img}
                                 src={BASE_IMG_UL + img}
                                 alt=""/>
                        ))}


                        </span>
                </Item>
                <Item>
                    <span className='left'>商品詳情</span>
                    <span dangerouslySetInnerHTML={{__html: detail}}></span>
                </Item>
            </List>

        </Card>)
    }

}
