<template>
<div
:class="config.class.root">
	<span
	ref="pseudo"
	:class="config.class.pseudo"></span>
	<input
	ref="input"
	:class="config.class.input"
	v-model="currentValue"
	@change="onInputComplete"
	@input="onInput"
	@blur="onBlur"
	@click="onClick"
	@keydown="onKeydown"/>
</div>
</template>

<script>

export default {
	name: 'text-field',
	props: {
		'value': {
			type: String,
			required: false
		}
	},
	data() {
		const prefix = '__uic_labeled-text-field_'
		return {
			config: {
				class: {
					root: prefix + 'root',
					input: prefix + 'input',
					textarea: prefix + 'textarea',
					pseudo: prefix + 'pseudo'
				}
			},
			currentValue: ''
		}
	},
	created() {
		if (this.value) this.currentValue = this.value
	},
	mounted() {
		// Update size
		this.updateSize()
	},
	watch: {
		value(value) {
			this.currentValue = value
			this.updateSize()
		}
	},
	methods: {
		clearValue() {
			this.currentValue = ''
		},
		focus() {
			this.$refs.input.focus()
		},
		onInputComplete() {
			this.$emit('accepted', this.currentValue)
		},
		onInput() {
			this.updateSize()
			this.$emit('input', this.currentValue)
		},
		updateSize() {
			const pseudoEl = this.$refs.pseudo
			pseudoEl.textContent = this.currentValue
			const textWidth = pseudoEl.clientWidth
			const textHeight = pseudoEl.clientHeight

			const inputElStyles = this.$refs.input.style
			// A small threshold of 2 pixels is added to prevent small incorrections
			inputElStyles.width = (textWidth + 2) + 'px'

			this.$emit('textSizeChanged', {
				width: textWidth,
				height: textHeight
			})
		},
		onBlur(event) {
			this.$emit('blur', event)
		},
		onKeydown(event) {
			this.$emit('keydown', event)
		},
		onClick(event) {
			this.$emit('click', event)
		}
	}
}
</script>

<style lang="stylus">
.__uic_labeled-text-field_
	&root
		font-size: 0px
	&body
		cursor: pointer
	&input
		width: 100%
		outline: none
		border: 0px
		height: 1.75rem
		line-height: 1.75rem
		overflow: hidden
		white-space: nowrap
		text-overflow: ellipsis
		min-width: 1rem
		max-width: 100%
	&textarea
		resize: none
		width: 100%
		outline: none
		border: 0px
		line-height: 1.5rem
	&pseudo, &input, &textarea
		font-family: sans-serif
		font-size: 1rem
		line-height: 1.5rem
	&pseudo
		position: absolute
		visibility: hidden
		height: auto
		width: auto
		white-space: pre
</style>
