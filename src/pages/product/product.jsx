import React, {Component} from 'react'
import {Switch, Route,Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

export default class Product extends Component {
    render() {
        return (<Switch>
            <Route exact path='/product/addupdate' component={ProductAddUpdate}/>
            <Route exact path='/product/detail' component={ProductDetail}/>
            <Route exact path='/product' component={ProductHome}/>
            <Redirect to='/product'/>
        </Switch>)
    }

}
