<template>
  <div class="my-orders-container">
    <header class="header">
      <h1>线上书阁 - 我的订单</h1>
      <nav>
        <router-link to="/books">图书列表</router-link>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/my-borrows">我的借阅</router-link>
        <router-link to="/my-orders" class="active">我的订单</router-link>
        <router-link to="/profile">个人中心</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="orders.length === 0" class="empty-orders">
        <p>暂无订单记录</p>
        <router-link to="/books" class="back-btn">去浏览图书</router-link>
      </div>

      <div v-else>
        <!-- 订单状态筛选 -->
        <div class="filter-tabs">
          <button 
            :class="{ active: currentFilter === 'all' }" 
            @click="currentFilter = 'all'"
          >全部</button>
          <button 
            :class="{ active: currentFilter === 0 }" 
            @click="currentFilter = 0"
          >未支付</button>
          <button 
            :class="{ active: currentFilter === 1 }" 
            @click="currentFilter = 1"
          >未发货</button>
          <button 
            :class="{ active: currentFilter === 2 }" 
            @click="currentFilter = 2"
          >已发货</button>
          <button 
            :class="{ active: currentFilter === 3 }" 
            @click="currentFilter = 3"
          >已收货</button>
        </div>

        <div class="orders-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span :class="getStatusClass(order.orderStatus)">
                {{ getStatusText(order.orderStatus) }}
              </span>
            </div>
            
            <div class="order-body">
              <div v-for="(item, index) in order.items" :key="index" class="order-item">
                <div class="item-info">
                  <span class="item-name">{{ item.bookName }}</span>
                  <span class="item-detail">¥{{ item.price ? item.price.toFixed(2) : '0.00' }} x {{ item.quantity }}</span>
                </div>
              </div>
              
              <div class="order-summary">
                <span>下单时间：{{ formatDate(order.createTime) }}</span>
                <span class="total-amount">总金额：¥{{ order.totalAmount ? order.totalAmount.toFixed(2) : '0.00' }}</span>
              </div>
            </div>
            
            <div class="order-actions">
              <button 
                v-if="order.orderStatus === 0" 
                @click="handlePay(order.id)"
                class="btn-pay"
              >立即支付</button>
              <button 
                v-if="order.orderStatus === 0" 
                @click="handleCancel(order.id)"
                class="btn-cancel"
              >取消订单</button>
              <button 
                v-if="order.orderStatus === 2" 
                @click="handleReceive(order.id)"
                class="btn-receive"
              >确认收货</button>
              <button 
                v-if="order.orderStatus === 3" 
                @click="handleDelete(order.id)"
                class="btn-delete"
              >删除订单</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getMyOrders, payOrder, cancelOrder, confirmReceive, deleteOrder } from '@/api/order'

export default {
  name: 'UserOrders',
  data() {
    return {
      orders: [],
      loading: true,
      currentFilter: 'all'
    }
  },
  computed: {
    filteredOrders() {
      if (this.currentFilter === 'all') {
        return this.orders
      }
      return this.orders.filter(order => order.orderStatus === this.currentFilter)
    }
  },
  created() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      try {
        const res = await getMyOrders()
        this.orders = res.data || []
        console.log('订单数据:', this.orders)
        if (this.orders.length > 0) {
          console.log('第一个订单的键:', Object.keys(this.orders[0]))
          console.log('第一个订单数据:', this.orders[0])
        }
      } catch (error) {
        console.error('加载订单失败:', error)
        // 后端接口未实现时，显示提示信息
        if (error.response && error.response.status === 404) {
          alert('订单功能需要后端支持，请联系后端开发人员实现订单相关接口')
          this.orders = []
        } else {
          alert('加载订单失败：' + error.message)
        }
      } finally {
        this.loading = false
      }
    },
    async handlePay(orderId) {
      if (!confirm('确认支付该订单吗？')) return
      try {
        await payOrder(orderId)
        alert('支付成功')
        this.loadOrders()
      } catch (error) {
        alert('支付失败：' + error.message)
      }
    },
    async handleCancel(orderId) {
      if (!confirm('确认取消该订单吗？')) return
      try {
        await cancelOrder(orderId)
        alert('订单已取消')
        this.loadOrders()
      } catch (error) {
        alert('取消失败：' + error.message)
      }
    },
    async handleReceive(orderId) {
      if (!confirm('确认已收到商品吗？')) return
      try {
        await confirmReceive(orderId)
        alert('确认收货成功')
        this.loadOrders()
      } catch (error) {
        alert('操作失败：' + error.message)
      }
    },
    async handleDelete(orderId) {
      if (!confirm('确认删除该订单吗？')) return
      try {
        await deleteOrder(orderId)
        alert('订单已删除')
        this.loadOrders()
      } catch (error) {
        alert('删除失败：' + error.message)
      }
    },
    getStatusText(status) {
      const statusMap = {
        0: '未支付',
        1: '未发货',
        2: '已发货',
        3: '已收货'
      }
      return statusMap[status] || '未知状态'
    },
    getStatusClass(status) {
      const classMap = {
        0: 'status-unpaid',
        1: 'status-unshipped',
        2: 'status-shipped',
        3: 'status-received'
      }
      return classMap[status] || ''
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.my-orders-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: url('~@/assets/background.jpg') center/cover no-repeat;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
}

.header h1 {
  margin: 0;
  font-family: '楷体', 'KaiTi', 'STKaiti', serif;
}

.header nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

.header nav a {
  color: black;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background 0.3s;
}

.header nav a:hover,
.header nav a.router-link-active,
.header nav a.active {
  background: rgba(255,255,255,0.2);
}

.header nav button {
  background: rgba(255,255,255,0.2);
  color: black;
  border: 1px solid rgba(0,0,0,0.3);
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.main-content {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.empty-orders {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.empty-orders p {
  font-size: 18px;
  color: #999;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #5568d3;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-tabs button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tabs button:hover {
  background: #f5f5f5;
}

.filter-tabs button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.orders-list {
  display: grid;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.order-header {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.status-unpaid {
  color: #ff9800;
  font-weight: bold;
}

.status-unshipped {
  color: #2196f3;
  font-weight: bold;
}

.status-shipped {
  color: #9c27b0;
  font-weight: bold;
}

.status-received {
  color: #4caf50;
  font-weight: bold;
}

.order-body {
  padding: 20px;
}

.order-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 16px;
  color: #333;
}

.item-detail {
  color: #666;
  font-size: 14px;
}

.order-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.total-amount {
  color: #f44336;
  font-size: 18px;
  font-weight: bold;
}

.order-actions {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-pay,
.btn-cancel,
.btn-receive,
.btn-delete {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-pay {
  background: #f44336;
  color: white;
}

.btn-pay:hover {
  background: #d32f2f;
}

.btn-cancel {
  background: #ccc;
  color: #333;
}

.btn-cancel:hover {
  background: #bbb;
}

.btn-receive {
  background: #4caf50;
  color: white;
}

.btn-receive:hover {
  background: #45a049;
}

.btn-delete {
  background: #999;
  color: white;
}

.btn-delete:hover {
  background: #777;
}
</style>
