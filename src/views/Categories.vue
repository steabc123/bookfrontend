<template>
  <div class="categories-container">
    <header class="header">
      <h1>线上書阁</h1>
      <nav>
        <router-link to="/books">图书管理</router-link>
        <router-link to="/categories">分类管理</router-link>
        <router-link to="/borrows">借阅管理</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="toolbar">
        <button @click="loadCategories">刷新</button>
        <button @click="showAddDialog = true">添加分类</button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>分类名称</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="category in categories" :key="category.categoryId">
          <td>{{ category.categoryId }}</td>
          <td>{{ category.categoryName }}</td>
          <td>{{ category.description || category.categoryDesc || '-' }}</td>
          <td>
            <button @click="handleEdit(category)" class="btn-edit">编辑</button>
            <button @click="handleDelete(category.categoryId)" class="btn-delete">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </main>

    <!-- 添加/编辑分类对话框 -->
    <div v-if="showAddDialog" class="modal">
      <div class="modal-content">
        <h3>{{ editMode ? '编辑分类' : '添加分类' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>分类ID：</label>
            <input v-model="formData.categoryId" :disabled="editMode" required />
          </div>
          <div class="form-group">
            <label>分类名称：</label>
            <input v-model="formData.categoryName" required />
          </div>
          <div class="form-group">
            <label>描述：</label>
            <textarea v-model="formData.description"></textarea>
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
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/api/category'

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: [],
      showAddDialog: false,
      editMode: false,
      formData: {
        categoryId: null,
        categoryName: '',
        description: ''
      }
    }
  },
  created() {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategories()
        console.log('后端返回的分类数据:', res.data)
        if (res.data && res.data.length > 0) {
          console.log('第一条分类数据:', res.data[0])
          console.log('第一条数据的键:', Object.keys(res.data[0]))
        }
        this.categories = res.data || []
      } catch (error) {
        alert('加载分类失败：' + error.message)
      }
    },
    handleEdit(category) {
      this.editMode = true
      this.formData = { ...category }
      console.log('编辑分类数据:', this.formData)
      this.showAddDialog = true
    },
    async handleSubmit() {
      try {
        console.log('提交分类数据:', this.formData)
        if (this.editMode) {
          await updateCategory(this.formData)
          alert('更新成功')
        } else {
          await addCategory(this.formData)
          alert('添加成功')
        }
        this.closeDialog()
        this.loadCategories()
      } catch (error) {
        alert('操作失败：' + error.message)
      }
    },
    async handleDelete(id) {
      if (!confirm('确定要删除这个分类吗？')) return
      try {
        console.log('删除分类 ID:', id)
        await deleteCategory(id)
        alert('删除成功')
        this.loadCategories()
      } catch (error) {
        console.error('删除分类失败:', error)
        console.error('错误详情:', error.response)
        alert('删除失败：' + (error.message || '请求失败'))
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editMode = false
      this.formData = {
        categoryId: null,
        categoryName: '',
        description: ''
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
.categories-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
}

.header nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

.header nav a {
  color: white;
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
  color: white;
  border: 1px solid white;
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
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
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
