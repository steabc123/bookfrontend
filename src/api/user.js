import request from '@/utils/request'

// 获取所有用户
export function getUsers() {
    return request({
        url: '/users/all',
        method: 'get'
    })
}

// 用户登录
export function login(data) {
    return request({
        url: '/users?action=login',
        method: 'post',
        data
    })
}

// 用户注册
export function register(data) {
    return request({
        url: '/users?action=register',
        method: 'post',
        data
    })
}

// 获取当前用户信息
export function getCurrentUser() {
    return request({
        url: '/users',
        method: 'get'
    })
}

// 根据ID获取用户
export function getUserById(id) {
    return request({
        url: '/users/' + id,
        method: 'get'
    })
}

// 更新用户
export function updateUser(data) {
    return request({
        url: '/users',
        method: 'put',
        data
    })
}

// 删除用户
export function deleteUser(id) {
    return request({
        url: '/users/' + id,
        method: 'delete'
    })
}
