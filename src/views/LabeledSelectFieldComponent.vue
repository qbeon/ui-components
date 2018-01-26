<template>
<component-page
name="Labeled Select Field"
:subComponents="{
	LabeledFieldComponent: 'LabeledField',
	MenuComponent: 'Menu',
	ScrollableComponent: 'Scrollable'
}">
	<p slot="description">The select field component is very similar to the native select elements, but in contrast to native select elements, the select field component provides consistent UX across all browsers and devices.</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default"
		:controls="{
			'Clear': () => {default_values = [null, null]},
			'Random': () => {
				default_values = [
					random(elements),
					random(elementGroupNobleGases)
				]
			}
		}">
			<p slot="description">The default raw select field is mostly unstyled</p>
			<labeled-select-field
			class="field"
			title="Many options"
			:options="elements"
			v-model="default_values[0]">
			</labeled-select-field>

			<labeled-select-field
			class="field"
			title="Few options"
			:options="elementGroupNobleGases"
			v-model="default_values[1]">
			</labeled-select-field>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Clear': () => {customization_values = [null, null]},
			'Random': () => {
				customization_values = [
					random(elements),
					random(elementGroupNobleGases)
				]
			}
		}">
			<p slot="description">The select field component can be customized and styled</p>
			<labeled-select-field
			class="field styled small"
			title="Many options"
			:options="elements"
			v-model="customization_values[0]">
			</labeled-select-field>

			<labeled-select-field
			class="field styled large"
			title="Few options (wide)"
			:options="elementGroupNobleGases"
			v-model="customization_values[1]">
			</labeled-select-field>
		</section-card>

		<!-- Grouped Options -->
		<section-card name="Grouped Options">
			<labeled-select-field
			class="field styled large"
			title="Grouped"
			:options="elements"
			v-model="groupedOptions_values[0]">
			</labeled-select-field>
		</section-card>
	</div>
</component-page>
</template>

<script>
import {
	elements,
	elementGroupNobleGases,
	elementNamesGrouped
} from '../util/testData.js'

import UtilComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

export default {
	components: {
		'component-page': UtilComponentPage,
		'section-card': SectionCard,
	},
	data() {
		return {
			elements: elements,
			elementNamesGrouped: elementNamesGrouped,
			elementGroupNobleGases: elementGroupNobleGases,

			// Sections
			default_values: [null, null],
			customization_values: [null, null],
			groupedOptions_values: [null, null]
		}
	},
	methods: {
		random(set) {
			const keys = Object.keys(set)
			return keys[Math.floor(Math.random() * keys.length)]
		}
	}
}
</script>

<style lang="stylus" scoped>
h6
	margin-bottom: .25rem
.desc
	margin-bottom: 1rem

.field
	display: block
	margin-bottom: 1rem
	&.inlined
		display: inline-block
	&:last-child
		margin-bottom: 0px
	&.small
		width: 6rem
	&.medium
		width: 12rem
	&.large
		width: 100%
	&.styled
		border: 1px solid #DDD
		border-radius: .25rem
		padding: .2rem
		padding-left: .5rem
		padding-right: .5rem
</style>
