import storageUtils from "../utils/storageUtils";
import {combineReducers} from 'redux'
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'

const initHeadTitle = '首頁'

function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getUser()

function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.data
        case SHOW_ERROR_MSG:
            return {errorMsg: action.data}
        case RESET_USER:
            return action.data
        default:
            return state
    }
}


export default combineReducers({
    headTitle, user
})
