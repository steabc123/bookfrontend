<template>
  <div class="profile-container">
    <header class="header">
      <h1>线上书阁 - 个人中心</h1>
      <nav>
        <router-link to="/books">图书列表</router-link>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/my-borrows">我的借阅</router-link>
        <router-link to="/my-orders">我的订单</router-link>
        <router-link to="/profile" class="active">个人中心</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            <span>{{ userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U' }}</span>
          </div>
          <h2>{{ userInfo.username }}</h2>
        </div>
        
        <div class="profile-info">
          <div class="info-item">
            <label>用户ID：</label>
            <span>{{ userInfo.userId || userInfo.id }}</span>
          </div>
          <div class="info-item">
            <label>用户名：</label>
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="info-item">
            <label>角色：</label>
            <span :class="userInfo.role === 'admin' ? 'role-admin' : 'role-user'">
              {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
          </div>
          <div class="info-item">
            <label>邮箱：</label>
            <span>{{ userInfo.email || '-' }}</span>
          </div>
          <div class="info-item">
            <label>手机号：</label>
            <span>{{ userInfo.phone || '-' }}</span>
          </div>
          <div class="info-item">
            <label>状态：</label>
            <span :class="userInfo.status === 1 ? 'status-active' : 'status-inactive'">
              {{ userInfo.status === 1 ? '启用' : '禁用' }}
            </span>
          </div>
          <div class="info-item" v-if="userInfo.createTime || userInfo.create_time">
            <label>注册时间：</label>
            <span>{{ formatDate(userInfo.createTime || userInfo.create_time) }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="handleEditProfile" class="btn-edit">编辑资料</button>
          <button @click="handleChangePassword" class="btn-password">修改密码</button>
        </div>
      </div>

      <!-- 编辑资料对话框 -->
      <div v-if="showEditDialog" class="modal">
        <div class="modal-content">
          <h3>编辑资料</h3>
          <form @submit.prevent="handleSubmitEdit">
            <div class="form-group">
              <label>用户ID：</label>
              <input v-model="editForm.id" disabled />
            </div>
            <div class="form-group">
              <label>用户名：</label>
              <input v-model="editForm.username" disabled />
            </div>
            <div class="form-group">
              <label>邮箱：</label>
              <input type="email" v-model="editForm.email" />
            </div>
            <div class="form-group">
              <label>手机号：</label>
              <input type="tel" v-model="editForm.phone" />
            </div>
            <div class="modal-actions">
              <button type="submit">保存</button>
              <button type="button" @click="showEditDialog = false">取消</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 修改密码对话框 -->
      <div v-if="showPasswordDialog" class="modal">
        <div class="modal-content">
          <h3>修改密码</h3>
          <form @submit.prevent="handleSubmitPassword">
            <div class="form-group">
              <label>旧密码：</label>
              <input type="password" v-model="passwordForm.oldPassword" required placeholder="请输入当前密码" />
            </div>
            <div class="form-group">
              <label>新密码：</label>
              <input type="password" v-model="passwordForm.newPassword" required minlength="6" placeholder="至少6位字符" />
              <small class="hint">密码长度至少6位</small>
            </div>
            <div class="form-group">
              <label>确认新密码：</label>
              <input type="password" v-model="passwordForm.confirmPassword" required minlength="6" placeholder="再次输入新密码" />
              <small v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="error-hint">
                两次输入的密码不一致
              </small>
            </div>
            <div class="modal-actions">
              <button type="submit">保存</button>
              <button type="button" @click="showPasswordDialog = false">取消</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getCurrentUser, updateUser, changePassword } from '@/api/user'

export default {
  name: 'UserProfile',
  data() {
    return {
      userInfo: {},
      loading: true,
      showEditDialog: false,
      showPasswordDialog: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        phone: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      try {
        const res = await getCurrentUser()
        this.userInfo = res.data
        this.editForm.id = res.data.userId || res.data.id || ''
        this.editForm.username = res.data.username
      } catch (error) {
        console.error('加载用户信息失败:', error)
        // 从本地存储获取
        const userInfoStr = localStorage.getItem('userInfo')
        if (userInfoStr) {
          this.userInfo = JSON.parse(userInfoStr)
        }
      } finally {
        this.loading = false
      }
    },
    handleEditProfile() {
      this.showEditDialog = true
    },
    async handleSubmitEdit() {
      try {
        await updateUser(this.editForm)
        alert('更新成功')
        this.showEditDialog = false
        this.loadUserInfo()
      } catch (error) {
        alert('更新失败：' + error.message)
      }
    },
    handleChangePassword() {
      this.showPasswordDialog = true
    },
    async handleSubmitPassword() {
      // 验证新密码长度
      if (this.passwordForm.newPassword.length < 6) {
        alert('新密码长度不能少于6位')
        return
      }
      
      // 验证两次输入的新密码是否一致
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('两次输入的新密码不一致')
        return
      }
      
      try {
        // 调用后端修改密码接口
        await changePassword({
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
          confirmPassword: this.passwordForm.confirmPassword
        })
        
        alert('密码修改成功，请重新登录')
        this.showPasswordDialog = false
        // 清空表单
        this.passwordForm = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        // 退出登录
        this.logout()
      } catch (error) {
        alert('修改失败：' + error.message)
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
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
.profile-container {
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
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.profile-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: #667eea;
}

.profile-header h2 {
  margin: 0;
  font-size: 28px;
}

.profile-info {
  padding: 30px;
}

.info-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  width: 120px;
  font-weight: bold;
  color: #666;
}

.info-item span {
  flex: 1;
  color: #333;
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

.profile-actions {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-edit,
.btn-password {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-password {
  background: #4caf50;
  color: white;
}

.btn-password:hover {
  background: #45a049;
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

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.form-group small.hint {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 12px;
}

.form-group small.error-hint {
  display: block;
  margin-top: 5px;
  color: #f44336;
  font-size: 12px;
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
