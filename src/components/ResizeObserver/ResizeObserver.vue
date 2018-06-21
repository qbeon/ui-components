<template>
<div ref="root">
	<slot></slot>
</div>
</template>

<script>
import { ResizeSensor } from 'css-element-queries'

export default {
	name: 'resize-observer',
	props: {
		triggeredOnInit: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	mounted() {
		new ResizeSensor(this.$refs.root, this.emitSize)
		if (this.triggeredOnInit) this.emitSize()
	},
	methods: {
		emitSize() {
			this.$emit('changed', {
				width: this.$refs.root.offsetWidth,
				height: this.$refs.root.offsetHeight
			})
		}
	}
}
</script>
