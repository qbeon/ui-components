<template>
	<div
	:class="config.class.root"
	@click="activate">
		<labeled-field
		:title="title"
		:selected="!empty"
		:class="config.class.body"
		@contentSizeChanged="onContentSizeChanged">
			<div
			slot="contents"
			:class="config.class.list">
				<transition-group
				:name="config.class.listItem"
				mode="out-in">
					<div
					:class="config.class.listItem"
					v-for="chip in chips"
					:key="chip.index">
						<slot
						:index="chip.index"
						:value="chip.value"
						:remove="chip.remove">
							<div :class="config.class.chip">
								<span>{{chip.value}}</span>
								<div
								:class="config.class.removeButton"
								v-html="icons.cross"
								@click="chip.remove()"></div>
							</div>
						</slot>
					</div>
				</transition-group>
				<text-field
				ref="input"
				:class="config.class.input"
				v-model="inputValue"
				@input="onInput"
				@accepted="onInputFinished"
				@blur="onBlur"/>
			</div>
		</labeled-field>
	</div>
</template>

<script>
import TextField from './TextField.vue'
import LabeledField from './LabeledField.vue'
import Icons from './icons.js'

const appearance = {
	default: {},
	validator(val) {
		return true
	}
}

export default {
	appearance,
	components: {
		'text-field': TextField,
		'labeled-field': LabeledField
	},
	props: {
		'title': {
			type: String,
			required: false
		},
		'values': {
			type: Array,
			required: false
		},
		maxLines: {
			type: Number,
			required: false
		},
		'appearance': {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	data() {
		const prefix = '__uic_labeled-chip-field_'
		return {
			config: {
				class: {
					root: prefix + 'root',
					body: prefix + 'body',
					list: prefix + 'list',
					listItem: prefix + 'list-item',
					chip: prefix + 'chip',
					input: prefix + 'input',
					removeButton: prefix + 'remove-button'
				}
			},

			// Incremental id
			inputValue: '',
			icons: Icons,
			chips: {},
			empty: true,
			currentLineNumber: 1
		}
	},
	computed: {
		isMultilineField() {
			return this.isMultiline()
		}
	},
	created() {
		this.createChipsFromValues()
	},
	watch: {
		values() {
			this.createChipsFromValues()
		},
		chips(value) {
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
		activate() {
			this.empty = false
			this.$nextTick(() => {
				if (this.isMultiline()) this.$refs.textarea.focus()
				else this.$refs.input.focus()
			})
		},
		createChipsFromValues() {
			this.chips = {}

			if (!this.values || this.values.length < 1) {
				this.empty = true
				return
			}
			this.empty = false

			for (let itr = 0; itr < this.values.length; itr++) {
				const value = this.values[itr]
				if (value.length < 0) continue
				this.$set(this.chips, itr, {
					index: itr,
					value: value,
					remove: () => this.removeChip(itr)
				})
			}
		},
		addChip(value) {
			if (value.length < 0) return
			this.$emit('chipAdded', value)
		},
		removeChip(index) {
			if (!(index in this.chips)) return
			const value = this.chips[index].value
			this.$emit('chipRemoved', {
				value: value,
				index: index
			})
		},
		updateSize() {
			// Update size
		},
		onInput(value) {
			// TODO: implement auto-terminating characters
			this.inputValue = value
		},
		onInputFinished(value) {
			if (!value || value.length < 1) return
			this.addChip(value)
			this.inputValue = ''
		},
		onBlur() {
			if (this.values && this.values.length > 0) return
			this.empty = true
		},
		onContentSizeChanged() {
			if (this.isMultiline()) this.updateSize()
		}
	}
}
</script>

<style lang="stylus">
.__uic_labeled-chip-field_
	&root
		font-size: 0px

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

	&input
		margin-left: .25rem
		padding-top: .25rem
		padding-bottom: .25rem
		max-width: 100%
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
