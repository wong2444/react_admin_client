import React, {Component} from 'react'
import {Button} from "antd";

export default class LinkButton extends Component {
    render() {
        return (<Button><a onClick={this.props.onClick}>{this.props.children}</a></Button>)
    }

}
