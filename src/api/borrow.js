import request from '@/utils/request'

export function getAllBorrows() {
    return request({
        url: '/borrows',
        method: 'get'
    })
}

export function getMyBorrows() {
    return request({
        url: '/borrows/my',
        method: 'get'
    })
}

export function getCurrentBorrows() {
    return request({
        url: '/borrows/current',
        method: 'get'
    })
}

export function getBorrowsByUserId(userId) {
    return request({
        url: '/borrows/user/' + userId,
        method: 'get'
    })
}

export function borrowBook(bookId) {
    return request({
        url: '/borrows',
        method: 'post',
        data: {
            action: 'borrow',
            bookId: bookId
        }
    })
}

export function returnBook(recordId) {
    return request({
        url: '/borrows',
        method: 'post',
        data: {
            action: 'return',
            recordId: recordId
        }
    })
}
