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
import { addClass, removeClass } from './util.js'
import { ResizeSensor } from 'css-element-queries'

export default {
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
	mounted() {
		const contentEl = this.$refs.content
		const containerEl = this.$refs.container
		this.setMode()
		this.enableTransition()
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

			switch (this.mode) {
			case 'width':
				containerEl.style.width = contentEl.offsetWidth + 'px'
				return
			case 'height':
				containerEl.style.height = contentEl.offsetHeight + 'px'
				return
			default:
				containerEl.style.width = contentEl.offsetWidth + 'px'
				containerEl.style.height = contentEl.offsetHeight + 'px'
				return
			}
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
