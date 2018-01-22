<template>
<div class="__util_subcomponents_root">
	<p class="__util_subcomponents_header">
		<span v-if="any">Sub Components</span>
		<span v-if="!any">No Sub Components</span>	
	</p>
	<ul
	v-if="any"
	class="__util_subcomponents_list">
		<li
		class="__util_subcomponents_component"
		v-for="(name, pageName) in value"
		:key="pageName"
		@click="goTo(pageName)">{{name}}</li>
	</ul>
</div>
</template>

<script>
export default {
	props: ['value'],
	computed: {
		any() {
			if (this.value == null) return false
			return Object.keys(this.value).length > 0
		}
	},
	methods: {
		goTo(componentName) {
			this.$router.push({name: componentName})
		}
	}
}
</script>

<style lang="stylus">
@import '../styles/vars.styl'

.__util_subcomponents_
	&root
		margin-top: 1rem
		margin-bottom: 1rem
	&list
		list-style-type: none
		padding: 0px
	&header
		span
			color: #aaa
	&component
		display: inline-block
		font-size: 1rem
		padding: .25rem
		padding-left: .5rem
		padding-right: .5rem
		background-color: #448AFF
		color: white
		border-radius: 1rem
		margin-top: .5rem
		margin-right: .5rem
		cursor: pointer
		$default-color-transition(.3s)
		&:hover
			background-color: #2962FF
</style>
