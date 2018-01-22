<template>
	<div
	ref="root"
	:style="{pointerEvents: blurred ? 'none' : 'auto'}">
		<transition name="anim">
			<div
			ref="background"
			:class="config.class.background"
			@wheel="onFocusLost"
			v-show="show"
			@click="onFocusLost">
			</div>
		</transition>

		<transition :name="config.class.container">
			<div
			ref="container"
			:class="config.class.container"
			v-show="show">
				<div
				ref="content"
				:class="config.class.content"
				tabindex="-1"
				@contextmenu.capture.prevent>
					<slot></slot>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
function defaultScrollTopGetter() {
	if (window.pageYOffset !== undefined) return window.pageYOffset
	return (document.documentElement ||
		document.body.parentNode ||
		document.body
	).scrollTop
}

const appearance = {
	default: {
		screenSpaceMargin: 16
	},
	validator(val) {
		if(typeof val.screenSpaceMargin !== 'number') return false
		return true
	}
}

export default {
	appearance,
	name: 'context-menu',
	data() {
		const prefix = '__uic_context-menu_'
		return {
			config: {
				class: {
					background: prefix + 'background',
					container: prefix + 'container',
					content: prefix + 'content'
				}
			},
			blurred: false
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
			if (!val) {
				this.onFocusLost()
				this.blurred = true
				return
			}
			this.blurred = false

			this.$nextTick(() => {
				// Move the component elements to the document scope
				// to prevent any backround interactions
				document.body.prepend(this.$refs.background)
				document.body.prepend(this.$refs.container)

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
			let posLeft = rootRect.x
			let posTop = rootRect.y
			let szHeight = contentDimensions.height
			let szWidth = contentDimensions.width

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
		onFocusLost() {
			// Move the elements back to the root scope
			this.$refs.root.append(this.$refs.background)
			this.$refs.root.append(this.$refs.container)

			this.$emit("lostFocus")
			this.removeInteractionListeners()
		},
		onKeydown(event) {
			if (
				(event.key == 'Escape' || event.key == 'Esc' || event.keyCode == 27) &&
				(event.target.nodeName == 'BODY')
			) {
				event.preventDefault()
				this.$emit("lostFocus")
				this.removeInteractionListeners()
			}
		},
		removeInteractionListeners() {
			// Remove aborting interaction event listeners
			window.removeEventListener('keydown', this.onKeydown)
			window.removeEventListener('resize', this.onFocusLost)
		}
	}
}
</script>

<style lang="stylus">
.__uic_context-menu_
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
		outline: none
</style>
