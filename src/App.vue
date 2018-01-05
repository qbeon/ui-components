<template>
	<div id="app">
		<scrollable class="main-scrollable-area" :enabled="scrollEnabled">
			<router-view></router-view>
		</scrollable>
	</div>
</template>

<script>
import Scrollable from './components/Scrollable.vue';

export default {
	components: {
		'scrollable': Scrollable
	},
	data() {
		return {
			scrollEnabled: true
		}
	},
	methods: {
		onContextMenuOpened() {
			console.log('context-menu opened!')
		},
		onContextMenuClosed() {
			console.log('context-menu closed')
		},
		toggle() {
			this.scrollEnabled = !this.scrollEnabled
		}
	}
}
</script>


<style lang="stylus">
@import './styles/main.styl'
.main-scrollable-area
	height: 100vh
</style>
