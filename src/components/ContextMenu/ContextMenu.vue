<template>
	<div
	ref="root"
	class="__uic_ctxm_root"
	:tabindex="-1">
		<div :style="{pointerEvents: blurred ? 'none' : 'auto'}">
			<transition name="anim">
				<div
				ref="background"
				class="__uic_ctxm_background"
				@wheel="onFocusLost"
				v-show="show"
				@click="onFocusLost">
				</div>
			</transition>

			<transition name="__uic_ctxm_container">
				<div
				ref="container"
				class="__uic_ctxm_container"
				v-show="show">
					<div
					ref="content"
					class="__uic_ctxm_content"
					tabindex="-1"
					@contextmenu.capture.prevent>
						<slot></slot>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import { prependElement, isParent } from '../util'

const appearance = {
	default: {
		screenSpaceMargin: 8
	},
	validator(val) {
		if(typeof val.screenSpaceMargin !== 'number') return false
		return true
	}
}

const shared = {
	displayed: null,
	previouslyFocusedElement: null
}

export default {
	name: 'context-menu',
	appearance,
	data() {
		return {
			shared,
			blurred: false
		}
	},
	props: {
		show: {
			type: Boolean,
			required: true,
			default: false
		},
		preferParentWidth: {
			type: Boolean,
			required: false,
			default: false
		},
		appearance: {
			type: [Object],
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	watch: {
		'shared.displayed'() {
			if (this.shared.displayed !== this.$el) this.close()
		},
		$route(val) {
			this.onFocusLost()
		},
		show(val) {
			if (!val) {
				this.onFocusLost()
				this.blurred = true
				return
			}
			this.shared.displayed = this.$el
			this.blurred = false

			this.$nextTick(() => {
				this.$refs.content.focus()

				// Move the component elements to the document scope
				// to prevent any backround interactions
				prependElement(document.body, this.$refs.background)
				prependElement(document.body, this.$refs.container)

				// Close context menu on background touches
				this.$refs.background.addEventListener("touchstart", this.onFocusLost)

				// Calculate and set on screen position
				this.calculatePosition()
			})

			// Close context menu when the 'Escape' key has been klicked,
			// or the windows was resized
			window.addEventListener('keydown', this.onKeydown)
			window.addEventListener('resize', this.onFocusLost)
		}
	},
	created() {
		// Don't track focus changes on the server where there's no window API
		if (this.$isServer) return
		window.addEventListener('focus', this.onFocusChanged, true)
	},
	beforeDestroy() {
		// Remove aborting interaction event listeners
		this.unlink()

		if (!this.show) return

		// Destroy nodes temporarily moved to the document body
		const body = document.body;
		let back, cont;
		for (let i = 0; i < body.childNodes.length; i++) {
			const node = body.childNodes[i]
			if (node.className == "__uic_ctxm_background") back = node
			else if (node.className == "__uic_ctxm_container") cont = node
			if (back && cont) break
		}
		body.removeChild(back)
		body.removeChild(cont)
	},
	methods: {
		// Calculates and directly sets the position of the context menu on screen
		calculatePosition() {
			const rootEl = this.$refs.root
			const rootRect = rootEl.getBoundingClientRect()
			const viewportDimensions = document.documentElement.getBoundingClientRect()
			const contentDimensions = this.$refs.content.getBoundingClientRect()
			const containerStyle = this.$refs.container.style
			const ssm = this.appearance.screenSpaceMargin

			// Get root screen coordinates and content dimensions
			let posLeft = rootRect.left
			let posTop = rootRect.top
			let szHeight = contentDimensions.height
			let szWidth = contentDimensions.width

			if (this.preferParentWidth && rootRect.width > szWidth) szWidth = rootRect.width

			// Determine actual screen space boundaries taking ssm into account
			const maxWidth = viewportDimensions.width - ssm * 2
			const maxHeight = viewportDimensions.height - ssm * 2

			// Correct positioning to not cross the screen margin boundaries negatively
			if (posLeft < ssm) posLeft = ssm
			if (posTop < ssm) posTop = ssm

			// Compute the final container container size to fit the screen space boundaries
			if (szWidth > maxWidth) szWidth = maxWidth
			if (szHeight > maxHeight) szHeight = maxHeight

			// Compute the final context menu position so it doesn't cross the screen boundaries
			if (szWidth + posLeft > maxWidth) posLeft = maxWidth - szWidth + ssm
			if (szHeight + posTop > maxHeight) posTop = maxHeight - szHeight + ssm

			// Finally set the container styles
			containerStyle.left = posLeft + 'px'
			containerStyle.top = posTop + 'px'
			containerStyle.width = szWidth + 'px'
			containerStyle.height = szHeight + 'px'
		},
		onFocusChanged() {
			if (!this.show) return
			if (isParent(this.$refs.content, document.activeElement)) return

			// Close the context menu when the currently focused element is outside of it
			this.close()
		},
		onKeydown(event) {
			if (
				(event.key == 'Escape' || event.key == 'Esc' || event.keyCode == 27) &&
				(event.target.nodeName == 'BODY')
			) {
				event.preventDefault()
				this.onFocusLost()
			}
		},
		onFocusLost() {
			// Move the elements back to the root scope
			prependElement(this.$refs.root, this.$refs.container)
			prependElement(this.$refs.root, this.$refs.background)

			// Reset focus
			document.activeElement.blur()

			this.close()
			this.unlink()
		},
		unlink() {
			window.removeEventListener('keydown', this.onKeydown)
			window.removeEventListener('resize', this.onFocusLost)
			window.removeEventListener('focus', this.onFocusChanged)
		},
		close() {
			this.$emit('close')
		}
	}
}
</script>

<style lang="stylus">
.__uic_ctxm_
	&root
		position: absolute
		width: 100%
		height: 100%
		top: 0px
		left: 0px
		pointer-events: none

	&background
		position: fixed
		top: 0px
		left: 0px
		width: 100%
		height: 100%
		z-index: 99999998

	&container
		position: fixed
		z-index: 99999999
		margin: 0
		padding: 0
		background-color: #fff
		border-radius: .1rem
		box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)
		cursor: default
		overflow: hidden
		&-enter-active
			transition: transform .3s, opacity .3s
		&-leave-active
			transition: transform .3s, opacity .3s
		&-enter
			opacity: 0
			transform: translateY(-6px)
		&-leave-to
			opacity: 0
			transform: translateX(-6px)

	&content
		height: 100%
		width: 100%
		outline: none
		display: inline-block
</style>
