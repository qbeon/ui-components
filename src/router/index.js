import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _import = file => () => import(`../views/${file}.vue`).then(m => m.default)

const routes = [
	{
		path: '/',
		name: 'Test',
		component: _import('Test'),
	},
	{
		path: '/pg',
		component: _import('Pg')
	}
]

export function createRouter () {
	return new Router({
		mode: 'history',
		//fallback: false,
		scrollBehavior: () => ({ y: 0 }),
		routes
	})
}
