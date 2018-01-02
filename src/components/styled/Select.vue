<template>
	<r-select
		class="field"
		:class="{opened: opened}"
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
	data() {
		return {
			opened: false
		}
	},
	methods: {
		onSelectionChanged(value) {
			this.$emit('selectionChanged', value)
		},
		onOpened() {
			this.opened = true
			this.$emit('opened')
		},
		onClosed() {
			this.opened = false
			this.$emit('closed')
		}
	},
}
</script>

<style lang="stylus" scoped>
.field
	cursor: pointer
	padding-bottom: .25rem
	border: 1px solid #DDD
	border-radius: .2rem
	padding: .5rem
	&.opened
		border: 1px solid #FFF
</style>

