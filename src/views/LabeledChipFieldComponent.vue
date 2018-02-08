<template>
<component-page
name="Labeled Chip Field"
:subComponents="{
	LabeledFieldComponent: 'LabeledField',
	TextFieldComponent: 'TextField'
}">
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default"
		:controls="{
			'Clear': () => {default_model = null},
			'Random': () => {
				default_model = random()
			}
		}">
			<uic-labeled-chip-field
			title="Default chip field"
			v-model="default_model">
			</uic-labeled-chip-field>
		</section-card>

		<!-- Customization -->
		<section-card
		name="Customization"
		:controls="{
			'Clear': () => {customization_model = null},
			'Random': () => {
				customization_model = random()
			}
		}">
			<p slot="description">The labeled chip field component can be deeply customized and styled. </p>
			<uic-labeled-chip-field
			class="field styled large"
			title="Fully customized chip field"
			v-model="customization_model">
				<div class="custom-chip" slot-scope="chip">
					<div
					class="custom-chip-remove"
					@click="chip.remove">🐕</div>
					<span class="custom-chip-value">{{chip.value}}</span>
				</div>
			</uic-labeled-chip-field>
		</section-card>
	</div>
</component-page>
</template>

<script>
import { elements } from '../util/testData'
import randomString from '../util/randomString'
import randomNumber from '../util/randomNumber'

import ComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

export default {
	components: { ComponentPage, SectionCard },
	data() {
		return {
			// Sections
			default_model: null,

			customization_model: ['Such chip', 'Much style', 'So many customizations', 'wow'],
		}
	},
	methods: {
		random() {
			const numItems = randomNumber(1, 8)
			const items = new Array(numItems)
			for (let index = 0; index < numItems; index++) {
				items[index] = randomString(randomNumber(1, 16))
			}
			return items
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
	color: white
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

.custom-chip
	background-color: salmon
	height: 3rem
	display: flex
	align-items: center
	border-radius: .2rem
	margin-right: .5rem
	padding-left: 1rem
	padding-right: 1rem
	-webkit-transition: all 0.3s ease-out
	transition: all 0.3s ease-out
	cursor: default
	&:hover
		background-color: #ff513e
	&-value
		color: white
	&-remove
		cursor: pointer
		margin-right: 1rem
		font-size: 2rem
		height: 3rem
		line-height: 3rem
</style>
