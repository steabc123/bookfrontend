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
        path: '/admin-login',
        name: 'AdminLogin',
        component: () => import('@/views/AdminLogin.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    // 前台用户端路由
    {
        path: '/books',
        name: 'Books',
        component: () => import('@/views/Books.vue')
    },
    {
        path: '/book-detail/:id',
        name: 'BookDetail',
        component: () => import('@/views/BookDetail.vue')
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/ShoppingCart.vue')
    },
    {
        path: '/my-borrows',
        name: 'MyBorrows',
        component: () => import('@/views/MyOrders.vue')
    },
    {
        path: '/my-orders',
        name: 'UserOrders',
        component: () => import('@/views/UserOrders.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
    },
    // 后台管理端路由
    {
        path: '/admin/orders',
        name: 'AdminOrders',
        component: () => import('@/views/AdminOrders.vue')
    },
    {
        path: '/admin/books',
        name: 'AdminBooks',
        component: () => import('@/views/AdminBooks.vue')
    },
    {
        path: '/admin/categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue')
    },
    {
        path: '/admin/borrows',
        name: 'Borrows',
        component: () => import('@/views/Borrows.vue')
    },
    {
        path: '/admin/users',
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
    const publicPages = ['/login', '/register', '/admin-login']
    
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
    
    // 判断是否为root用户
    const isRoot = username === 'root'
    
    // 后台管理端路由
    const adminRoutes = ['/admin/orders', '/admin/books', '/admin/categories', '/admin/borrows', '/admin/users']
    
    // 非root用户不能访问后台管理端
    if (!isRoot && adminRoutes.includes(to.path)) {
        next('/books')
        return
    }
    
    // root用户访问前台页面时，重定向到后台管理端
    if (isRoot && (to.path === '/books' || to.path === '/cart' || to.path === '/my-borrows' || to.path === '/my-orders' || to.path === '/profile')) {
        next('/admin/orders')
        return
    }
    
    // 其他情况正常放行
    next()
})

export default router
