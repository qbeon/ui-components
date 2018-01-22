<template>
<div class="page">
	<!-- Description -->
	<div class="__util_componentpage_header">
		<div class="__util_componentpage_centered">
			<h3>{{name}}</h3>
			<slot name="description">No description available.</slot>
			<sub-components :value="subComponents"></sub-components>
		</div>
	</div>
	<!-- Demonstration -->
	<div class="__util_componentpage_demo-section">
		<div class="__util_componentpage_shadow"></div>
		<div class="__util_componentpage_centered">
			<slot name="demo">No demonstrative examples available.</slot>
		</div>
	</div>
</div>
</template>

<script>
import UtilSubComponents from '../util/SubComponents.vue'

export default {
	components: {
		'sub-components': UtilSubComponents,
	},
	props: {
		name: {
			type: String,
			required: true,
			validator(name) {
				if (name.length < 1) {
					console.error("Missing component name (empty)")
					return false
				}
				return true
			}
		},
		subComponents: {
			type: Object,
			required: false
		}
	},
}
</script>

<style lang="stylus" scoped>
.__util_componentpage_
	&header, &demo-section
		padding: 1.75rem
		padding-top: 0rem
	&centered
		margin: auto
		max-width: 960px
	&shadow
		display: block
		position: absolute
		left: 0px
		top: 0px
		height: 3rem
		width: 100%
		background: -moz-linear-gradient(top, rgba(0,0,0,.025) 0%, rgba(0,0,0,0) 100%)
		background: -webkit-linear-gradient(top, rgba(0,0,0,.025) 0%, rgba(0,0,0,0) 100%)
		background: linear-gradient(to bottom, rgba(0,0,0,.025) 0%, rgba(0,0,0,0) 100%)
	&demo-section
		position: relative
		background-color: #FAFAFA
		padding-top: 3rem
</style>
