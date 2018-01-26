<template>
	<div
	ref="container"
	class="__uic_size-transition_container">
		<div
		ref="content"
		class="__uic_size-transition_content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { addClass, removeClass } from '../util.js'
import { ResizeSensor } from 'css-element-queries'

export default {
	name: 'size-transition',
	props: {
		enabled: {
			type: Boolean,
			required: false,
			default: true
		},
		mode: {
			type: String,
			required: false,
			default: 'both',
			validator(val) {
				switch(val) {
				case 'width':
				case 'height':
				case 'both':
					return true
				default:
					return false
				}
			}
		}
	},
	data() {
		return {
			lastWidth: 0,
			lastHeight: 0
		}
	},
	mounted() {
		const contentEl = this.$refs.content
		const containerEl = this.$refs.container
		this.setMode()
		this.enableTransition()
		this.updateContainer()
		new ResizeSensor(contentEl, () => {
			this.updateContainer()
		})
	},
	watch: {
		enabled(enabled) {
			if (enabled) this.enableTransition()
			else this.disableTransition()
		},
		mode() {
			this.setMode()
		}
	},
	methods: {
		setMode() {
			const contentEl = this.$refs.content
			switch (this.mode) {
			case 'width':
				contentEl.style.height = '100%'
				return
			case 'height':
				contentEl.style.width = '100%'
				return
			}
		},
		updateContainer() {
			const contentEl = this.$refs.content
			const containerEl = this.$refs.container
			const style = containerEl.style
			const contentWidth = contentEl.offsetWidth
			const contentHeight = contentEl.offsetHeight

			// Prevent unnecessary update
			if (this.lastWidth == contentWidth &&
				this.lastHeight == contentHeight
			) return

			switch (this.mode) {
			case 'width':
				style.width = contentWidth + 'px'
				break
			case 'height':
				style.height = contentHeight + 'px'
				break
			default:
				style.width = contentWidth + 'px'
				style.height = contentHeight + 'px'
				break
			}

			// Remember latest update
			this.lastWidth = contentWidth
			this.lastHeight = contentHeight

			this.$emit('contentSizeChanged', {
				width: contentWidth,
				height: contentHeight
			})
		},
		enableTransition() {
			addClass(this.$refs.container, '__uic_size-transition_container_animated')
		},
		disableTransition() {
			removeClass(this.$refs.container, '__uic_size-transition_container_animated')
		}
	}
}
</script>

<style lang="stylus">
.__uic_size-transition
	&_container
		box-sizing: content-box
		display: inline-block
		&_animated
			-webkit-transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
			transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)

	&_content
		display: inline-block
</style>
