import request from '@/utils/request'

export function getCart() {
    return request({
        url: '/cart/list',
        method: 'get'
    })
}

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

export function removeFromCart(cartId) {
    return request({
        url: '/cart/' + cartId,
        method: 'delete'
    })
}

export function clearCart() {
    return request({
        url: '/cart',
        method: 'post',
        data: {
            action: 'clear'
        }
    })
}

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

export function getCartTotal() {
    return request({
        url: '/cart/total',
        method: 'get'
    })
}
