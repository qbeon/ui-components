<template>
	<div>
		<transition name="anim">
			<div
			ref="container"
			class="container"
			v-on-clickaway="loseFocus"
			v-if="show">
				<div
				ref="content"
				class="content"
				tabindex="-1"
				@contextmenu.capture.prevent
				v-bar="{
					preventParentScroll: true,
					scrollThrottle: 30,
				}">
					<slot></slot>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway'

function defaultScrollTopGetter() {
	if (window.pageYOffset !== undefined) return window.pageYOffset
	return (document.documentElement ||
		document.body.parentNode ||
		document.body
	).scrollTop
}

const appearance = {
	default: {
		screenSpaceMargin: 8
	},
	validator(val) {
		if(typeof val.screenSpaceMargin !== 'number') return false
		return true
	}
}

export default {
	appearance,
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
		'show': {
			type: Boolean,
			required: true,
			default: false
		},
		'appearance': {
			type: [Object],
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	watch: {
		show(val) {
			if (!val) return
			this.$nextTick(() => {
				// ssm stands for screen space margin
				const containerEl = this.$refs.container
				const contentEl = this.$refs.content
				const viewport = document.documentElement.getBoundingClientRect()
				const container = containerEl.getBoundingClientRect()
				const content = contentEl.getBoundingClientRect()
				const containerStyle = containerEl.style
				const vpHeight = viewport.height

				const ssm = this.appearance.screenSpaceMargin

				// Get the current screen scroll position
				if (!this.$root.uic_scrollTop) this.$root.uic_scrollTop = defaultScrollTopGetter
				const scrollTop = this.$root.uic_scrollTop()

				// If the context menu won't vertically fit on the screen at all
				// then strech it over the entire screen height as much as possible
				if (vpHeight < content.height + ssm * 2) {
					containerStyle.height = (vpHeight - ssm * 2) + 'px'
					containerStyle.top = ssm + 'px'
					return
				}

				const contentBottomOnScreen = (content.top - scrollTop) + content.height

				// Displace the context menu to prevent it from going off screen.

				// In case the context menu goes over the bottom screen border
				if (contentBottomOnScreen > vpHeight) containerStyle.top = (
					(container.top - scrollTop) -
					(contentBottomOnScreen - vpHeight) -
					ssm
				) + 'px'
				// In case the context menu goes over the top screen border
				else if (content.top - scrollTop - ssm < 0) containerStyle.top = ssm + 'px'
				// In case the context menu doesn't leave the screen vertically
				else containerStyle.top = (container.top - scrollTop) + 'px'
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
	position: fixed
	z-index: 99999999
	margin: 0
	padding: 0
	background-color: #fff
	border-radius: .1rem
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)
	cursor: default
	overflow: hidden
	&:focus
		outline: none

.content
	height: 100%

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
