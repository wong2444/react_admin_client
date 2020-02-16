import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'

import {reqLogin} from '../api'
import storageUtils from "../utils/storageUtils";

export const set_head_title = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})
export const receive_user = (user) => ({type: RECEIVE_USER, data: user})
export const show_error_msg = (errMsg) => ({type: SHOW_ERROR_MSG, data: errMsg})


export const logout = () => {
    //刪除local中的user
    storageUtils.removeUser()

    return {type: RESET_USER, data: {}}
}

export const login = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password)
        if (result.status === 0) {
            const user = result.data
            storageUtils.saveUser(user)
            dispatch(receive_user(user))
        } else {
            const msg = result.msg
            dispatch(show_error_msg(msg))

        }
    }
}
