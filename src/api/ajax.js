import axios from 'axios'
import {message} from 'antd'

const ajax = (url, data = {}, type = 'GET') => {
    //在外層自己包裝一層promise,用於處理axios返回的promise異常,不拋出異常到主程序中,而是打印他
    return new Promise((resolve, reject) => {
            let promise
            if (type === 'GET') {
                promise = axios.get(url, {params: data})

            } else {
                promise = axios.post(url, data)

            }
            promise.then(response => resolve(response.data)).catch(err => message.error(err.message))
        }
    )


}
export default ajax
