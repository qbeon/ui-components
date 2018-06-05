<template>
<div
class="__uic_ltf_root"
:tabindex="tabindex"
@focus="onFocused">
	<labeled-field
	:title="title"
	:selected="inputIsFocused || !empty || placeholder != null"
	class="__uic_ltf_body"
	@contentSizeChanged="onContentSizeChanged">
		<div slot="contents">
			<transition name="__uic_ltf_placeholder">
				<span
				class="__uic_ltf_placeholder"
				v-show="!inputIsFocused && value == null">{{placeholder}}</span>
			</transition>

			<input
			v-if="!isMultiline"
			ref="input"
			class="__uic_ltf_input"
			tabindex="-1"
			:value="value"
			@focus="onInputFocused"
			@change="onInputComplete"
			@input="(e) => onInput(e.target.value)"
			@blur="onBlur"/>

			<textarea
			v-if="isMultiline"
			ref="textarea"
			class="__uic_ltf_textarea"
			:rows="currentLineNumber"
			tabindex="-1"
			:value="value"
			@focus="onInputFocused"
			@change="onInputComplete"
			@input="(e) => onInput(e.target.value)"
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
		title: {
			type: String
		},
		placeholder: {
			type: String
		},
		value: {
			type: String
		},
		maxLines: {
			type: Number
		},
		validator: {
			type: Function
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
		validateOnInit: {
			type: Boolean,
			required: false,
			default: false
		},
		appearance: {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	data() {
		return {
			isInitValue: true,
			empty: true,
			currentLineNumber: 1,
			tabindex: 0,
			inputIsFocused: false,
		}
	},
	computed: {
		isMultiline() {
			if (this.maxLines != null && this.maxLines != 1) return true
			return false
		}
	},
	created() {
		this.onInput(this.value)
	},
	watch: {
		value(val) {
			if (val != null && val.length > 0) this.empty = false
			else {
				this.empty = true
				val = null
			}
			this.$emit('valueChanged', val)
		},
		maxLines() {
			if (this.isMultiline) this.$nextTick(this.updateSize)
		}
	},
	methods: {
		onInputComplete() {
			this.$emit('valueChanged', this.value)

			// Validate if necessary
			if (this.validateOn === 'complete') this.validate(this.value)
		},
		onInput(val) {
			if (val != null && val.length > 0) this.empty = false
			else {
				this.empty = true
				val = null
			}

			this.$emit('input', val)

			// Validate
			if (!this.isInitValue && this.validateOn === 'input') {
				this.validate(val)
			} else {
				if (this.validateOnInit) this.validate(val)
				this.isInitValue = false
			}
		},
		validate(val) {
			if (this.validator) {
				if (this.validator(val) === true) this.$emit('valid')
				else this.$emit('invalid')
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
		onInputFocused() {
			this.tabindex = -1
			this.inputIsFocused = true
		},
		onFocused() {
			this.inputIsFocused = true
			this.$nextTick(() => {
				if (this.isMultiline) this.$refs.textarea.focus()
				else this.$refs.input.focus()
			})
		},
		onBlur() {
			this.tabindex = 0
			this.inputIsFocused = false
			if (this.value && this.value.length > 0) return
		},
		onContentSizeChanged() {
			if (this.isMultiline) this.updateSize()
		}
	}
}
</script>

<style lang="stylus">
.__uic_ltf_
	&root
		font-size: 0px
		outline: none
	&body
		cursor: pointer
	&placeholder
		position: absolute
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
		pointer-events: none
		color: #aaa
		&-enter-active
			transition: opacity .2s
		&-leave-active
			transition: opacity .2s
		&-enter
			opacity: 0
		&-leave-to
			opacity: 0
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
