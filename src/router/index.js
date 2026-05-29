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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const publicPages = ['/login', '/register']

    if (!publicPages.includes(to.path) && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router
