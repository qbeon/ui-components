<template>
<div
class="__uic_ltf_root"
@click="activate">
	<labeled-field
	:title="title"
	:selected="!empty"
	class="__uic_ltf_body"
	@contentSizeChanged="onContentSizeChanged">
		<div slot="contents">
			<input
			v-show="!isMultilineField"
			ref="input"
			class="__uic_ltf_input"
			v-model="currentValue"
			@change="onInputComplete"
			@input="onInput"
			@blur="onBlur"/>

			<textarea
			v-show="isMultilineField"
			ref="textarea"
			class="__uic_ltf_textarea"
			:rows="currentLineNumber"
			v-model="currentValue"
			@change="onInputComplete"
			@input="onInput"
			@blur="onBlur">
			</textarea>
		</div>
	</labeled-field>
</div>
</template>

<script>
import LabeledField from '../LabeledField/LabeledField.vue'

const appearance = {
	default: {},
	validator(val) {
		return true
	}
}

export default {
	name: 'labeled-text-field',
	appearance,
	components: {
		'labeled-field': LabeledField,
	},
	props: {
		'title': {
			type: String,
			required: false
		},
		'value': {
			type: String,
			required: false
		},
		maxLines: {
			type: Number,
			required: false
		},
		validator: {
			type: Function,
			required: false
		},
		validateOn: {
			type: String,
			required: false,
			default: 'complete',
			validator(val) {
				if (val !== 'input' && val !== 'complete') return false
				return true
			}
		},
		'appearance': {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	data() {
		return {
			empty: true,
			currentValue: '',
			currentLineNumber: 1
		}
	},
	computed: {
		isMultilineField() {
			return this.isMultiline()
		}
	},
	created() {
		if (this.value) {
			this.empty = false
			this.currentValue = this.value
		}
		this.onInput()
	},
	watch: {
		value(val) {
			if (val && val.length > 0) this.setValue(val)
			else this.setValue(null)
		},
		currentValue(value) {
			// Update size only in case of multiline inputs
			if (this.isMultiline()) this.$nextTick(this.updateSize)
		},
		maxLines() {
			if (this.isMultiline()) this.$nextTick(this.updateSize)
		}
	},
	methods: {
		isMultiline() {
			if (this.maxLines != null && this.maxLines != 1) return true
			return false
		},
		onInputComplete() {
			this.$emit('valueChanged', this.currentValue)

			// Validate if necessary
			if (this.validateOn === 'complete') this.validate()
		},
		onInput() {
			this.$emit('input', this.currentValue)

			// Validate if necessary
			if (this.validateOn === 'input') this.validate()
		},
		validate() {
			if (this.validator) {
				if (this.validator(this.currentValue) === true) this.$emit('valid')
				else this.$emit('invalid')
				return
			}
		},
		countLines() {
			const textarea = this.$refs.textarea
			const style = (window.getComputedStyle) ?
				window.getComputedStyle(textarea) : textarea.currentStyle
			const lineHeight = parseInt(style.lineHeight, 10)
			const contentHeight = this.calculateContentHeight(lineHeight)
			return {
				height: lineHeight,
				total: Math.floor(contentHeight / lineHeight),
				displayed: textarea.clientHeight / lineHeight,
			}
		},
		calculateContentHeight(scanAmount) {
			const textarea = this.$refs.textarea
			const styles = textarea.style
			const initialHeight = styles.height
			const initialScrollHeight = textarea.scrollHeight
			let height = textarea.offsetHeight
			// Only bother if the textarea is bigger than the content
			if (height >= initialScrollHeight) {
				// Verify the browser supports changing dimension
				// calculations mid-way through a function call
				styles.height = (height + scanAmount) + 'px'
				if (initialScrollHeight < textarea.scrollHeight) {
					// Scan the textareas height downwards
					// until scrollHeight becomes larger than height
					while (textarea.offsetHeight >= textarea.scrollHeight) {
						styles.height = (height -= scanAmount) + 'px'
					}
					while (textarea.offsetHeight < textarea.scrollHeight) {
						styles.height = (height++) + 'px'
					}
					// Reset the textarea back to its original height
					styles.height = initialHeight
					return height
				}
			} else return initialScrollHeight
		},
		updateSize() {
			const textarea = this.$refs.textarea
			const lines = this.countLines()
			let height = textarea.scrollHeight

			if (
				lines.displayed === lines.total &&
				lines.displayed === this.maxLines
			) return

			if (this.maxLines > 0 && lines.total > this.maxLines) {
				height = lines.height * this.maxLines
			} else height = lines.height * lines.total

			this.currentLineNumber = lines.total
			textarea.style.height = height + 'px'
		},
		setValue(value) {
			if (value === null) {
				this.currentValue = ''
				const activeEl = document.activeElement
				if (
					(!this.isMultiline() && this.$refs.input !== activeEl) ||
					(this.isMultiline() && this.$refs.textarea !== activeEl)
				) this.empty = true
			} else {
				this.currentValue = value
				this.empty = false
			}
			this.$emit('valueChanged', value)
		},
		activate() {
			this.empty = false
			this.$nextTick(() => {
				if (this.isMultiline()) this.$refs.textarea.focus()
				else this.$refs.input.focus()
			})
		},
		onBlur() {
			if (this.currentValue && this.currentValue.length > 0) return
			this.empty = true
		},
		onContentSizeChanged() {
			if (this.isMultiline()) this.updateSize()
		}
	}
}
</script>

<style lang="stylus">
.__uic_ltf_
	&root
		font-size: 0px
	&body
		cursor: pointer
	&input
		width: 100%
		outline: none
		border: 0px
		font-size: 1rem
		height: 1.75rem
		line-height: 1.75rem
		overflow: hidden
		white-space: nowrap
		text-overflow: ellipsis
		background: none
		color: inherit
	&textarea
		resize: none
		width: 100%
		outline: none
		border: 0px
		font-size: 1rem
		line-height: 1.5rem
		background: none
		color: inherit
</style>
