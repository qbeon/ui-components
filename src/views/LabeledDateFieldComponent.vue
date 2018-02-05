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
			title="Customized Date Field"
			class="field styled"
			v-model="customization_model"/>

			<p class="indicator" v-if="customization_model">
				<b>Selected date:</b> {{customization_model}}
			</p>
		</section-card>

		<!-- Internationalization -->
		<section-card
		name="Internationalization">
			<p slot="description">The locale property defines the translations locale of all texts of the component.</p>
			<uic-labeled-date-field
			class="field"
			:title="'Localized Date (' + i18n_locale + ')'"
			:locale="i18n_locale"
			v-model="i18n_model"/>

			<uic-labeled-text-field
			title="Locale"
			:value="i18n_locale"
			@input="i18n_localeChanged"/>
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
			customization_model: new Date(Date.now()),
			i18n_model: new Date(Date.now()),
			i18n_locale: 'ru-RU'
		}
	},
	methods: {
		randomDate() {
			const date = new Date(Date.UTC(randomNumber(1970, 2100), randomNumber(0, 11), 0))
			const maxDays = daysInMonth(date)
			date.setUTCDate(randomNumber(1, maxDays))
			return date
		},
		i18n_localeChanged(val) {
			if (val.length != 5) return
			else this.i18n_locale = val
		}
	}
}
</script>

<style lang="stylus" scoped>
.indicator
	margin-top: 1rem

.field
	margin-bottom: 1rem
	cursor: pointer
	width: 10rem
	&.inlined
		display: inline-block
	&:last-child
		margin-bottom: 0px
	&.styled
		width: calc(100% - 2rem)
		border: 1px solid #DDD
		border-radius: .25rem
		padding: .2rem
		padding-left: .5rem
		padding-right: .5rem
</style>
