<template>
  <div class="orders-container">
    <header class="header">
      <h1>线上書阁 - 我的借阅</h1>
      <nav>
        <router-link to="/books">图书列表</router-link>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/my-borrows" class="active">我的借阅</router-link>
        <router-link to="/my-orders">我的订单</router-link>
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

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.recordId" class="order-card">
          <div class="order-header">
            <span class="order-id">订单号：{{ order.recordId }}</span>
            <span :class="order.borrowStatus === 0 ? 'status-borrowing' : 'status-returned'">
              {{ order.borrowStatus === 0 ? '借阅中' : '已归还' }}
            </span>
          </div>
          <div class="order-body">
            <div class="book-name">{{ order.bookName || '未知图书' }}</div>
            <div class="order-info">
              <span>借阅时间：{{ formatDate(order.borrowTime) }}</span>
              <span v-if="order.returnTime">归还时间：{{ formatDate(order.returnTime) }}</span>
            </div>
          </div>
          <div class="order-actions" v-if="order.borrowStatus === 0">
            <button @click="handleReturn(order.recordId)" class="btn-return">归还图书</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getCurrentBorrows, returnBook } from '@/api/borrow'
import { getBookById } from '@/api/book'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyOrders',
  data() {
    return {
      orders: [],
      loading: true,
      currentUserId: null,
      currentUserRole: null
    }
  },
  created() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      try {
        // 获取当前用户信息
        const userRes = await getCurrentUser()
        this.currentUserId = userRes.data.userId || userRes.data.id
        this.currentUserRole = userRes.data.role
        
        console.log('当前用户ID:', this.currentUserId, '角色:', this.currentUserRole)
        
        // 获取所有借阅记录
        const res = await getCurrentBorrows()
        const allBorrows = res.data || []
        
        // root用户可以看到所有借阅记录
        if (this.currentUserRole === 'admin') {
          this.orders = allBorrows
        } else {
          // 普通用户只能看到自己的借阅记录
          this.orders = allBorrows.filter(borrow => {
            const borrowUserId = borrow.userId || borrow.user_id
            return borrowUserId === this.currentUserId
          })
        }
        
        console.log('过滤后的借阅记录数据:', this.orders)
        
        // 为每条记录获取图书名称
        for (let order of this.orders) {
          if (order.bookId && !order.bookName) {
            try {
              const bookRes = await getBookById(order.bookId)
              order.bookName = bookRes.data.bookName
            } catch (error) {
              console.error('获取图书信息失败:', error)
              order.bookName = '未知图书'
            }
          }
        }
      } catch (error) {
        console.error('加载订单失败:', error)
        alert('加载订单失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    async handleReturn(recordId) {
      if (!confirm('确定要归还这本图书吗？')) return
      try {
        await returnBook(recordId)
        alert('归还成功')
        this.loadOrders()
      } catch (error) {
        alert('归还失败：' + error.message)
      }
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
.orders-container {
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

.status-borrowing {
  color: #ff9800;
  font-weight: bold;
}

.status-returned {
  color: #4caf50;
  font-weight: bold;
}

.order-body {
  padding: 20px;
}

.book-name {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #666;
  font-size: 14px;
}

.order-actions {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-return {
  padding: 8px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-return:hover {
  background: #1976d2;
}
</style>
