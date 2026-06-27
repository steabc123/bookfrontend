import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/login'
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
        component: () => import('@/views/MyBorrows.vue')
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

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userInfoStr = localStorage.getItem('userInfo')
    const publicPages = ['/login', '/register', '/admin-login']
    if (publicPages.includes(to.path)) {
        next()
        return
    }
    if (!token) {
        next('/login')
        return
    }
    let username = ''
    try {
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr)
            username = userInfo.username || ''
        }
    } catch (e) {
        console.error('解析用户信息失败:', e)
    }
    const isRoot = username === 'root'
    const adminRoutes = ['/admin/orders', '/admin/books', '/admin/categories', '/admin/borrows', '/admin/users']
    if (!isRoot && adminRoutes.includes(to.path)) {
        next('/books')
        return
    }
    if (isRoot && (to.path === '/books' || to.path === '/cart' || to.path === '/my-borrows' || to.path === '/my-orders' || to.path === '/profile')) {
        next('/admin/orders')
        return
    }
    next()
})

export default router
