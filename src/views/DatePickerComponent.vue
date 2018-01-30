<template>
<component-page
name="Date Picker"
:subComponents="{
	LabeledFieldComponent: 'LabeledField'
}">
	<p slot="description">The date picker component is a date picker element providing consistent UX across all browsers and devices.</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default"
		:controls="{
			'Clear': () => {default_value = [null, null]},
			'Random': () => {
				default_value = [
					random(),
					random()
				]
			}
		}">
			<p slot="description">The default date picker is mostly unstyled</p>
			<uic-date-picker
			v-model="default_value[0]">
			</uic-date-picker>
			<p>{{default_value[0]}}</p>
		</section-card>

		<!-- Styled -->
		<section-card
		name="Styled">
			<uic-date-picker
			class="field styled"
			v-model="customization_values[0]">
			</uic-date-picker>
		</section-card>
	</div>
</component-page>
</template>

<script>
import { elements } from '../util/testData.js'

import UtilComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

export default {
	components: {
		'component-page': UtilComponentPage,
		'section-card': SectionCard,
	},
	data() {
		return {
			// Sections
			default_value: [null, null],

			customization_values: [null],
		}
	},
	methods: {
		random() {
			const keys = Object.keys(elements)
			return elements[keys[Math.floor(Math.random() * keys.length)]]
		},
		isBigger4(val) {
			console.log('VAL', val)
			if(val != null && val.length > 4) return true
		}
	}
}
</script>

<style lang="stylus" scoped>
h6
	margin-bottom: .25rem
.desc
	margin-bottom: 1rem

.validation-indicator
	color: red
	&.valid
		color: green

.field
	display: block
	margin-bottom: 1rem
	cursor: pointer
	&.inlined
		display: inline-block
	&:last-child
		margin-bottom: 0px
	&.styled
		box-sizing: border-box
		width: 100%
		border: 1px solid #DDD
		border-radius: .25rem
		//padding: .2rem
		//padding-left: .5rem
		//padding-right: .5rem
		padding: 1rem
</style>
