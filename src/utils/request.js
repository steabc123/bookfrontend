import axios from 'axios'

// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:8080/LibraryManagementSystem/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: true  // 重要：允许携带cookie（session）
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        console.log('响应数据:', res)
        // 如果后端返回的是成功响应（可能没有 code 字段）
        if (res.code !== undefined && res.code !== 200) {
            console.error('响应错误:', res.message)
            if (res.code === 401) {
                console.warn('用户未登录，请先登录')
            }
            return Promise.reject(new Error(res.message || '请求失败'))
        }
        return res
    },
    error => {
        console.error('响应错误:', error.message)
        if (error.response) {
            console.error('错误响应详情:', error.response.data)
            switch (error.response.status) {
                case 401:
                    console.error('未授权，请重新登录')
                    break
                case 403:
                    console.error('拒绝访问')
                    break
                case 404:
                    console.error('请求地址不存在')
                    break
                case 500:
                    console.error('服务器内部错误')
                    break
                default:
                    console.error('连接错误' + error.response.status)
            }
        } else {
            console.error('网络异常，请检查网络连接')
        }
        return Promise.reject(error)
    }
)

export default request
