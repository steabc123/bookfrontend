import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/books'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/books',
        name: 'Books',
        component: () => import('@/views/Books.vue')
    },
    {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue')
    },
    {
        path: '/borrows',
        name: 'Borrows',
        component: () => import('@/views/Borrows.vue')
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/ShoppingCart.vue')
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/Users.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 获取token和用户信息
    const token = localStorage.getItem('token')
    const userInfoStr = localStorage.getItem('userInfo')
    
    // 公开页面（不需要登录）
    const publicPages = ['/login', '/register']
    
    // 如果访问的是公开页面，直接放行
    if (publicPages.includes(to.path)) {
        next()
        return
    }
    
    // 如果没有token，跳转到登录页
    if (!token) {
        next('/login')
        return
    }
    
    // 解析用户信息
    let username = ''
    try {
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr)
            username = userInfo.username || ''
        }
    } catch (e) {
        console.error('解析用户信息失败:', e)
    }
    
    // 非root用户只能访问图书管理、购物车和用户管理页面（用户管理页面会在组件内控制，但路由守卫也加上限制）
    const allowedForNonRoot = ['/books', '/cart']
    
    if (username !== 'root' && !allowedForNonRoot.includes(to.path)) {
        // 非root用户访问其他页面，重定向到图书管理
        next('/books')
        return
    }
    
    // 其他情况正常放行
    next()
})

export default router
