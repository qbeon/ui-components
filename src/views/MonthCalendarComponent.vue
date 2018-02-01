<template>
<component-page
name="Month Calendar">
	<p slot="description">The month calendar component is a navigable one-month calendar visualizer.</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default">
			<p slot="description">The default date picker is mostly unstyled, points at January 1970 and prints a full 6-row layout. The individual days are not selectable by default.</p>
			<uic-month-calendar/>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Default': () => {
				customization_model = {displayedMonth: null, selectedDay: null}
			},
			'Random': () => {
				customization_model = {
					displayedMonth: randomDate(), selectedDay: null
				}
			}
		}">
			<p slot="description">The visuals and behavior can be customized. In the following example the month calendar is set to only be navigable between the year 2010 and 2020 and be day-selectable.</p>
			<uic-month-calendar
			class="field styled"
			v-model="customization_model"
			selectionMode="day"
			:maxYear="maxYear"
			:minYear="minYear"
			@daySelected="day => customization_model.selectedDay = day"/>

			<p>Min year: {{minYear}}</p>
			<p>Max year: {{maxYear}}</p>
			<p v-if="customization_model.displayedMonth">
				Displayed month:
				{{customization_model.displayedMonth.getFullYear()}}
				- {{customization_model.displayedMonth.getMonth() + 1}}
			</p>
			<p v-if="customization_model.selectedDay">
				Selected day: {{customization_model.selectedDay}}
			</p>
		</section-card>
	</div>
</component-page>
</template>

<script>
import { elements } from '../util/testData'
import randomNumber from '../util/randomNumber'

import UtilComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

export default {
	components: {
		'component-page': UtilComponentPage,
		'section-card': SectionCard,
	},
	data() {
		const currentMonth = new Date()
		currentMonth.setHours(0, 0, 0, 0)
		return {
			// Sections
			customization_model: {
				displayedMonth: currentMonth,
				selectedDay: 1,
			},
		}
	},
	computed: {
		minYear() {
			const current = new Date()
			current.setYear(current.getFullYear() - 2)
			return current.getFullYear()
		},
		maxYear() {
			const current = new Date()
			current.setYear(current.getFullYear() + 2)
			return current.getFullYear()
		}
	},
	methods: {
		randomDate() {
			return new Date(
				randomNumber(this.minYear, this.maxYear),
				randomNumber(0, 11),
				1
			)
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
