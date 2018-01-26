import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

import Controls from './install'

Vue.use(Controls)

export function createApp (ssrContext) {
	// create store and router instances
	const store = createStore()
	const router = createRouter()

	// sync the router with the vuex store.
	// this registers `store.state.route`
	sync(store, router)

	// create the app instance.
	// here we inject the router, store and ssr context to all child components,
	// making them available everywhere as `this.$router` and `this.$store`.
	const app = new Vue({
		router,
		store,
		ssrContext,
		data: {
			// UI Controls configuration
			// Scroll position retrieval method for vuebar support
			uic_scrollTop() {
				//return this.$vuebar.getState(document.querySelector('#app')).el2.scrollTop
				return 0
			}
		},
		render: h => h(App),
	})

	// expose the app, the router and the store.
	// note we are not mounting the app here, since bootstrapping will be
	// different depending on whether we are in a browser or on the server.
	return { app, router, store }
}
