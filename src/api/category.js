import request from '@/utils/request'

// 获取所有分类
export function getCategories() {
    return request({
        url: '/categories',
        method: 'get'
    })
}

// 根据ID获取分类
export function getCategoryById(id) {
    return request({
        url: '/categories/' + id,
        method: 'get'
    })
}

// 添加分类
export function addCategory(data) {
    return request({
        url: '/categories',
        method: 'post',
        data
    })
}

// 更新分类
export function updateCategory(data) {
    return request({
        url: '/categories',
        method: 'put',
        data
    })
}

// 删除分类
export function deleteCategory(id) {
    return request({
        url: '/categories/' + id,
        method: 'delete'
    })
}
