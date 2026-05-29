<template>
  <div class="register-container">
    <div class="register-box">
      <h2>图书管理系统 - 注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名：</label>
          <input
              type="text"
              v-model="registerForm.username"
              required
              placeholder="请输入用户名"
          />
        </div>
        <div class="form-group">
          <label>密码：</label>
          <input
              type="password"
              v-model="registerForm.password"
              required
              placeholder="请输入密码"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <p class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user'

export default {
  name: 'UserRegister',
  data() {
    return {
      registerForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      try {
        await register(this.registerForm)
        alert('注册成功！请登录')
        this.$router.push('/login')
      } catch (error) {
        alert('注册失败：' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 400px;
}

.register-box h2 {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
