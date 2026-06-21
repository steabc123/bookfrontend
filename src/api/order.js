import request from '@/utils/request'

export function getMyOrders() {
    return request({
        url: '/orders/my',
        method: 'get'
    })
}

export function getAllOrders() {
    return request({
        url: '/orders/all',
        method: 'get'
    })
}

export function createOrder(cartItems) {
    return request({
        url: '/orders',
        method: 'post',
        data: {
            action: 'create',
            items: cartItems
        }
    })
}

export function payOrder(orderId) {
    console.log('支付订单 - orderId:', orderId, '类型:', typeof orderId)
    return request({
        url: '/orders',
        method: 'post',
        data: {
            action: 'pay',
            orderId: Number(orderId)
        }
    })
}

export function shipOrder(orderId) {
    return request({
        url: '/orders',
        method: 'post',
        data: {
            action: 'ship',
            orderId: Number(orderId)
        }
    })
}

export function confirmReceive(orderId) {
    return request({
        url: '/orders',
        method: 'post',
        data: {
            action: 'receive',
            orderId: Number(orderId)
        }
    })
}

export function cancelOrder(orderId) {
    console.log('取消订单 - orderId:', orderId, '类型:', typeof orderId)
    return request({
        url: '/orders',
        method: 'post',
        data: {
            action: 'cancel',
            orderId: Number(orderId)
        }
    })
}

export function deleteOrder(orderId) {
    console.log('删除订单 - orderId:', orderId, '类型:', typeof orderId)
    return request({
        url: '/orders/' + orderId,
        method: 'delete'
    })
}
