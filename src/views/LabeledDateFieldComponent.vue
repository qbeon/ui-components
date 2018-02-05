<template>
<component-page
name="Labeled Date Field"
:subComponents="{
	LabeledFieldComponent: 'LabeledField',
	MenuComponent: 'Menu',
	DatePickerComponent: 'DatePicker',
	MonthCalendarComponent: 'MonthCalendar'
}">
	<p slot="description">SampleDescription</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default">
			<uic-labeled-date-field/>

			<p class="indicator" v-if="default_model">
				<b>Selected date:</b> {{default_model}}
			</p>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Clear': () => {customization_model = null},
			'Random': () => {customization_model = randomDate()}
		}">
			<uic-labeled-date-field
			v-model="customization_model"/>

			<p class="indicator" v-if="customization_model">
				<b>Selected date:</b> {{customization_model}}
			</p>
		</section-card>
	</div>
</component-page>
</template>

<script>
import { elements } from '../util/testData.js'
import randomNumber from '../util/randomNumber'

import UtilComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

function daysInMonth(month) {
	return new Date(Date.UTC(month.getFullYear(), month.getMonth() + 1, 0)).getDate()
}

export default {
	components: {
		'component-page': UtilComponentPage,
		'section-card': SectionCard,
	},
	data() {
		return {
			// Sections
			default_model: null,
			customization_model: new Date(Date.now()) 
		}
	},
	methods: {
		randomDate() {
			const date = new Date(Date.UTC(randomNumber(1970, 2100), randomNumber(0, 11), 0))
			const maxDays = daysInMonth(date)
			date.setUTCDate(randomNumber(1, maxDays))
			return date
		}
	}
}
</script>

<style lang="stylus" scoped>
.indicator
	margin-top: 1rem

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
