<template>
	<div>
		<transition name="anim">
			<div
			ref="container"
			class="container"
			v-on-clickaway="loseFocus"
			v-if="show"
			v-bar="{
				preventParentScroll: true,
				scrollThrottle: 30,
			}">
				<div
				ref="content"
				class="content"
				tabindex="-1"
				@contextmenu.capture.prevent>
					<slot>Empty Slot</slot>
				</div>
			</div>
		</transition>
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
	props: {
		show: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	watch: {
		show(val) {
			if (!val) return
			this.$nextTick(() => {
				// ssm stands for screen space margin
				const ssm = 24
				let containerEl = this.$refs.container
				let viewport = document.documentElement.getBoundingClientRect()
				let container = containerEl.getBoundingClientRect()
				let content = this.$refs.content.getBoundingClientRect()

				// If the context menu won't fit on the screen at all
				if (viewport.height < content.height + ssm * 2) {
					containerEl.style.height = (viewport.height - ssm * 2) + 'px'
					containerEl.style.top = '-' + (container.top) + 'px'
					return
				}

				// If the context menu will fit but leave the screen
				if (viewport.height < container.top + content.height + ssm) {
					containerEl.style.top = '-' + (container.top + content.height + ssm - viewport.height) + 'px'
				}
			})
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
.container
	//max-height: 160px
	overflow-y: scroll
	position: absolute
	z-index: 99999999
	margin: 0
	padding: 0
	background-color: #fff
	border-radius: .1rem
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)
	cursor: default
	&:focus
		outline: none

.anim-enter-active
	transition: all .3s
.anim-leave-active
	transition: all .3s
.anim-enter
	opacity: 0
	transform: translateY(-6px)
.anim-leave-to
	opacity: 0
	transform: translateX(-6px)
</style>
