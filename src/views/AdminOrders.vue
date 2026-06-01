<template>
  <div class="admin-orders-container">
    <header class="header">
      <h1>线上書阁 - 后台管理</h1>
      <nav>
        <router-link to="/admin/orders" class="active">订单管理</router-link>
        <router-link to="/admin/books">图书管理</router-link>
        <router-link to="/admin/categories">分类管理</router-link>
        <router-link to="/admin/borrows">借阅管理</router-link>
        <router-link to="/admin/users">用户管理</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="toolbar">
        <button @click="loadAllOrders">刷新</button>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="allOrders.length === 0" class="empty-orders">
        <p>暂无订单数据</p>
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

        <!-- 按用户分组的订单数据 -->
        <div v-for="(userOrders, username) in groupedOrders" :key="username" class="user-order-section">
          <div class="user-header">
            <h3>用户：{{ username }}</h3>
            <span class="order-count">共 {{ userOrders.length }} 个订单</span>
          </div>
          
          <div v-for="order in userOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span :class="getStatusClass(order.orderStatus)">
                {{ getStatusText(order.orderStatus) }}
              </span>
            </div>
            
            <table class="data-table">
              <thead>
                <tr>
                  <th>书名</th>
                  <th>价格</th>
                  <th>数量</th>
                  <th>小计</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in order.items" :key="index">
                  <td>{{ item.bookName }}</td>
                  <td>¥{{ item.price ? item.price.toFixed(2) : '0.00' }}</td>
                  <td>{{ item.quantity || 1 }}</td>
                  <td>¥{{ ((item.price || 0) * (item.quantity || 1)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="order-footer">
              <span>下单时间：{{ formatDate(order.createTime) }}</span>
              <span class="total-amount">总金额：¥{{ order.totalAmount ? order.totalAmount.toFixed(2) : '0.00' }}</span>
            </div>
            
            <div class="order-actions">
              <button 
                v-if="order.orderStatus === 1" 
                @click="handleShip(order.id)"
                class="btn-ship"
              >发货</button>
              <button 
                @click="handleDelete(order.id)"
                class="btn-delete"
              >删除</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getAllOrders, shipOrder, deleteOrder } from '@/api/order'

export default {
  name: 'AdminOrders',
  data() {
    return {
      allOrders: [],
      loading: true,
      currentFilter: 'all'
    }
  },
  computed: {
    // 按用户名分组订单数据
    groupedOrders() {
      const groups = {}
      this.filteredOrders.forEach(order => {
        const username = order.username || '未知用户'
        if (!groups[username]) {
          groups[username] = []
        }
        groups[username].push(order)
      })
      return groups
    },
    // 根据筛选条件过滤订单
    filteredOrders() {
      if (this.currentFilter === 'all') {
        return this.allOrders
      }
      return this.allOrders.filter(order => order.orderStatus === this.currentFilter)
    }
  },
  created() {
    this.loadAllOrders()
  },
  methods: {
    async loadAllOrders() {
      try {
        this.loading = true
        const res = await getAllOrders()
        this.allOrders = res.data || []
      } catch (error) {
        console.error('加载订单数据失败:', error)
        // 后端接口未实现时，显示提示信息
        if (error.response && error.response.status === 404) {
          alert('订单管理功能需要后端支持，请联系后端开发人员实现订单相关接口')
          this.allOrders = []
        } else {
          alert('加载订单数据失败：' + error.message)
        }
      } finally {
        this.loading = false
      }
    },
    async handleShip(orderId) {
      if (!confirm('确认发货该订单吗？')) return
      try {
        await shipOrder(orderId)
        alert('发货成功')
        this.loadAllOrders()
      } catch (error) {
        alert('发货失败：' + error.message)
      }
    },
    async handleDelete(orderId) {
      if (!confirm('确认删除该订单吗？')) return
      try {
        await deleteOrder(orderId)
        alert('订单已删除')
        this.loadAllOrders()
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
.admin-orders-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: url(/src/views/background.jpg) center/cover no-repeat;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toolbar button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

.user-order-section {
  margin-bottom: 30px;
}

.user-header {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #667eea;
  margin-bottom: 15px;
  border-radius: 10px;
}

.user-header h3 {
  margin: 0;
  color: #333;
}

.order-count {
  color: #666;
  font-size: 14px;
}

.order-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
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

.data-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8f9fa;
  font-weight: bold;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.order-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
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

.btn-ship,
.btn-delete {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-ship {
  background: #4caf50;
  color: white;
}

.btn-ship:hover {
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
