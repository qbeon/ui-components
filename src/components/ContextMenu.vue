<template>
	<div v-on-clickaway="loseFocus">
		<div
		class="context-menu"
		tabindex="-1"
		@contextmenu.capture.prevent>
			<slot>Empty Slot</slot>
		</div>
	</div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway'

export default {
	directives: {
		onClickaway: clickaway
	},
	name: 'context-menu',
	data() {
		return {
			top: 0,
			left: 0
		}
	},
	methods: {
		setPosition(top, left) {
			const largestHeight = window.innerHeight - this.$el.offsetHeight - 25
			const largestWidth = window.innerWidth - this.$el.offsetWidth - 25
			if (top > largestHeight) top = largestHeight
			if (left > largestWidth) left = largestWidth
			this.top = top
			this.left = left
		},
		loseFocus() {
			this.$emit("lostFocus")
		}
	}
}
</script>

<style lang="stylus" scoped>
.context-menu
	min-width: 100%
	position: absolute
	z-index: 99999999
	margin: 0
	padding: 0
	background-color: #fff
	border-radius: .1rem
	box-shadow: 0 0px 4px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)
	cursor: default
	overflow: hidden
	&:focus
		outline: none
</style>
