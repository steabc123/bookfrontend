<template>
  <div class="admin-books-container">
    <header class="header">
      <h1>线上书阁 - 后台管理</h1>
      <nav>
        <router-link to="/admin/orders">订单管理</router-link>
        <router-link to="/admin/books" class="active">图书管理</router-link>
        <router-link to="/admin/categories">分类管理</router-link>
        <router-link to="/admin/borrows">借阅管理</router-link>
        <router-link to="/admin/users">用户管理</router-link>
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
        <button @click="showAddDialog = true">添加图书</button>
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
          <th>价格</th>
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
          <td>{{ book.price ? '¥' + book.price.toFixed(2) : '-' }}</td>
          <td>{{ book.stock }}</td>
          <td>{{ getCategoryName(book.categoryId) }}</td>
          <td>
            <button @click="handleEdit(book)" class="btn-edit">编辑</button>
            <button @click="handleDelete(book.id)" class="btn-delete">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </main>

    <!-- 添加/编辑图书对话框 -->
    <div v-if="showAddDialog" class="modal">
      <div class="modal-content">
        <h3>{{ editMode ? '编辑图书' : '添加图书' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>书名：</label>
            <input v-model="formData.bookName" required />
          </div>
          <div class="form-group">
            <label>作者：</label>
            <input v-model="formData.author" required />
          </div>
          <div class="form-group">
            <label>出版社：</label>
            <input v-model="formData.publisher" />
          </div>
          <div class="form-group">
            <label>ISBN：</label>
            <input v-model="formData.isbn" required />
          </div>
          <div class="form-group">
            <label>价格：</label>
            <input type="number" step="0.01" v-model="formData.price" />
          </div>
          <div class="form-group">
            <label>库存：</label>
            <input type="number" v-model="formData.stock" required />
          </div>
          <div class="form-group">
            <label>分类：</label>
            <select v-model="formData.categoryId" required>
              <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                {{ category.categoryName }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit">保存</button>
            <button type="button" @click="closeDialog">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getBooks, searchBooks, updateBook, addBook, deleteBook } from '@/api/book'
import { getCategories } from '@/api/category'

export default {
  name: 'AdminBooks',
  data() {
    return {
      books: [],
      categories: [],
      searchKeyword: '',
      showAddDialog: false,
      editMode: false,
      formData: {
        id: null,
        bookName: '',
        author: '',
        publisher: '',
        isbn: '',
        price: 0,
        stock: 0,
        categoryId: 1
      }
    }
  },
  created() {
    this.loadBooks()
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
    async loadCategories() {
      try {
        const res = await getCategories()
        this.categories = res.data || []
      } catch (error) {
        console.error('加载分类失败:', error)
        this.categories = []
      }
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.categoryId === categoryId)
      return category ? category.categoryName : '未分类'
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
    handleEdit(book) {
      this.editMode = true
      this.formData = { 
        id: book.id,
        bookName: book.bookName,
        author: book.author,
        publisher: book.publisher || '',
        isbn: book.isbn,
        price: book.price || 0,
        stock: book.stock,
        categoryId: book.categoryId || 1
      }
      this.showAddDialog = true
    },
    async handleSubmit() {
      try {
        const submitData = {
          id: this.formData.id,
          bookName: this.formData.bookName,
          author: this.formData.author,
          publisher: this.formData.publisher,
          isbn: this.formData.isbn,
          price: this.formData.price,
          stock: this.formData.stock,
          categoryId: this.formData.categoryId,
          category_id: this.formData.categoryId
        }
        if (this.editMode) {
          await updateBook(submitData)
          alert('更新成功')
        } else {
          await addBook(submitData)
          alert('添加成功')
        }
        this.closeDialog()
        this.loadBooks()
      } catch (error) {
        alert('操作失败：' + error.message)
      }
    },
    async handleDelete(id) {
      if (!confirm('确定要删除这本图书吗？')) return
      try {
        await deleteBook(id)
        alert('删除成功')
        this.loadBooks()
      } catch (error) {
        alert('删除失败：' + error.message)
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editMode = false
      this.formData = {
        id: null,
        bookName: '',
        author: '',
        publisher: '',
        isbn: '',
        price: 0,
        stock: 0,
        categoryId: 1
      }
    },
    handleImageError(event) {
      // 图片加载失败时显示默认占位图
      event.target.src = require('@/assets/logo.png')
    },
    getBookImage(bookId) {
      // 根据图书ID获取对应的图片路径
      return `/book_img/${bookId}.jpg`
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
.admin-books-container {
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

.btn-edit,
.btn-delete {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background: #4caf50;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.book-thumbnail {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-actions button[type="submit"] {
  background: #667eea;
  color: white;
}

.modal-actions button[type="button"] {
  background: #ccc;
}
</style>
