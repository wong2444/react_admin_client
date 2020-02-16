import React, {Component} from 'react'
import './admin.less'


import {Redirect, Route, Switch} from 'react-router-dom'
import LeftNav from '../../components/left-nav/left-nav'
import MyHeader from '../../components/header/header'

import Home from '../../pages/home/home'
import Category from '../../pages/category/category'
import Product from '../../pages/product/product'
import Role from '../../pages/role/role'
import User from '../../pages/user/user'
import Bar from '../../pages/chats/bar'
import Line from '../../pages/chats/line'
import Pie from '../../pages/chats/pie'
import NotFound from '../../pages/not-found/not-found'


import {connect} from 'react-redux'

import {Layout} from 'antd';

const {Footer, Sider, Content} = Layout;

class Admin extends Component {

    render() {
        const user = this.props.user

        if (!user || !user._id) {
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>

                    <MyHeader/>

                    <Content>
                        <div className='content'>
                            <Switch>
                                <Redirect exact={true} from='/' to='/home'/>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </div>

                    </Content>


                    <Footer style={{textAlign: 'center'}}>COPYRIGHT © {new Date().getFullYear()} create by wong ALL
                        RIGHTS RESERVED.</Footer>
                </Layout>
            </Layout>

        )
    }

}

export default connect(state => ({user: state.user}), {})(Admin)
