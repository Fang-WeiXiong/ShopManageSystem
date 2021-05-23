import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../components/user/User.vue')

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: Home,
		redirect: '/welcome',
		children: [{
			path: '/welcome',
			component: Welcome
		},
		{
			path: '/users',
			component: User
		}]
	}

]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	// 访问登录页，放行
	if (to.path === '/login') return next()
	// 获取token
	const tokenStr = window.sessionStorage.getItem('token')
	// 没有token, 强制跳转到登录页
	if (!tokenStr) return next('/login')
	next()
})

export default router
