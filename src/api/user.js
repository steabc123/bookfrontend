import request from '@/utils/request'

export function getUsers() {
    return request({
        url: '/users/all',
        method: 'get'
    })
}

export function login(data) {
    return request({
        url: '/users?action=login',
        method: 'post',
        data
    })
}

export function register(data) {
    return request({
        url: '/users?action=register',
        method: 'post',
        data
    })
}

export function getCurrentUser() {
    return request({
        url: '/users',
        method: 'get'
    })
}

export function getUserById(id) {
    return request({
        url: '/users/' + id,
        method: 'get'
    })
}

export function updateUser(data) {
    return request({
        url: '/users?action=update',
        method: 'put',
        data
    })
}

export function deleteUser(id) {
    return request({
        url: '/users/' + id,
        method: 'delete'
    })
}

export function addUser(data) {
    return request({
        url: '/users?action=addUser',
        method: 'post',
        data
    })
}

export function changePassword(data) {
    return request({
        url: '/users?action=changePassword',
        method: 'put',
        data
    })
}
