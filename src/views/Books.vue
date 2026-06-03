<template>
  <div class="books-container">
    <header class="header">
      <h1>线上書阁</h1>
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
      <div class="toolbar">
        <input
            type="text"
            v-model="searchKeyword"
            placeholder="搜索图书..."
            @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">搜索</button>
        <button @click="loadBooks">刷新</button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>封面</th>
          <th>书名</th>
          <th>作者</th>
          <th>出版社</th>
          <th>ISBN</th>
          <th>金额</th>
          <th>库存</th>
          <th>分类</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.id }}</td>
          <td>
            <img 
              :src="getBookImage(book.id)" 
              :alt="book.bookName" 
              class="book-thumbnail"
              @error="handleImageError"
            />
          </td>
          <td>{{ book.bookName }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.publisher || '-' }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.price ? '¥' + book.price : '-' }}</td>
          <td>{{ book.stock }}</td>
          <td>{{ getCategoryName(book.categoryId) }}</td>
          <td>
            <button @click="handleViewDetail(book.id)" class="btn-detail">查看详情</button>
            <button @click="handleBorrow(book.id)" class="btn-borrow">借阅</button>
            <button 
                v-if="isBookBorrowed(book.id)" 
                @click="handleReturnBook(book.id)" 
                class="btn-return-book"
            >归还</button>
            <button @click="handleAddToCart(book)" class="btn-cart">加入购物车</button>
          </td>
        </tr>
        </tbody>
      </table>
    </main>


  </div>
</template>

<script>
import { getBooks, searchBooks } from '@/api/book'
import { borrowBook, returnBook, getCurrentBorrows } from '@/api/borrow'
import { getCategories } from '@/api/category'
import { addToCart } from '@/api/cart'

export default {
  name: 'BookList',
  data() {
    return {
      books: [],
      categories: [],
      searchKeyword: '',
      userBorrows: [] // 当前用户的借阅记录
    }
  },
  computed: {},
  created() {
    this.loadBooks()
    this.loadUserBorrows()
    this.loadCategories()
  },
  methods: {
    async loadBooks() {
      try {
        const res = await getBooks()
        this.books = res.data.sort((a, b) => a.id - b.id)
      } catch (error) {
        alert('加载图书失败：' + error.message)
      }
    },
    async loadUserBorrows() {
      try {
        const res = await getCurrentBorrows()
        this.userBorrows = res.data || []
      } catch (error) {
        console.error('加载借阅记录失败:', error)
        this.userBorrows = []
      }
    },
    async loadCategories() {
      try {
        const res = await getCategories()
        this.categories = res.data || []
        console.log('加载到的分类数据:', this.categories)
      } catch (error) {
        console.error('加载分类失败:', error)
        this.categories = []
      }
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.categoryId === categoryId)
      return category ? category.categoryName : (categoryId || '未分类')
    },
    isBookBorrowed(bookId) {
      const borrowRecord = this.userBorrows.find(b => b.bookId === bookId)
      if (!borrowRecord) return false
      return borrowRecord.borrowStatus === 0
    },
    async handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.loadBooks()
        return
      }
      try {
        const res = await searchBooks(this.searchKeyword)
        this.books = res.data.sort((a, b) => a.id - b.id)
      } catch (error) {
        alert('搜索失败：' + error.message)
      }
    },
    handleViewDetail(bookId) {
      this.$router.push(`/book-detail/${bookId}`)
    },
    async handleBorrow(bookId) {
      try {
        await borrowBook(bookId)
        alert('借阅成功')
        this.loadBooks()
        this.loadUserBorrows()
      } catch (error) {
        alert('借阅失败：' + error.message)
      }
    },
    async handleReturnBook(bookId) {
      if (!confirm('确定要归还这本图书吗？')) return
      try {
        // 找到该书对应的借阅记录
        const borrowRecord = this.userBorrows.find(b => b.bookId === bookId)
        console.log('归还操作 - 书籍ID:', bookId, '借阅记录:', borrowRecord)
        if (borrowRecord && borrowRecord.borrowStatus === 0) {
          await returnBook(borrowRecord.recordId)
          alert('归还成功')
          this.loadBooks()
          this.loadUserBorrows()
        } else {
          alert('该书未被借阅或已归还')
        }
      } catch (error) {
        alert('归还失败：' + error.message)
      }
    },
    async handleAddToCart(book) {
      try {
        await addToCart({
          bookId: book.id,
          bookName: book.bookName,
          author: book.author,
          price: book.price,
          quantity: 1
        })
        alert('已加入购物车')
      } catch (error) {
        alert('加入购物车失败：' + error.message)
      }
    },

    handleImageError(event) {
      // 图片加载失败时显示默认占位图
      event.target.src = require('@/assets/logo.png')
    },
    getBookImage(bookId) {
      // 根据图书ID获取对应的图片路径
      return require(`@/views/book_img/${bookId}.jpg`)
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
.books-container {
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

.toolbar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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

.btn-detail,
.btn-borrow,
.btn-return-book {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-detail {
  background: #667eea;
  color: white;
}

.btn-borrow {
  background: #2196f3;
  color: white;
}

.btn-return-book {
  background: #ff9800;
  color: white;
}

.btn-cart {
  background: #9c27b0;
  color: white;
}

.book-thumbnail {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

</style>
