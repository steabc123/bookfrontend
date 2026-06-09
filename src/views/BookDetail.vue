<template>
  <div class="book-detail-container">
    <header class="header">
      <h1>线上書阁 - 书籍详情</h1>
      <nav>
        <router-link to="/books">图书列表</router-link>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/my-borrows">我的借阅</router-link>
        <router-link to="/my-orders">我的订单</router-link>
        <router-link to="/profile">个人中心</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="book" class="book-detail">
        <div class="book-info">
          <div class="book-cover">
            <img 
              :src="getBookImage(book.id)" 
              :alt="book.bookName" 
              class="book-large-image"
              @error="handleImageError"
            />
          </div>
          <div class="book-text-info">
            <h2>{{ book.bookName }}</h2>
            <div class="detail-item">
              <span class="label">作者：</span>
              <span class="value">{{ book.author }}</span>
            </div>
            <div class="detail-item">
              <span class="label">出版社：</span>
              <span class="value">{{ book.publisher || '暂无' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">ISBN：</span>
              <span class="value">{{ book.isbn }}</span>
            </div>
            <div class="detail-item">
              <span class="label">价格：</span>
              <span class="value price">¥{{ book.price ? book.price.toFixed(2) : '0.00' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">库存：</span>
              <span class="value" :class="{ 'low-stock': book.stock < 10 }">{{ book.stock }}</span>
            </div>
            <div class="detail-item">
              <span class="label">分类：</span>
              <span class="value">{{ getCategoryName(book.categoryId) }}</span>
            </div>
            
            <div class="actions">
              <button @click="handleAddToCart" class="btn-cart">加入购物车</button>
              <button @click="handleBorrow" class="btn-borrow">借阅</button>
              <button @click="$router.back()" class="btn-back">返回</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="error">
        <p>未找到该书籍</p>
        <router-link to="/books" class="back-btn">返回图书列表</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { getBookById } from '@/api/book'
import { borrowBook } from '@/api/borrow'
import { addToCart } from '@/api/cart'
import { getCategories } from '@/api/category'

export default {
  name: 'BookDetail',
  data() {
    return {
      book: null,
      categories: [],
      loading: true
    }
  },
  created() {
    this.loadBookDetail()
    this.loadCategories()
  },
  methods: {
    async loadBookDetail() {
      try {
        const bookId = this.$route.params.id
        const res = await getBookById(bookId)
        this.book = res.data
      } catch (error) {
        console.error('加载书籍详情失败:', error)
        alert('加载书籍详情失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    async loadCategories() {
      try {
        const res = await getCategories()
        this.categories = res.data || []
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.categoryId === categoryId)
      return category ? category.categoryName : '未分类'
    },
    handleImageError(event) {
      // 图片加载失败时显示默认占位图
      event.target.src = require('@/assets/logo.png')
    },
    getBookImage(bookId) {
      // 根据图书ID获取对应的图片路径
      return `/book_img/${bookId}.jpg`
    },
    async handleAddToCart() {
      try {
        await addToCart({
          bookId: this.book.id,
          bookName: this.book.bookName,
          author: this.book.author,
          price: this.book.price,
          quantity: 1
        })
        alert('已加入购物车')
      } catch (error) {
        alert('加入购物车失败：' + error.message)
      }
    },
    async handleBorrow() {
      try {
        await borrowBook(this.book.id)
        alert('借阅成功')
      } catch (error) {
        alert('借阅失败：' + error.message)
      }
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
.book-detail-container {
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
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.error p {
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

.book-detail {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-info {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.book-cover {
  flex-shrink: 0;
}

.book-large-image {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.book-text-info {
  flex: 1;
}

.book-info h2 {
  margin-top: 0;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.detail-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.detail-item .label {
  font-weight: bold;
  color: #666;
  margin-right: 10px;
}

.detail-item .value {
  color: #333;
}

.detail-item .price {
  color: #f44336;
  font-size: 24px;
  font-weight: bold;
}

.low-stock {
  color: #ff9800;
  font-weight: bold;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.btn-cart,
.btn-borrow,
.btn-back {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-cart {
  background: #9c27b0;
  color: white;
}

.btn-cart:hover {
  background: #7b1fa2;
}

.btn-borrow {
  background: #2196f3;
  color: white;
}

.btn-borrow:hover {
  background: #1976d2;
}

.btn-back {
  background: #ccc;
  color: #333;
}

.btn-back:hover {
  background: #bbb;
}

@media (max-width: 768px) {
  .book-info {
    flex-direction: column;
    gap: 20px;
  }
  
  .book-large-image {
    width: 100%;
    height: auto;
    max-width: 300px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-cart,
  .btn-borrow,
  .btn-back {
    width: 100%;
  }
}
</style>
