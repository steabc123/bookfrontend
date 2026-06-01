<template>
  <div class="borrows-container">
    <header class="header">
      <h1>线上書阁 - 后台管理</h1>
      <nav>
        <router-link to="/admin/orders">订单管理</router-link>
        <router-link to="/admin/books">图书管理</router-link>
        <router-link to="/admin/categories">分类管理</router-link>
        <router-link to="/admin/borrows" class="active">借阅管理</router-link>
        <router-link to="/admin/users">用户管理</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="toolbar">
        <button @click="loadBorrows">刷新</button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>记录ID</th>
          <th>用户ID</th>
          <th>图书名称</th>
          <th>借阅时间</th>
          <th>归还时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="record in borrows" :key="record.recordId">
          <td>{{ record.recordId }}</td>
          <td>{{ record.userId }}</td>
          <td>{{ record.bookName || '加载中...' }}</td>
          <td>{{ formatDate(record.borrowTime) }}</td>
          <td>{{ record.returnTime ? formatDate(record.returnTime) : '-' }}</td>
          <td>
              <span :class="record.borrowStatus === 0 ? 'status-borrowing' : 'status-returned'">
                {{ record.borrowStatus === 0 ? '已借出' : '已归还' }}
              </span>
          </td>
          <td>
            <button
                v-if="record.borrowStatus === 0"
                @click="handleReturn(record.recordId)"
                class="btn-return"
            >
              归还
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script>
import { getAllBorrows, returnBook } from '@/api/borrow'
import { getBookById } from '@/api/book'

export default {
  name: 'BorrowList',
  data() {
    return {
      borrows: []
    }
  },

  created() {
    this.loadBorrows()
  },
  methods: {
    async loadBorrows() {
      try {
        const res = await getAllBorrows()
        this.borrows = res.data
        console.log('借阅记录原始数据:', this.borrows)
        // 为每条记录获取图书名称
        for (let record of this.borrows) {
          console.log('记录ID:', record.recordId, '状态值:', record.borrowStatus, '状态类型:', typeof record.borrowStatus)
          if (record.bookId && !record.bookName) {
            try {
              const bookRes = await getBookById(record.bookId)
              record.bookName = bookRes.data.bookName
            } catch (error) {
              record.bookName = '未知图书'
            }
          }
        }
      } catch (error) {
        alert('加载借阅记录失败：' + error.message)
      }
    },
    async handleReturn(recordId) {
      if (!confirm('确定要归还这本图书吗？')) return
      try {
        console.log('归还请求 - recordId:', recordId)
        const res = await returnBook(recordId)
        console.log('归还响应:', res)
        alert('归还成功')
        this.loadBorrows()
      } catch (error) {
        console.error('归还错误:', error)
        alert('归还失败：' + error.message)
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      
      // 直接使用 toLocaleString 并指定时区为亚洲/上海（北京时间）
      // 这样无论后端返回的是什么格式，都会正确显示为北京时间
      const date = new Date(dateString)
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        console.warn('无效的日期格式:', dateString)
        return dateString
      }
      
      // 使用北京时间时区格式化
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
.borrows-container {
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
.header nav a.router-link-active {
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

.data-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

.status-borrowing {
  color: #ff9800;
  font-weight: bold;
}

.status-returned {
  color: #4caf50;
  font-weight: bold;
}

.btn-return {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  background: #2196f3;
  color: white;
}
</style>
