/*
* 包含所有接口請求函數
* */
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

export const reqLogin = (username, password) => {
    return ajax('/login', {username, password}, 'POST')
}

export const reqAddUser = (user) => ajax('/manager/user/add', user, 'POST')

export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                message.error('獲取天氣失敗')
            }
        })
    })
}
//獲取一級/二級分類列表
export const reqCategory = (parentId) => ajax('/manage/category/list', {parentId})

export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId}, 'POST')

export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')

export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

//搜索商品分頁列表
export const reqSearchProducts = ({pageNum, pageSize, searchName, productName, productDesc}) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    searchName,
    productName,
    productDesc
})

export const reqUpdateStatus = ({productId, status}) => ajax('/manage/product/updateStatus', {
    productId,
    status
}, 'POST')

export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

export const reqProductAddOrUpdate = (product) => {
    let url = product._id ? 'update' : 'add'
    return ajax(`/manage/product/${url}`, product, 'POST')
}

export const reqRoles = () => ajax('/manage/role/list', {})
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')


export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

export const reqUsers = () => ajax('/manage/user/list', {})

export const reqDeleteUsers = (userId) => ajax('/manage/user/delete', {userId},'POST')

export const reqUserAddOrUpdate = (user) => {
    let url = user._id ? 'update' : 'add'
    return ajax(`/manage/user/${url}`, user, 'POST')
}
