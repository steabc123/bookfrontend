import request from '@/utils/request'

// 获取购物车列表
export function getCart() {
    return request({
        url: '/cart/list',
        method: 'get'
    })
}

// 添加图书到购物车
export function addToCart(bookData) {
    return request({
        url: '/cart',
        method: 'post',
        data: {
            action: 'add',
            ...bookData
        }
    })
}

// 从购物车移除图书
export function removeFromCart(cartId) {
    return request({
        url: '/cart/' + cartId,
        method: 'delete'
    })
}

// 清空购物车
export function clearCart() {
    return request({
        url: '/cart',
        method: 'post',
        data: {
            action: 'clear'
        }
    })
}

// 更新购物车商品数量
export function updateCartQuantity(cartItemId, quantity) {
    return request({
        url: '/cart',
        method: 'put',
        data: {
            cartItemId,
            quantity
        }
    })
}

// 获取购物车总金额
export function getCartTotal() {
    return request({
        url: '/cart/total',
        method: 'get'
    })
}
