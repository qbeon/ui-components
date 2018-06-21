<template>
<component-page
name="Date Time Picker"
:subComponents="{
	LabeledFieldComponent: 'LabeledField'
}">
	<p slot="description">The date time picker component is a date time picker element providing consistent UX across all browsers and devices.</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default">
			<p slot="description">The default date time picker is mostly unstyled</p>
			<p>Selected: {{default_model ? default_model.toString() : 'null'}}</p>
			<uic-date-time-picker v-model="default_model"/>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Clear': () => {customization_model = null},
			'Random': () => {customization_model = randomDate()}
		}">
			<uic-date-time-picker
			class="field styled"
			v-model="customization_model"/>

			<p v-if="customization_model">
				<b>Selected date:</b> {{customization_model}}
			</p>
		</section-card>

		<!-- Internationalization -->
		<section-card
		name="Internationalization">
			<p slot="description">The locale property defines the translations locale of all texts of the component.</p>
			<uic-date-time-picker
			class="field"
			navigable
			:locale="i18n_locale"
			v-model="i18n_model"
			selectionMode="day"/>

			<uic-labeled-text-field
			title="Locale"
			:value="i18n_locale"
			@input="i18n_localeChanged"/>
		</section-card>

		<!-- Validation -->
		<section-card
		name="validation"
		:controls="{
			'Clear': () => validation_model = null,
			'Random': () => validation_model = randomDate()
		}">
			<p slot="description">The date time picker uses the same validation API as the month calendar component. In the below example, dates below the current date are considered invalid.</p>

			<uic-date-time-picker
			class="field"
			v-model="validation_model"
			:validator="validateDateNotBelowNow"
			@valid="validation_valid = true"
			@invalid="validation_valid = false"/>

			<p
			:class="{
				'valid': validation_valid === true,
				'invalid': validation_valid !== true
			}"
			v-if="validation_valid != null">
				<b v-show="validation_valid === true">Valid date:</b>
				<b v-show="validation_valid !== true">Invalid date:</b>
				{{validation_model}}
			</p>
		</section-card>
	</div>
</component-page>
</template>

<script>
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
			default_model: new Date(Date.now()),
			customization_model: new Date(Date.now()),
			validation_model: null,
			validation_valid: null,
			i18n_model: null,
			i18n_locale: 'ru-RU'
		}
	},
	methods: {
		randomDate() {
			return new Date(randomNumber(1970, 2100), randomNumber(0, 11), 1)
		},
		i18n_localeChanged(val) {
			if (val.length != 5) return
			else this.i18n_locale = val
		},
		validateDateNotBelowNow(val) {
			if (val == null) return
			const current = new Date()
			if (val.getTime() < current.getTime()) return false
			return true
		}
	},
	computed: {
		defModStr() {
			if (this.default_model == null) return 'null'
			return this.default_model.toString()
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
		width: 100%
		border: 1px solid #DDD
		border-radius: .25rem
		//padding: .2rem
		//padding-left: .5rem
		//padding-right: .5rem
		padding: 1rem
		box-sizing: border-box

.valid
	color: green

.invalid
	color: red
</style>
