import request from '@/utils/request'

// 获取当前用户的订单列表
export function getMyOrders() {
    return request({
        url: '/orders/my',
        method: 'get'
    })
}

// 获取所有订单（管理员）
export function getAllOrders() {
    return request({
        url: '/orders/all',
        method: 'get'
    })
}

// 创建订单（从购物车结算）
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

// 支付订单
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

// 发货（管理员）
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

// 确认收货
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

// 取消订单
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

// 删除订单
export function deleteOrder(orderId) {
    console.log('删除订单 - orderId:', orderId, '类型:', typeof orderId)
    return request({
        url: '/orders/' + orderId,
        method: 'delete'
    })
}
