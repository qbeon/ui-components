<template>
	<r-select
		class="field"
		:title="title"
		:options="options"
		:selected="selected"
		@selectionChanged="onSelectionChanged"
		@opened="onOpened"
		@closed="onClosed"
		v-on:selectionChanged="onSelectionChanged">
	</r-select>
</template>

<script>
import Select from '../Select.vue'

export default {
	components: {
		'r-select': Select
	},
	props: {
		'title': {
			type: String,
			required: false
		},
		'options': {
			type: Object,
			required: true,
			validator(value) {
				for (let option in value) {
					if (typeof value[option] !== 'string') return false
				}
				return true
			},
		},
		'selected': {
			type: String,
			required: false
		}
	},
	methods: {
		onSelectionChanged(value) {
			this.$emit('selectionChanged', value)
		},
		onOpened() {
			this.$emit('opened')
		},
		onClosed() {
			this.$emit('closed')
		}
	},
}
</script>

<style lang="stylus" scoped>
.field
	cursor: pointer
	width: 7.5rem
	padding-bottom: .25rem
	border-bottom: 1px solid #DDD
</style>

