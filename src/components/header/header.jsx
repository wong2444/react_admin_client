import React, {Component} from 'react'
import './header.less'
import {reqWeather} from '../../api'
import formateDate from '../../utils/dateUtils'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'

import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import LinkButton from '../link-button/link-button'

import {Modal} from 'antd';

const {confirm} = Modal;

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',

    }
    logout = () => {
        confirm({
            title: '要登出嗎?',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    getWeather = async (city) => {
        const {dayPictureUrl, weather} = await reqWeather(city)
        this.setState({dayPictureUrl, weather})

    }
    getTime = () => {

        this.intervalId = setInterval(() => {
            this.setState({currentTime: formateDate(Date.now())})
        }, 1000)

    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title = ''
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                let citem = item.children.find(citem => path.includes(citem.key))
                if (citem) {
                    title = citem.title
                }
            }
        })
        return title
    }

    componentDidMount() {
        this.getTime()
        console.log('weather')
        this.getWeather('香港')


    }

    componentWillUnmount() {
        //當組件離開前調用
        clearInterval(this.intervalId)
    }

    render() {
        const title = this.getTitle()
        return (<div className='header'>
            <div className='header-top'>
                <span>歡迎,{memoryUtils.user.username}</span>
                <LinkButton onClick={this.logout}>退出</LinkButton>
            </div>
            <div className='header-bottom'>
                <div className='header-bottom-left'>{title}</div>
                <div className='header-bottom-right'>

                    <span>{this.state.currentTime}</span>
                    <img src={this.state.dayPictureUrl} alt=""/>
                    <span>{this.state.weather}</span>
                </div>
            </div>
        </div>)
    }

}

export default withRouter(Header)
