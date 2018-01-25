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

export default {

}
</script>

<style lang="stylus">
@import './styles/main.styl'
</style>
