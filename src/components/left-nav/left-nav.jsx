import React, {Component} from 'react'
import './left-nav.less'
import logo from '../../assets/images/logo.png'
import {Link} from 'react-router-dom'
import menuList from '../../config/menuConfig'

import {withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'


import {connect} from 'react-redux'
import {set_head_title} from '../../redux/actions'


const {SubMenu} = Menu


class LeftNav extends Component {
    componentWillMount() {
        //在第一之render()之前執行一次
        //為第一次render準備數據(必須是同步的)

        this.menuNodes = this.createMenu(menuList)
    }

    hasAuth = (item) => {
        let right = false
        const user=this.props.user
        if (user.username === 'admin' || item.isPublic) {
            return true
        } else {
            right = user.role.menus.find(menu => {
                if (item.key === menu) {
                    return true
                } else if (item.children) {
                    let subRight = item.children.find(c => {
                        if (c.key === menu) {
                            return true
                        }
                    })
                    return subRight
                }
            })
            return right
        }
    }
    createMenu = (list) => {
        const path = this.props.location.pathname

        //根據數據數組生成標籤數組
        list = list.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    if (item.key === path ) {
                        this.props.set_head_title(item.title)
                    }
                    return (<Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.set_head_title(item.title)}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {

                    const citem = item.children.find(citem => path.indexOf(citem.key) === 0)
                    if (citem) {
                        this.openKey = item.key
                    }


                    return (<SubMenu key={item.key} title={
                        <span>
                <Icon type={item.icon}/>

                <span>{item.title}</span>
              </span>
                    }
                    >
                        {this.createMenu(item.children)}
                    </SubMenu>)
                }
            }


        })
        return list

    }

    render() {
        let path = this.props.location.pathname
        {
            console.log(this.openKey)
            if (path.indexOf('/product') === 0) {
                path = '/product'
            }
        }
        return (<div className='left-nav'>
            <Link to='/'>
                <header className='left-nav-header'>

                    <img src={logo} alt=""/>
                    <p>電商後台</p>
                </header>
            </Link>


            <Menu
                selectedKeys={[path]}
                defaultOpenKeys={[this.openKey]}
                mode="inline"
                theme="dark"
            >
                {this.menuNodes}

            </Menu>

        </div>)
    }

}

export default connect(state => ({user:state.user}), {set_head_title})(withRouter(LeftNav))
