<template>
	<div class="input-container">
		<div class="input-wrapper" :class="[classes]">
			<label for="">
				<slot></slot>
			</label>
			<input v-if="!multiline"
				type="text" class="input-field"
				ref="input"
				@focus="focus()"
				@blur="blur()"
				@input="onInput($event)"
				:value="inpVal"
				:type="type"
				:required="required"
				:placeholder="placeholder"
				:min="min"
				:max="max"
			>
			<textarea v-if="multiline"
				class="textarea-field"
				ref="input"
				:placeholder="placeholder"
				:required="required"
				:autoResize="autoResize"
				:value="inpVal"
				:rows="rows"

				:style="{ height: this.inputHeight && `${this.inputHeight}px` }"
				@input="onInput"
				@focus="focus()"
				@blur="blur()"
			></textarea>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			default: null
		},
		type: {
			type: String,
			default: 'text'
		},
		required: {
			type: Boolean,
			default: true
		},
    rows: {
      type: Number,
      default: 3
    },
		multiline: Boolean,
		autoResize: Boolean,
		placeholder: String,
		min: String,
		max: String
	},
	data() {
		return {
			isFocused: false,
			inpVal: this.value,
			inputHeight: null
		}
	},
	watch: {
		value() {
			this.inpVal = this.value
		}
	},
	methods: {
		onInput(e) {
			this.inputValue = e.target.value
			this.multiline && this.autoResize && this.calcInputHeight()
		},
		blur(e) {
			this.$nextTick(() => (this.isFocused = false))
			this.$emit('blur', e)
		},
		focus(e) {
			this.isFocused = true
			this.$refs.input.focus()
			this.$emit('focus', e)
		},
		calcInputHeight() {
			this.inputHeight = null
			this.$nextTick(() => {
				const height = this.$refs.input.scrollHeight
				const minHeight = this.rows * 24
				const inputHeight = height < minHeight ? minHeight : height
				this.inputHeight = inputHeight
			})
		}
	},
	computed: {
		classes() {
			return {
				'input-focused': this.isFocused,
				'input-has-value': Boolean(this.inpVal || (this.placeholder && !this.inpVal)),
				'type-date': Boolean(this.type === 'date')
			}
		},
		inputValue: {
			get() {
				return this.value
			},
			set(v) {
				this.$emit('input', v)
				this.inpVal = v
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../styles/_vars.styl'

.input-container
	width: 100%
	display: block
	padding: 0.5rem
.input-wrapper
	position: relative

	label
		font-size: 0.85rem
		font-weight: normal
		position: absolute
		top: 0
		width: 100%
		margin-top: 0.7rem
		padding: 0 0.8rem
		z-index: 1
		user-select: none
		transform: translateY(3px)
		pointer-events: none
		overflow: hidden
		transition-property: color, padding
		transition: 0.2s ease-out

.input-field
	font-size: 16px
	box-shadow: 0 0 0 1px #d9d9d9
	border-radius: 4px
	display: block
	width: 100%
	padding: 1rem 0.8rem
	border: none

.input-focused, .input-has-value
	label
		margin: 0
		color: $secondary-text
	.input-field
		padding: 1.5rem 0.8rem .5rem
	.textarea-field
		padding: 1.5rem 0.8rem .5rem

.type-date
	label
		margin-top: 0;
	.input-field
		padding: 1.125rem 0.8rem .5rem

.textarea-field
	resize: none
	overflow hidden
	font-size: 16px
	box-shadow: 0 0 0 1px #d9d9d9
	border-radius: 4px
	padding: 1rem 0.8rem
	word-break: normal
	border: none
</style>
