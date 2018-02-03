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
		name="Default">
			<p slot="description">The default date picker is mostly unstyled</p>
			<uic-date-picker/>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Clear': () => {customization_model = null},
			'Random': () => {customization_model = randomDate()}
		}">
			<uic-date-picker
			class="field styled"
			v-model="customization_model"/>

			<p v-if="customization_model">
				<b>Selected date:</b> {{customization_model}}
			</p>
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
			customization_model: new Date(Date.now())
		}
	},
	methods: {
		randomDate() {
			return new Date(randomNumber(1970, 2100), randomNumber(0, 11), 1)
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
		width: calc(100% - 2rem)
		border: 1px solid #DDD
		border-radius: .25rem
		//padding: .2rem
		//padding-left: .5rem
		//padding-right: .5rem
		padding: 1rem
</style>
