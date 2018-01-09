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
		}
	},
	mounted() {
		const contentEl = this.$refs.content
		const containerEl = this.$refs.container
		this.enableTransition()
		new ResizeSensor(contentEl, () => {
			console.log('Changed to ' + contentEl.offsetWidth + " x " + contentEl.offsetHeight)
			this.updateContainer()
		})
	},
	watch: {
		enabled(enabled) {
			console.log('ENABLED CHANGED:', enabled)
			if (enabled) this.enableTransition()
			else this.disableTransition()
		}
	},
	methods: {
		updateContainer() {
			const contentEl = this.$refs.content
			const containerEl = this.$refs.container
			
			containerEl.style.width = contentEl.offsetWidth + 'px'
			containerEl.style.height = contentEl.offsetHeight + 'px'
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
