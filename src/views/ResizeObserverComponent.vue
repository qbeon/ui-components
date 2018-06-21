<template>
<component-page
name="Size Transition">
	<p slot="description">The resize observer is based on <a href="https://github.com/marcj/css-element-queries">marcj/css-element-queries</a> and emits the "changed" event whenever the size of the contents of the container change.</p>
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Resize Observer"
		:controls="{
			'Inrease': () => placeholders++,
			'Decrease': () => placeholders == 0 ? null : placeholders--,
			'Random': () => placeholders = random(1, 10),
			'Random Width': () => randomContainerWidth(),
			'Reset': () => placeholders = 0
		}">
			<p slot="description">This resize observer will display the current content size as well as the amount of size changes performed</p>
			<p class="explanation">Click either of the control buttons below to see the component in action</p>
			<uic-resize-observer
			class="resize-observer"
			@changed="onResizeObserverTriggered"
			mode="height">
				<div
				class="content"
				:style="{'width': containerWidth}">
					<div class="size-indicator">
						{{width}}px x {{height}}px<br>{{changes}} changes
					</div>
					<div
					class="placeholder"
					v-for="index in placeholders"
					:key="index">{{index}}</div>
				</div>
			</uic-resize-observer>
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
			containerWidth: "256px",
			placeholders: 2,
			changes: 0,
			width: null,
			height: null,
		}
	},
	methods: {
		random(max, min) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		},
		randomContainerWidth() {
			this.containerWidth = this.random(256,512) + "px"
		},
		onResizeObserverTriggered(sz) {
			this.changes++
			this.width = sz.width
			this.height = sz.height
		}
	}
}
</script>

<style lang="stylus" scoped>
.explanation
	margin-bottom: 1rem

.placeholder
	width: 100%
	padding: 1rem
	background-color: #5bb8ff
	font-size: 1rem
	color: white

.resize-observer
	display: inline-block
	max-width: 100%

.size-indicator
	position: absolute
	font-size: 1rem
	top: 1rem
	right: 2rem
	text-align: right
	color: white
</style>
