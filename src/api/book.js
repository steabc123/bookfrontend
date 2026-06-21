import request from '@/utils/request'

export function getBooks() {
    return request({
        url: '/books',
        method: 'get'
    })
}

export function searchBooks(keyword) {
    return request({
        url: '/books',
        method: 'get',
        params: { keyword }
    })
}

export function getBookById(id) {
    return request({
        url: '/books/' + id,
        method: 'get'
    })
}

export function addBook(data) {
    return request({
        url: '/books',
        method: 'post',
        data
    })
}

export function updateBook(data) {
    return request({
        url: '/books',
        method: 'put',
        data
    })
}

export function deleteBook(id) {
    return request({
        url: '/books/' + id,
        method: 'delete'
    })
}
