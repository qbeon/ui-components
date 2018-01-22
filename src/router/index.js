import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _import = file => () => import(`../views/${file}.vue`).then(m => m.default)

const routes = [{
	path: '/',
	name: 'Home',
	component: _import('Home')
}, {
	path: '/text-field-component',
	name: 'LabeledTextFieldComponent',
	component: _import('LabeledTextFieldComponent')
}, {
	path: '/select-field-component',
	name: 'SelectFieldComponent',
	component: _import('SelectFieldComponent')
}, {
	path: '/chip-field-component',
	name: 'LabeledChipFieldComponent',
	component: _import('LabeledChipFieldComponent')
}, {
	path: '/scrollable-component',
	name: 'ScrollableComponent',
	component: _import('ScrollableComponent')
}, {
	path: '/labeled-field',
	name: 'LabeledFieldComponent',
	component: _import('LabeledFieldComponent')
}, {
	path: '/size-transition-component',
	name: 'SizeTransitionComponent',
	component: _import('SizeTransitionComponent')
}, {
	path: '/menu-component',
	name: 'MenuComponent',
	component: _import('MenuComponent')
}]

export function createRouter () {
	return new Router({
		mode: 'history',
		//fallback: false,
		scrollBehavior: () => ({ y: 0 }),
		routes
	})
}
