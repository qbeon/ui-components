<template>
<component-page
name="Size Transition">
	<p slot="description">Size transition is a smart container that smoothly animates layout changes when its internal content changes size.</p>
	<div slot="demo">
		<!-- Vertical -->
		<section-card
		name="Vertical"
		:controls="{
			'Inrease': () => placeholders++,
			'Decrease': () => placeholders == 0 ? null : placeholders--,
			'Random': () => placeholders = random(),
			'Reset': () => placeholders = 0
		}">
			<p slot="description">Smooth vertical layout transition</p>
			<p class="explanation">Click either of the control buttons below to see the component in action</p>
			<uic-size-transition
			class="size-transition"
			mode="height">
				<div
				class="placeholder"
				v-for="index in placeholders"
				:key="index">{{index}}</div>
			</uic-size-transition>
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
			placeholders: 0
		}
	},
	methods: {
		random() {
			return Math.floor(Math.random() * 10)
		}
	}
}
</script>

<style lang="stylus" scoped>
.explanation
	margin-bottom: 1rem

.size-transition
	width: 100%

.placeholder
	width: 100%
	padding: 1rem
	background-color: #5bb8ff
	font-size: 1rem
	color: white
</style>
