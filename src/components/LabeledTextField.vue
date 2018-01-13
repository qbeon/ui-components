<template>
<div
:class="config.class.root"
@click="activate">
	<labeled-field
	:title="title"
	:selected="activated"
	:class="config.class.body">
		<div slot="contents">
			<input
			ref="input"
			:class="config.class.input"
			v-model="currentValue"
			@change="onInputComplete"
			@input="onInput"
			@blur="onBlur"/>
		</div>
	</labeled-field>
</div>
</template>

<script>
import LabeledField from '../components/LabeledField.vue'

const appearance = {
	default: {},
	validator(val) {
		return true
	}
}

export default {
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
		'appearance': {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	data() {
		const prefix = '__uic_labeled-text-field_'
		return {
			config: {
				class: {
					root: prefix + 'root',
					input: prefix + 'input'
				}
			},
			activated: false,
			currentValue: ''
		}
	},
	created() {
		if (this.value) {
			this.activated = true
			this.currentValue = this.value
		}
	},
	watch: {
		value(val) {
			if (val && val.length > 0) this.setValue(val)
			else this.setValue(null)
		}
	},
	methods: {
		onInputComplete() {
			this.$emit('valueChanged', this.currentValue)
		},
		onInput() {
			this.$emit('input', this.currentValue)
		},
		setValue(value) {
			if (value === null) {
				this.currentValue = ''
				if(this.$refs.input !== document.activeElement) this.activated = false
			} else {
				this.currentValue = value
				this.activated = true
			}
			this.$emit('valueChanged', value)
		},
		activate() {
			this.activated = true
			this.$nextTick(() => {
				this.$refs.input.focus()
			})
		},
		onBlur() {
			if (this.currentValue && this.currentValue.length > 0) return
			this.activated = false
		}
	}
}
</script>

<style lang="stylus">
.__uic_labeled-text-field_
	&root
		font-size: 0rem
	&body
		font-size: 0rem
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
</style>
