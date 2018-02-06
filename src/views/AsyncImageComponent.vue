<template>
<component-page
name="Asynchronous Image">
	<p slot="description">The asynchronous image loader component loads the low resolution version of the given image to display it during the asynchronous loading of the actual high resolution image.</p>
	<!-- DEMO -->
	<div slot="demo">
		<!-- Default -->
		<section-card
		name="Default">
			<p slot="description">This image loader loads an 8.9 MB image with a 13.1 KB preview thumbnail</p>
			<uic-async-image
			class="frame"
			lowres="/public/large_preview.jpg"
			highres="/public/large.jpg"/>
		</section-card>
	</div>
</component-page>
</template>

<script>
import UtilComponentPage from '../util/ComponentPage.vue'
import SectionCard from '../util/SectionCard.vue'

export default {
	components: {
		'component-page': UtilComponentPage,
		'section-card': SectionCard,
	},
	data() {
		return {}
	}
}
</script>

<style lang="stylus" scoped>
.frame
	width: 100%
	height: 32rem
	display: block
	margin-bottom: 1rem
	&.inlined
		display: inline-block
	&:last-child
		margin-bottom: 0px
</style>
