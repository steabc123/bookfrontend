import request from '@/utils/request'

// 获取所有借阅记录
export function getAllBorrows() {
    return request({
        url: '/borrows',
        method: 'get'
    })
}

// 获取我的借阅记录
export function getMyBorrows() {
    return request({
        url: '/borrows/my',
        method: 'get'
    })
}

// 获取当前借阅记录（管理员使用，返回所有记录）
export function getCurrentBorrows() {
    return request({
        url: '/borrows/current',
        method: 'get'
    })
}

// 根据用户ID获取借阅记录
export function getBorrowsByUserId(userId) {
    return request({
        url: '/borrows/user/' + userId,
        method: 'get'
    })
}

// 借书
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

// 还书
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
