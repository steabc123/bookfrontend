<template>
  <div class="admin-login-container">
    <div class="admin-login-box">
      <div class="admin-logo">
        <h1>线上书阁</h1>
        <p>后台管理系统</p>
      </div>
      <form @submit.prevent="handleAdminLogin">
        <div class="form-group">
          <label for="username">管理员用户名：</label>
          <input
              id="username"
              type="text"
              v-model="loginForm.username"
              required
              placeholder="请输入管理员用户名"
              autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label for="password">密码：</label>
          <input
              id="password"
              type="password"
              v-model="loginForm.password"
              required
              placeholder="请输入管理员密码"
              autocomplete="current-password"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '管理员登录' }}
        </button>
      </form>
      <div class="admin-info">
        <p>仅限授权管理员访问</p>
        <router-link to="/login" class="back-to-user">返回用户登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'AdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleAdminLogin() {
      // 验证是否为root用户
      if (this.loginForm.username !== 'root') {
        alert('只有root用户可以登录后台管理系统！')
        return
      }
      
      this.loading = true
      try {
        const res = await login(this.loginForm)
        
        // 保存用户信息和token
        localStorage.setItem('token', res.data.userId)
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        
        // 验证是否为root用户
        if (res.data.username === 'root') {
          alert('管理员登录成功！')
          this.$router.push('/admin/orders')
        } else {
          alert('您没有管理员权限！')
          this.$router.push('/books')
        }
      } catch (error) {
        alert('登录失败：' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  font-family: 'Arial', sans-serif;
}

.admin-login-box {
  background: white;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  width: 450px;
  text-align: center;
}

.admin-logo h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
}

.admin-logo p {
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: bold;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.admin-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.admin-info p {
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 14px;
}

.back-to-user {
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.back-to-user:hover {
  color: #2980b9;
  text-decoration: underline;
}
</style>