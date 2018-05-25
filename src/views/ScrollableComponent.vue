<template>
<component-page
name="Scrollable">
	<p slot="description">Scrollable is a container component hosting other components in a scrollable area with a customizable scrollbar.</p>
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default"
		:controls="{
			'Inrease': () => placeholders++,
			'Decrease': () => placeholders == 0 ? null : placeholders--,
			'Random': () => placeholders = random(),
			'Reset': () => placeholders = 20
		}">
			<p slot="description">Default scrollable area</p>
			<uic-scrollable class="scrollable-area"
			:appearance="{scrollIndicators: false}">
				<div
				class="placeholder"
				v-for="index in placeholders"
				:key="index">{{index}}</div>
			</uic-scrollable>
		</section-card>
	</div>
</component-page>
</template>

<script>
import ComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

export default {
	components: {
		ComponentPage,
		SectionCard
	},
	data() {
		return {
			placeholders: 20
		}
	},
	methods: {
		random() {
			return Math.floor(Math.random() * 20) + 1
		}
	}
}
</script>

<style lang="stylus" scoped>
.scrollable-area
	width: 100%
	height: 16rem
	background-color: wheat

.placeholder
	width: 100%
	padding: 1rem
	background-color: #5bb8ff
	font-size: 1rem
	color: white
</style>
