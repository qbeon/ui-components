<template><div class="page">
	<r-select class="field small"
		title="Independent Select Field"
		:options="options"
		v-on:selectionChanged="onSelectionChanged">
	</r-select>

	<r-select class="field"
		title="Independent Select Field"
		:options="options"
		v-on:selectionChanged="onSelectionChanged">
	</r-select>

	<styled-select class="field small"
		title="Automarke"
		:options="options"
		:selected="selected"
		v-on:selectionChanged="onSelectionChanged">
	</styled-select>

	<styled-select class="field"
		title="Automarke"
		:options="options"
		:selected="selected"
		v-on:selectionChanged="onSelectionChanged">
	</styled-select>

	<styled-select class="field small"
		title="Automarke"
		:options="options"
		:selected="selected"
		v-on:selectionChanged="onSelectionChanged">
	</styled-select>

	<styled-select class="field"
		title="Automarke"
		:options="options"
		:selected="selected"
		v-on:selectionChanged="onSelectionChanged">
	</styled-select>

	<material-select
		class="default-field"
		title="Automarke"
		:options="options"
		:selected="selected"
		v-on:selectionChanged="onSelectionChanged">
	</material-select>
	<button v-on:click="reset">Reset</button>
	<button v-on:click="setMercedesBenz">Mercedes Benz</button>
	<button v-on:click="setVolkswagen">Volkswagen</button>
</div></template>

<script>
import Select from '../components/Select.vue'
import StyledSelect from '../components/styled/Select.vue'
import MaterialSelect from '../components/material/Select.vue'

export default {
	components: {
		'material-select': MaterialSelect,
		'styled-select': StyledSelect,
		'r-select': Select
	},
	data() {
		return {
			options: {
				au: 'Audi',
				vw: 'Volkswagen',
				mrb: 'Mercedes-Benz',
				bmw: 'BMW',
				pr: 'Porsche',
				op: 'Opel',
				smt: 'Smart',
			},
			selected: 'pr'
		}
	},
	methods: {
		setMercedesBenz() {
			this.selected = "mrb"
		},
		setVolkswagen() {
			this.selected = "vw"
		},
		reset() {
			this.selected = null
		},
		onSelectionChanged(val) {
			this.selected = val
		}
	}
}
</script>

<style lang="stylus" scoped>
.page
	padding: 2rem
	box-sizing: border-box

button
	padding: .5rem
	margin-right: .5rem
	font-size: 1rem
	border-radius: .2rem

.field
	cursor: pointer
	margin-bottom: 1rem
	width: 16rem
	padding: .5rem
	&.small
		width: 4rem
</style>
