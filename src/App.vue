<template>
	<div id="app">
		<scrollable
		:appearance="{
			scrollIndicators: false
		}">
			<router-view></router-view>
		</scrollable>
	</div>
</template>

<script>
import Scrollable from './components/Scrollable.vue';

export default {
	components: {
		'scrollable': Scrollable
	}
}
</script>

<style lang="stylus">
@import './styles/main.styl'
</style>
