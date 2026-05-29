import request from '@/utils/request'

// 获取所有图书
export function getBooks() {
    return request({
        url: '/books',
        method: 'get'
    })
}

// 搜索图书
export function searchBooks(keyword) {
    return request({
        url: '/books',
        method: 'get',
        params: { keyword }
    })
}

// 根据ID获取图书
export function getBookById(id) {
    return request({
        url: '/books/' + id,
        method: 'get'
    })
}

// 添加图书
export function addBook(data) {
    return request({
        url: '/books',
        method: 'post',
        data
    })
}

// 更新图书
export function updateBook(data) {
    return request({
        url: '/books',
        method: 'put',
        data
    })
}

// 删除图书
export function deleteBook(id) {
    return request({
        url: '/books/' + id,
        method: 'delete'
    })
}
