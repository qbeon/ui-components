<template>
<component-page
name="Labeled Text Field"
:subComponents="{
	LabeledFieldComponent: 'LabeledField'
}">
	<p slot="description">The select field component is very similar to the native select elements, but in contrast to native select elements, the select field component provides consistent UX across all browsers and devices.</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default"
		:controls="{
			'Clear': () => {default_value = null},
			'Random': () => {
				default_value = random()
			}
		}">
			<p slot="description">The default text field is mostly unstyled</p>
			<uic-labeled-text-field
			title="Default text field"
			v-model="default_value">
			</uic-labeled-text-field>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Clear': () => {customization_values = [null, null]},
			'Random': () => {
				customization_values = [
					random(),
					random()
				]
			}
		}">
			<p slot="description">The text field component can be customized and styled</p>
			<uic-labeled-text-field
			class="field styled small"
			title="Styled text field"
			v-model="customization_values[0]">
			</uic-labeled-text-field>

			<uic-labeled-text-field
			class="field styled large"
			title="Styled text field (wide)"
			v-model="customization_values[1]">
			</uic-labeled-text-field>
		</section-card>

		<!-- Placeholder -->
		<section-card
		name="Placeholder"
		:controls="{
			'Clear': () => {placeholder_text = null},
			'Random': () => {
				placeholder_text = random()
			}
		}">
			<uic-labeled-text-field
			class="field"
			title="Dynamic Placeholder Text"
			placeholder="Placeholder text goes here"
			v-model="placeholder_text"/>

			<p slot="description">The text field component can get a dynamic placeholder</p>
			<uic-labeled-text-field
			class="field styled small"
			:title="placeholder_text == null ?
				'Field without a placeholder' :
				'Field with a placeholder'"
			v-model="placeholder_values[0]"
			:placeholder="placeholder_text"/>

			<uic-labeled-text-field
			class="field styled large"
			:title="placeholder_text == null ?
				'Field without a placeholder' :
				'Field with a placeholder'"
			v-model="placeholder_values[1]"
			:placeholder="placeholder_text"/>
		</section-card>

		<!-- Password -->
		<section-card
		name="Password"
		:controls="{
			'Clear': () => {password_value = null},
			'Random': () => {
				password_value = random()
			}
		}">
			<p slot="description">The text field component can be used as a password input</p>
			<uic-labeled-text-field
			type="password"
			class="field styled"
			title="Styled text field"
			v-model="password_value">
			</uic-labeled-text-field>
			<p>{{password_value}}</p>
		</section-card>

		<!-- Validation on completion -->
		<section-card name="Validation">
			<p slot="description">Text fields can validate inputs (on complete by default)</p>

			<uic-labeled-text-field
			class="field styled medium"
			title="At least 5 characters"
			v-model="validation_value"
			:validator="isBigger4"
			@valid="validation_valid = true"
			@invalid="validation_valid = false">
			</uic-labeled-text-field>

			<p
			v-if="validation_valid != null"
			class="validation-indicator"
			:class="{valid: validation_valid}">{{validation_valid ? 'Valid' : 'Invalid'}}</p>
		</section-card>

		<!-- Validation on input -->
		<section-card name="Validation on input">
			<p slot="description">Text fields can also validate inputs on the fly</p>

			<uic-labeled-text-field
			class="field styled medium"
			title="At least 5 characters"
			v-model="validationOnInput_value"
			:validator="isBigger4"
			validate-on="input"
			@valid="validationOnInput_valid = true"
			@invalid="validationOnInput_valid = false">
			</uic-labeled-text-field>
			<p v-if="validationOnInput_valid != null"
			class="validation-indicator"
			:class="{valid: validationOnInput_valid}">{{validationOnInput_valid ? 'Valid' : 'Invalid'}}</p>
		</section-card>

		<!-- Validation on initialization -->
		<section-card name="Validation on initialization">
			<p slot="description">Text fields won't validate the value on initialization by default, this behavior can be enabled using the validate-on-init property though</p>

			<uic-labeled-text-field
			class="field styled medium"
			title="Validated on initialization"
			v-model="validationOnInit_input"
			:validator="isBigger4"
			:validate-on-init="true"
			@valid="validationOnInput_input = true"
			@invalid="validationOnInput_input = false">
			</uic-labeled-text-field>
			<p v-if="validationOnInput_input != null"
			class="validation-indicator"
			:class="{valid: validationOnInput_input}">{{validationOnInput_input ? 'Valid' : 'Invalid'}}</p>
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
			default_value: null,

			customization_values: [null, null],

			password_value: null,

			placeholder_values: [null, null],
			placeholder_text: 'Sample Placeholder',

			validation_value: null,
			validation_valid: null,

			validationOnInput_value: null,
			validationOnInput_valid: null,
			validationOnInput_input: null,
			validationOnInit_input: 'Sample content'
		}
	},
	methods: {
		random() {
			const keys = Object.keys(elements)
			return elements[keys[Math.floor(Math.random() * keys.length)]]
		},
		isBigger4(val) {
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
