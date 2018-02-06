<template>
<div>
	<div class="__uic_asi_main">
		<div
		ref="lowres"
		class="__uic_asi_low"
		:style="{
			backgroundColor: lowResSrc == null ? 'red' : 'blue',
			backgroundImage: lowResSrc,
			backgroundSize: fillMode
		}"
		v-if="showLowResEl"/>
		<div
		ref="highres"
		class="__uic_asi_high"
		:style="{
			backgroundColor: highResSrc == null ? 'red' : 'blue',
			backgroundImage: highResSrc,
			backgroundSize: fillMode
		}"/>
	</div>
</div>
</template>

<script>

function loadImage(url, callback) {
	let img = new Image()
	img.onload = () => callback(img)
	img.onerror = () => callback(null, new Error('failed loading image from: "' + url + '"'))
	img.src = url
}

export default {
	name: 'async-image',
	props: {
		fillMode: {
			type: String,
			default: 'cover',
			validator: value => {
				if (value === 'cover' || value === 'contain') return true
				return false
			}
		},
		highres: {
			type: String,
			required: true
		},
		lowres: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			showLowResEl: true,
			lowResSrc: null,
			highResSrc: null
		}
	},
	methods: {
		onTransitionEnd() {
			this.showLowResEl = false
			this.$refs.highres.removeEventListener('transitionend', this.onTransitionEnd)
		}
	},
	mounted() {
		loadImage(this.lowres, (lowResImg, err) => {
			if (!err) {
				// Successfuly loaded low-res image
				this.lowResSrc = 'url(' + lowResImg.src + ')'
				let styles = this.$refs.lowres.style
				window.getComputedStyle(this.$refs.lowres).opacity
				styles.opacity = 1
			}
			
			// Load high resolution image after the low resolution one was fetched
			loadImage(this.highres, (highResImg, err) => {
				if (err) return
				// Successfuly loaded high-res image
				this.highResSrc = 'url(' + highResImg.src + ')'
				this.$refs.highres.addEventListener('transitionend', this.onTransitionEnd)
				let styles = this.$refs.highres.style
				window.getComputedStyle(this.$refs.highres).opacity
				window.getComputedStyle(this.$refs.highres).transform
				styles.opacity = 1
				styles.transform = 'scale(1)'
			})
		})
	}
}
</script>

<style lang="stylus">
.__uic_asi_
	&main
		display: flex
		width: 100%
		height: 100%
		align-items: center
		justify-content: center
		overflow: hidden
		position: relative
	&low, &high
		position: absolute
		width: 100%
		height: 100%
		opacity: 0
		-webkit-transition: all 1s cubic-bezier(0.19, 1, 0.22, 1)
		transition: all 1s cubic-bezier(0.19, 1, 0.22, 1)
		background-position: center
		background-repeat: no-repeat
		background-size: cover
		transform: scale(1.1)
	&low
		-webkit-filter: blur(10px)
		-moz-filter: blur(10px)
		-o-filter: blur(10px)
		-ms-filter: blur(10px)
		filter: url(#blur)
		filter: blur(10px)
		filter: 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=2)'
</style>
