import React, {PureComponent} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const {TreeNode} = Tree

const Item = Form.Item


export default class UpdateForm extends PureComponent {

    static propTypes = {
        role: PropTypes.object,
        onRef: PropTypes.func
    }


    constructor(props) {
        super(props)
        const {menus} = this.props.role
        console.log(menus)

        this.state = {
            checkedKeys: menus,
            selectedKeys: []
        }
    }

    getMenus = () => {

        const {checkedKeys} = this.state
        return checkedKeys
    }


    componentWillMount = () => {
        this.treeNodes = this.getTreeNode(menuList)
    }

    componentDidMount = () => {
        this.props.onRef(this)
        const {menus} = this.props.role
        console.log(menus)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        //當組件按收到新props調用,在render之前
        const menus = nextProps.role.menus
        // console.log(menus)
        this.setState({checkedKeys: menus})//會令render重新執行
    }

    onExpand = expandedKeys => {
        // console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        // this.setState({
        //     expandedKeys,
        //     autoExpandParent: false,
        // })
    }

    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
    }

    onSelect = (selectedKeys, info) => {
        // console.log('onSelect', selectedKeys, info);
        // this.setState({selectedKeys});
    }

    getTreeNode = (menuList) => {
        menuList = menuList.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.getTreeNode(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.key} title={item.title}/>
        })
        return menuList
    }


    render() {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 15}
        }
        const {role} = this.props


        return (
            <div>
                <Item label='角色名稱' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onExpand={this.onExpand}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}

                >
                    <TreeNode title='平台權限' key='all'>
                        {this.treeNodes}
                    </TreeNode>

                </Tree>

            </div>

        )
    }

}


