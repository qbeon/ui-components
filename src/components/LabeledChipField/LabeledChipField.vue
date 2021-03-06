<template>
	<div
	class="__uic_lcf_root"
	:tabindex="tabindex"
	@focus="onFocus"
	@mousedown="onMousedown"
	@mouseup="onMouseup">
		<labeled-field
		:title="title"
		:selected="focused || !empty"
		class="__uic_lcf_body"
		@contentSizeChanged="onContentSizeChanged">
			<div
			slot="contents"
			class="__uic_lcf_list">
				<transition-group
				name="__uic_lcf_list-item"
				mode="out-in">
					<div
					class="__uic_lcf_list-item"
					v-for="chip in chips"
					:key="chip.index">
						<slot
						:index="chip.index"
						:value="chip.value"
						:remove="chip.remove">
							<div class="__uic_lcf_chip">
								<span>{{chip.value}}</span>
								<div
								class="__uic_lcf_remove-button"
								v-html="crossIcon"
								@click="chip.remove()"></div>
							</div>
						</slot>
					</div>
				</transition-group>
				<text-field
				ref="input"
				class="__uic_lcf_input"
				tabindex="-1"
				v-model="inputValue"
				@input="onInput"
				@accepted="onInputFinished"
				@focus="onInputFocused"
				@blur="onBlur"
				@keydown="onKeydown"/>
			</div>
		</labeled-field>
	</div>
</template>

<script>
import TextField from '../TextField/TextField.vue'
import LabeledField from '../LabeledField/LabeledField.vue'
import { Cross } from '../icons'

const appearance = {
	default: {},
	validator(val) {
		return true
	}
}

export default {
	name: 'labeled-chip-field',
	appearance,
	components: {
		TextField,
		LabeledField
	},
	props: {
		'title': {
			type: String,
			required: false
		},
		value: {
			type: [Object, Array],
			required: false,
			validator(value) {
				if (!(value instanceof Array)) return false
				return true
			}
		},
		maxLines: {
			type: Number,
			required: false
		},
		terminatingCharacters: {
			type: Array,
			required: false,
			validator(arr) {
				// Ensure the list of terminating characters doesn't contain strings
				let itr = arr.length
				while (itr--) {
					if (arr[itr].length !== 1) {
						console.error('Invalid terminating character: ' + arr[itr])
						return false
					}
				}
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
			tabindex: 0,

			// Is set to true when the root element ist clicked
			// to prevent unselecting on text field blur
			mouseDown: false,

			// Defines whether the labaled field is closed or opened
			focused: false,

			// Mirrors the text input value
			inputValue: '',

			// Provides the SVG icon
			crossIcon: Cross,

			// Mirrors the value property providing the items additional
			// information and funtionality such as the remove method
			chips: {},

			lastIndex: -1,

			// Defines whether there are any chips in the field
			empty: true,

			// Defines the current number of lines
			currentLineNumber: 1
		}
	},
	computed: {
		isMultilineField() {
			return this.isMultiline()
		}
	},
	created() {
		this.init()
	},
	watch: {
		value() {
			this.init()
			this.$emit('input', this.value)
		},
		maxLines() {
			if (this.isMultiline()) this.$nextTick(this.updateSize)
		}
	},
	methods: {
		init() {
			this.chips = {}
			if (this.value == null || this.value.length < 1) {
				this.empty = true
				return
			}
			this.empty = false
			for (let itr = 0; itr < this.value.length; itr++) {
				const value = this.value[itr]
				if (value.length < 0) continue
				this.$set(this.chips, itr, {
					index: itr,
					value: value,
					remove: () => this.removeChip(itr)
				})
			}
			this.lastIndex = this.value.length - 1
		},
		isMultiline() {
			if (this.maxLines != null && this.maxLines != 1) return true
			return false
		},
		onFocus() {
			this.focused = true
			// Defer the focus until the input is actually rendered
			this.$nextTick(() => {
				this.$refs.input.focus({preventScroll: true})
			})
		},
		addChip(value) {
			if (value.length < 0) return
			const newValue = this.value ? this.value : []
			newValue.push(value)
			this.$emit('input', newValue)
		},
		removeChip(index) {
			if (!this.value
				|| !(index in this.chips)
				|| this.value.length < 1
			) return
			this.value.splice(index, 1)
			this.$emit('input', this.value)
		},
		updateSize() {
			// Update size
		},
		onMousedown() {
			this.mouseDown = true
		},
		onMouseup() {
			this.mouseDown = false
		},
		onInputFocused() {
			// Make the root temporarily not tab-focusable
			this.tabindex = -1
		},
		onInput(value) {
			this.inputValue = value
			if (value.length < 1) return

			// Check whether the last input character is a terminating character
			if (!this.terminatingCharacters) return
			const lastChar = value[value.length - 1]
			if (this.terminatingCharacters.indexOf(lastChar) < 0) return

			// Prevent terminating characters from being typed in the beginning of the string
			if (value.length < 2) {
				this.$nextTick(() => this.inputValue = '')
				return
			}
			this.addChip(value.slice(0, value.length - 1))
			this.inputValue = ''
		},
		onInputFinished(value) {
			if (!value || value.length < 1) return
			this.addChip(value)
			this.inputValue = ''
		},
		onKeydown(event) {
			const key = event.keyCode || event.charCode
			if(key !== 8 || this.inputValue.length > 0 || this.lastIndex < 0) return
			this.removeChip(this.lastIndex)
		},
		onBlur() {
			// Don't unfocus the component when the root was clicked
			// while the input was focused
			if (this.mouseDown) return
			this.focused = false

			// Make the root tab-focusable again
			this.tabindex = 0
		},
		onContentSizeChanged() {
			if (this.isMultiline()) this.updateSize()
		}
	}
}
</script>

<style lang="stylus">
.__uic_lcf_
	&root
		font-size: 0px
		outline: none

	&list
		margin-top: .25rem
		line-height: 1.75rem

	&list-item
		display: inline-block
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .3s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0

	&chip
		font-size: 1rem
		padding: .2rem
		color: white
		background-color: #0091EA
		margin-right: .25rem
		padding-left: .5rem
		border-radius: 1rem
		span
			color: inherit

	&input
		margin-left: .25rem
		padding-top: .25rem
		padding-bottom: .25rem
		max-width: calc(100% - .5rem)
		display: inline-block
		font-size: 1rem
		line-height: 1.5rem
		outline: none

	&remove-button
		max-height: 1.5rem
		margin-left: .25rem
		padding-left: .25rem
		padding-right: .5rem
		display: inline-block
		cursor: pointer
		svg
			color: white
			width: .5rem
			height: .75rem
</style>
