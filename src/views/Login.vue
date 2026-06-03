<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户端 - 登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名：</label>
          <input
              type="text"
              v-model="loginForm.username"
              required
              placeholder="请输入用户名"
          />
        </div>
        <div class="form-group">
          <label>密码：</label>
          <input
              type="password"
              v-model="loginForm.password"
              required
              placeholder="请输入密码"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <p class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
      <p class="admin-link">
        管理员入口：<router-link to="/admin-login">后台管理登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'UserLogin',
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
    async handleLogin() {
      // 验证是否为非root用户
      if (this.loginForm.username === 'root') {
        alert('root用户请使用管理员登录入口！')
        this.$router.push('/admin-login')
        return
      }
      
      this.loading = true
      try {
        const res = await login(this.loginForm)
        // 保存用户信息和token
        localStorage.setItem('token', res.data.userId)
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        alert('登录成功！')
        
        // 跳转到图书页面
        this.$router.push('/books')
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url(/src/views/background.jpg) center/cover no-repeat;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 400px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
