<template>
  <div class="cart-container">
    <header class="header">
      <h1>线上書阁 - 购物车</h1>
      <nav>
        <router-link to="/books">图书列表</router-link>
        <router-link to="/cart" class="active">购物车</router-link>
        <router-link to="/my-borrows">我的借阅</router-link>
        <router-link to="/my-orders">我的订单</router-link>
        <router-link to="/profile">个人中心</router-link>
        <button @click="logout">退出登录</button>
      </nav>
    </header>

    <main class="main-content">
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>购物车为空</p>
        <router-link to="/books" class="back-btn">返回图书列表</router-link>
      </div>

      <div v-else>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>书名</th>
              <th>作者</th>
              <th>出版社</th>
              <th>ISBN</th>
              <th>价格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.bookName }}</td>
              <td>{{ item.author || '-' }}</td>
              <td>-</td>
              <td>-</td>
              <td>¥{{ item.price ? item.price.toFixed(2) : '0.00' }}</td>
              <td>
                <input 
                  type="number" 
                  :value="item.quantity" 
                  min="1"
                  @change="handleUpdateQuantity(item.id, $event.target.value)"
                  style="width: 80px; padding: 5px;"
                />
                <button @click="handleRemove(item.id)" class="btn-remove">移除</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="cart-summary">
          <div class="total-amount">
            <span class="label">总金额：</span>
            <span class="amount">¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="cart-actions">
            <button @click="handleClearCart" class="btn-clear">清空购物车</button>
            <button @click="handleCheckout" class="btn-checkout">结算</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getCart, removeFromCart, clearCart, getCartTotal, updateCartQuantity } from '@/api/cart'
import { createOrder } from '@/api/order'

export default {
  name: 'ShoppingCart',
  data() {
    return {
      cartItems: [],
      totalAmount: 0
    }
  },

  created() {
    this.loadCart()
  },
  methods: {
    async loadCart() {
      try {
        const res = await getCart()
        this.cartItems = res.data || []
        
        // 计算总金额
        const totalRes = await getCartTotal()
        if (totalRes && totalRes.data) {
          this.totalAmount = totalRes.data.totalAmount
        } else {
          // 如果接口失败，手动计算
          this.totalAmount = this.cartItems.reduce((sum, item) => {
            return sum + ((item.price || 0) * (item.quantity || 1))
          }, 0)
        }
      } catch (error) {
        alert('加载购物车失败：' + error.message)
      }
    },
    async handleRemove(cartId) {
      if (!confirm('确定要从购物车中移除这本书吗？')) return
      try {
        await removeFromCart(cartId)
        alert('已移除')
        this.loadCart()
      } catch (error) {
        alert('移除失败：' + error.message)
      }
    },
    async handleClearCart() {
      if (!confirm('确定要清空购物车吗？')) return
      try {
        await clearCart()
        alert('购物车已清空')
        this.loadCart()
      } catch (error) {
        alert('清空失败：' + error.message)
      }
    },
    async handleCheckout() {
      if (!confirm(`确认结算吗？总金额：¥${this.totalAmount.toFixed(2)}`)) return
      try {
        // 创建订单
        await createOrder(this.cartItems)
        // 清空购物车
        await clearCart()
        alert('订单创建成功！')
        // 跳转到我的订单页面
        this.$router.push('/my-orders')
      } catch (error) {
        alert('结算失败：' + error.message)
      }
    },
    async handleUpdateQuantity(cartItemId, quantity) {
      try {
        await updateCartQuantity(cartItemId, parseInt(quantity))
        this.loadCart()
      } catch (error) {
        alert('更新数量失败：' + error.message)
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
.cart-container {
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

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.empty-cart p {
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

.data-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
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

.btn-remove {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  background: #f44336;
  color: white;
}

.cart-summary {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  font-size: 20px;
}

.total-amount .label {
  color: #666;
  margin-right: 10px;
}

.total-amount .amount {
  color: #f44336;
  font-weight: bold;
  font-size: 24px;
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.btn-clear,
.btn-checkout {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-clear {
  background: #ccc;
  color: #333;
}

.btn-clear:hover {
  background: #bbb;
}

.btn-checkout {
  background: #4caf50;
  color: white;
}

.btn-checkout:hover {
  background: #45a049;
}
</style>
