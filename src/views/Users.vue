<template>
  <div class="users-container">
    <header class="header">
      <h1>线上书阁 - 后台管理</h1>
      <nav>
        <router-link to="/admin/orders">订单管理</router-link>
        <router-link to="/admin/books">图书管理</router-link>
        <router-link to="/admin/categories">分类管理</router-link>
        <router-link to="/admin/borrows">借阅管理</router-link>
        <router-link to="/admin/users" class="active">用户管理</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div class="toolbar">
        <button @click="loadUsers">刷新</button>
        <button @click="openAddDialog" class="btn-add">添加用户</button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>角色</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.userId || user.id">
          <td>{{ user.userId || user.id || '-' }}</td>
          <td>{{ user.username || '-' }}</td>
          <td>
            <span :class="user.role === 'admin' ? 'role-admin' : 'role-user'">
              {{ user.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
          </td>
          <td>
            <span :class="user.status === 1 ? 'status-active' : 'status-inactive'">
              {{ user.status === 1 ? '启用' : '禁用' }}
            </span>
          </td>
          <td>{{ formatDate(user.createTime || user.create_time) }}</td>
          <td>
            <button @click="handleEdit(user)" class="btn-edit">编辑</button>
            <button 
              v-if="user.username !== 'root'" 
              @click="handleDelete(user.userId || user.id)" 
              class="btn-delete"
            >删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </main>

    <!-- 添加/编辑用户对话框 -->
    <div v-if="showEditDialog || showAddDialog" class="modal">
      <div class="modal-content">
        <h3>{{ editMode ? '编辑用户' : '添加用户' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>用户ID：</label>
            <input v-model="formData.id" />
          </div>
          <div class="form-group">
            <label>用户名：</label>
            <input v-model="formData.username" required />
          </div>
          <div class="form-group" v-if="!editMode">
            <label>密码：</label>
            <input type="password" v-model="formData.password" :required="!editMode" />
          </div>
          <div class="form-group">
            <label>角色：</label>
            <select v-model="formData.role" required>
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态：</label>
            <select v-model="formData.status" required>
              <option :value="1">启用</option>
              <option :value="0">禁用</option>
            </select>
          </div>
          <div class="form-group">
            <label>邮箱：</label>
            <input type="email" v-model="formData.email" />
          </div>
          <div class="form-group">
            <label>手机号：</label>
            <input type="tel" v-model="formData.phone" />
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
import { getUsers, updateUser, deleteUser, addUser } from '@/api/user'

export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      showEditDialog: false,
      showAddDialog: false,
      editMode: false,
      formData: {
        id: null,
        originalId: null,  // 原始ID，用于追踪
        username: '',
        password: '',
        role: 'user',
        status: 1,
        email: '',
        phone: ''
      }
    }
  },

  created() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        const res = await getUsers()
        console.log('API 完整响应:', res)
        console.log('res.data 类型:', typeof res.data, Array.isArray(res.data))
        console.log('res.data:', res.data)
        console.log('res.code:', res.code)
        console.log('res.message:', res.message)
        
        // 处理不同的响应格式
        let userList = []
        if (Array.isArray(res.data)) {
          // 如果 res.data 是数组
          userList = res.data
        } else if (res.data && typeof res.data === 'object') {
          // 如果 res.data 是对象，检查是否有 list 或 users 属性
          if (Array.isArray(res.data.list)) {
            userList = res.data.list
          } else if (Array.isArray(res.data.users)) {
            userList = res.data.users
          } else if (res.data.records) {
            // MyBatis-Plus 分页格式
            userList = Array.isArray(res.data.records) ? res.data.records : []
          } else if (res.data.rows) {
            // 另一种分页格式
            userList = Array.isArray(res.data.rows) ? res.data.rows : []
          } else {
            // 如果 res.data 本身就是用户对象（单个）
            userList = [res.data]
          }
        }
        
        this.users = userList
        console.log('最终用户列表:', this.users)
        console.log('用户数量:', this.users.length)
        
        if (this.users.length === 0) {
          console.warn('警告：用户列表为空，请检查后端接口')
        }
      } catch (error) {
        console.error('加载用户失败详情:', error)
        alert('加载用户列表失败：' + error.message)
      }
    },
    handleEdit(user) {
      this.editMode = true
      const userId = user.userId || user.id
      this.formData = {
        id: userId,
        originalId: userId,  // 保存原始ID用于后端更新
        username: user.username,
        password: '',
        role: user.role || 'user',
        status: user.status !== undefined ? user.status : 1,
        email: user.email || '',
        phone: user.phone || ''
      }
      console.log('编辑用户, formData:', this.formData)
      this.showEditDialog = true
    },
    openAddDialog() {
      // 打开添加对话框时，确保 editMode 为 false
      this.editMode = false
      this.formData = {
        id: null,
        username: '',
        password: '',
        role: 'user',
        status: 1,
        email: '',
        phone: ''
      }
      this.showAddDialog = true
      console.log('打开添加对话框, editMode:', this.editMode)
    },
    async handleSubmit() {
      try {
        if (this.editMode) {
          // 编辑模式 - 发送所有字段包括 id、originalId 和 username
          const updateData = {
            id: this.formData.id,
            originalId: this.formData.originalId,
            username: this.formData.username,
            role: this.formData.role,
            status: this.formData.status,
            email: this.formData.email,
            phone: this.formData.phone
          }
          console.log('编辑用户数据:', updateData)
          await updateUser(updateData)
          alert('更新成功')
        } else {
          // 添加模式 - 只发送必要字段
          const addData = {
            username: this.formData.username,
            password: this.formData.password,
            role: this.formData.role,
            status: this.formData.status,
            email: this.formData.email,
            phone: this.formData.phone
          }
          console.log('添加用户数据:', addData)
          await addUser(addData)
          alert('添加成功')
        }
        this.closeDialog()
        this.loadUsers()
      } catch (error) {
        console.error('操作失败:', error)
        alert((this.editMode ? '更新' : '添加') + '失败：' + error.message)
      }
    },
    async handleDelete(id) {
      if (!confirm('确定要删除这个用户吗？')) return
      try {
        await deleteUser(id)
        alert('删除成功')
        this.loadUsers()
      } catch (error) {
        alert('删除失败：' + error.message)
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    },
    closeDialog() {
      this.showEditDialog = false
      this.showAddDialog = false
      this.editMode = false
      this.formData = {
        id: null,
        originalId: null,
        username: '',
        password: '',
        role: 'user',
        status: 1,
        email: '',
        phone: ''
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
.users-container {
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

.toolbar .btn-add {
  background: #4caf50;
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

.role-admin {
  color: #f44336;
  font-weight: bold;
}

.role-user {
  color: #2196f3;
  font-weight: bold;
}

.status-active {
  color: #4caf50;
  font-weight: bold;
}

.status-inactive {
  color: #999;
  font-weight: bold;
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
