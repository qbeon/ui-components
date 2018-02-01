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

			<p><b>Selection:</b> {{selection_model.selectedDay}}</p>

			<p v-if="selection_model.selectedDay.date">
				<b>Selected day:</b>
				{{selection_model.selectedDay.date.toUTCString()}}
			</p>
		</section-card>

		<!-- Non-Switching Selection -->
		<section-card
		name="Non-Switching Selection">
			<p slot="description">The calendar can be explicitly instructed to not switch the displayed month on foreign day (days from the previous or next month) selection.</p>
			<uic-month-calendar
			class="field"
			:navigable="true"
			disableSwitchingOnSelection
			v-model="nonSwitchingSelection_model"
			selectionMode="day"/>

			<p><b>Selection:</b> {{nonSwitchingSelection_model.selectedDay}}</p>

			<p v-if="nonSwitchingSelection_model.selectedDay.date">
				<b>Selected day:</b>
				{{nonSwitchingSelection_model.selectedDay.date.toUTCString()}}
			</p>
		</section-card>

		<!-- Non-Selectable Foreign Days -->
		<section-card
		name="Non-Selectable Foreign Days">
			<p slot="description">The calendar can be explicitly instructed to make the days from the previous and next month non-selectable.</p>
			<uic-month-calendar
			class="field"
			:navigable="true"
			disableForeignSelection
			v-model="nonSelectableForeign_model"
			selectionMode="day"/>

			<p><b>Selection:</b> {{nonSelectableForeign_model.selectedDay}}</p>

			<p v-if="nonSelectableForeign_model.selectedDay.date">
				<b>Selected day:</b>
				{{nonSelectableForeign_model.selectedDay.date.toUTCString()}}
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
			nonSwitchingSelection_model: {
				displayedMonth: new Date(),
				selectedDay: {
					date: new Date(Date.now())
				},
			},
			nonSelectableForeign_model: {
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
