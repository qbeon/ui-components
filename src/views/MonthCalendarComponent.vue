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
		name="Customization">
			<p slot="description">The visuals appearance can be customized.</p>
			<uic-month-calendar
			class="field styled"
			:value="{displayedMonth: new Date(Date.now()), selectedDay: {date: new Date(Date.now())}}"
			:maxYear="maxYear"
			:minYear="minYear"/>
		</section-card>

		<!-- Navigation -->
		<section-card
		name="Navigation"
		:controls="{
			'Default': () => {
				navigation_model = {}
			},
			'Random': () => {
				navigation_model = {
					displayedMonth: randomDate()
				}
			}
		}">
			<p slot="description">The month calendar can be navigated back and forth.</p>
			<uic-month-calendar
			class="field"
			:navigable="true"
			:maxYear="maxYear"
			:minYear="minYear"
			v-model="navigation_model"/>
			<p><b>Displayed Month:</b> {{formatMonth(navigation_model.displayedMonth)}}</p>
		</section-card>

		<!-- Selection -->
		<section-card
		name="Selection">
			<p slot="description">Individual days can be selected</p>
			<uic-month-calendar
			class="field"
			:navigable="true"
			v-model="selection_model"
			selectionMode="day"/>

			<p v-if="selection_model.selectedDay.date">
				<b>Selected day:</b>
				{{selection_model.selectedDay.date.getFullYear()}}
				- {{selection_model.selectedDay.date.getMonth() + 1}}
				- {{selection_model.selectedDay.date.getDate()}}<br>
				{{selection_model.selectedDay.date.toUTCString()}}<br>
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
		return {
			// Sections
			navigation_model: {displayedMonth: new Date()},
			selection_model: {
				displayedMonth: new Date(),
				selectedDay: {
					date: new Date(Date.now())
				},
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
		},
		formatMonth(date) {
			const monthNames = [
				"January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			]
			return monthNames[date.getMonth()] + ' ' + date.getFullYear()
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
