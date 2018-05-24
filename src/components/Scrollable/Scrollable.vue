<template>
	<div class="__uic_scr_root">
		<div
		ref="container"
		class="__uic_scr_container">
			<transition name="__uic_scr_upper-indicator">
				<div
				v-show="showUpperIndicator"
				class="__uic_scr_upper-indicator"></div>
			</transition>
			<transition name="__uic_scr_lower-indicator">
				<div
				v-show="showLowerIndicator"
				class="__uic_scr_lower-indicator"></div>
			</transition>
			<div
			ref="content"
			class="__uic_scr_content">
				<slot></slot>
			</div>
			<transition name="__uic_scr_dragger">
				<div
				ref="dragger"
				class="__uic_scr_dragger"
				:class="{__uic_scr_dragger_dragging: barDragging}"
				v-show="draggerEnabled">
					<div class="__uic_scr_dragger-body"></div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
const appearance = {
	default: {
		scrollIndicators: true
	},
	validator(val) {
		if (val.scrollIndicators &&
			typeof val.scrollIndicators !== typeof(true)
		) return false
		return true
	}
}

import {
	detectBrowser,
	debounce,
	throttle,
	compatStyle,
	hasClass,
	addClass,
	removeClass,
} from '../util.js'

import Registry from '../registry.js'

export default {
	name: 'scrollable',
	appearance,
	props: {
		'enabled': {
			type: Boolean,
			required: false,
			default: true
		},
		posY: {
			type: Number,
			required: false,
			default: 0
		},
		'appearance': {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	watch: {
		enabled(val) {
			const styles = this.$refs.content.style
			if (val) {
				this.draggerEnabled = true
				styles['overflow-y'] = 'scroll'
				return
			}
			this.draggerEnabled = false
			styles['overflow-y'] = 'hidden'
		},
		posY(val) {
			this.$refs.content.scrollTop = val
			this.refreshScrollbar()
		},
		appearance() {
			this.refreshScrollbar()
		},
		barDragging() {
			this.setActivate()
		}
	},
	data() {
		return {
			// config with default values that may be overwritten on directive intialization
			config: {
				scrollThrottle: 12,
				draggerThrottle: 12,
				resizeRefresh: true,
				observerThrottle: 100,
				resizeDebounce: 100,
				unselectableBody: true,
				overrideFloatingScrollbar: true,
				scrollingActiveDelay: 1000,
				draggingActiveDelay: 1000,
				preventParentScroll: false,
				useScrollbarPseudo: true, // experimental

				containerScrollingClass: '__uic_scr_scrolling',
				containerScrollingActiveClass: '__uic_scr_active',
				containerDraggingClass: '__uic_scr_dragging',
				//containerDraggingActiveClass: '__uic_scr_dragging-active',
			},

			// show dragger
			draggerEnabled: null,
			showUpperIndicator: false,
			showLowerIndicator: false,

			// properties computed for internal directive logic & DOM manipulations
			visibleArea: 0, // ratio between container height and scrollable content height
			scrollTop: 0, // position of content scrollTop in px
			barTop: 0, // position of dragger in px
			barHeight: 0, // height of dragger in px
			mouseBarOffsetY: 0, // relative position of mouse at the time of clicking on dragger
			barDragging: false, // when the dragger is used

			// reference to MutationObserver
			mutationObserver: null,

			// references to timeouts for DOM class manipulation
			scrollingClassTimeout: null,
			scrollingActiveClassTimeout: null,
			draggingActiveClassTimeout: null,

			// references to a functions we'll need when removing events
			barMousedownFn: null,
			documentMousemoveFn: null,
			documentMouseupFn: null,
			windowResizeFn: null,
			scrollHandlerFn: null,
			wheelHandlerFn: null,
		}
	},
	beforeUpdate() {
		// Verify the scrollbar position corresponds to the actual content scroll position
		const contentEl = this.$refs.content
		if (
			Math.ceil(this.barTop * (contentEl.scrollHeight / contentEl.clientHeight)) !=
			Math.ceil(contentEl.scrollTop)
		) this.refreshScrollbar()
	},
	mounted() {
		const conf = this.config

		// detect browser
		if (!Registry.browserId) Registry.browserId = detectBrowser()
		const browserId = Registry.browserId

		// dragger enabled?
		const nativeScrollbarWidth = this.getNativeScrollbarWidth()
		const overlayScrollbar = nativeScrollbarWidth == 0
		this.draggerEnabled = ((!overlayScrollbar) || conf.overrideFloatingScrollbar) ? 1 : 0

		// create and reference event listeners
		this.barMousedownFn = this.createBarMousedown()
		this.documentMousemoveFn = this.createDocumentMousemove()
		this.documentMouseupFn = this.createDocumentMouseup()
		this.windowResizeFn = this.createWindowResize()
		this.scrollHandlerFn = this.createScrollHandler()
		this.wheelHandlerFn = this.createWheelHandler()

		// initialize and reference mutation observer
		this.mutationObserver = this.createInitMutationObserver()

		// do the magic
		if (this.draggerEnabled) {
			const contentEl = this.$refs.content

			// hide original browser scrollbar using pseudo css selectors (only chrome & safari)
			if (conf.useScrollbarPseudo && (browserId.chrome || browserId.safari)) {
				this.hideScrollbarUsingPseudoElement()
			}

			// hide original browser overlay scrollbar and add padding to compensate for that
			else if (overlayScrollbar) {
				compatStyle(contentEl, 'BoxSizing', 'content-box')
				contentEl.style.paddingRight = '20px'
			}

			// hide original browser scrollbar behind element edges and hidden overflow
			else {
				contentEl.style.width = 'calc(100% + ' + nativeScrollbarWidth + 'px)'
			}

			// Finally make the content scrollable which was initially hidden to prevent
			// the systems scrollbar to be temporarily visible during initialization
			// causing abrupt content jumping on page load
			contentEl.style.overflowY = 'scroll'
		}

		// add events
		// - wheel event is only needed when preventParentScroll option is enabled
		// - resize event is only needed when resizeRefresh option is enabled
		this.$refs.content.addEventListener('scroll', this.scrollHandlerFn, 0)
		this.$refs.dragger.addEventListener('mousedown', this.barMousedownFn, 0)
		conf.preventParentScroll ? this.$refs.content.addEventListener('wheel', this.wheelHandlerFn, 0) : null
		conf.resizeRefresh ? window.addEventListener('resize', this.windowResizeFn, 0) : null

		// initial calculations using refresh scrollbar
		this.refreshScrollbar({immediate: true})
	},
	beforeDestroy() {
		this.$refs.content.removeEventListener('scroll', this.scrollHandlerFn)
		this.$refs.dragger.removeEventListener('mousedown', this.barMousedownFn)
		this.$refs.content.removeEventListener('wheel', this.wheelHandlerFn)
		window.removeEventListener('resize', this.windowResizeFn)
		document.removeEventListener('mousemove', this.documentMousemoveFn)
		document.removeEventListener('mouseup', this.documentMouseupFn)
	},
	methods: {
		/*------------------------------------*\
			Computing Properties
		\*------------------------------------*/
		computeVisibleArea() {
			const contentEl = this.$refs.content
			this.visibleArea = (contentEl.clientHeight / contentEl.scrollHeight)
		},

		computeScrollTop() {
			this.scrollTop = this.barTop * (
				this.$refs.content.scrollHeight / this.$refs.content.clientHeight
			)
		},

		computeBarTop(event) {
			const contentEl = this.$refs.content

			// if the function gets called on scroll event
			if (!event) {
				this.barTop = contentEl.scrollTop * this.visibleArea
				return false
			} // else the function gets called when moving dragger with mouse

			const relativeMouseY = (event.clientY - this.$refs.container.getBoundingClientRect().top)

			// if bar is trying to go over top
			if (relativeMouseY <= this.mouseBarOffsetY) this.barTop = 0

			// if bar is moving between top and bottom
			if (relativeMouseY > this.mouseBarOffsetY) {
				this.barTop = relativeMouseY - this.mouseBarOffsetY
			}

			// if bar is trying to go over bottom
			if ((this.barTop + this.barHeight ) >= contentEl.clientHeight) {
				this.barTop = contentEl.clientHeight - this.barHeight
			}
		},

		computeBarHeight() {
			if (this.visibleArea >= 1) this.barHeight = 0
			else this.barHeight = this.$refs.content.clientHeight * this.visibleArea
		},

		/*------------------------------------*\
			Styles & DOM
		\*------------------------------------*/
		updateDragger(options) {
			this.$emit("scrollYChanged", {
				y: this.$refs.content.scrollTop
			})

			options = options ? options : {}

			// Hide dragger if there's no overflowing contents
			if (this.visibleArea >= 1) {
				this.draggerEnabled = false
				return
			}
			else this.draggerEnabled = true

			// setting dragger styles
			const draggerStyles = this.$refs.dragger.style
			draggerStyles.height = parseInt(Math.round(this.barHeight)) + 'px'
			draggerStyles.top = parseInt(Math.round(this.barTop)) + 'px'

			if (options.withScrollingClasses) {
				this.setActivate()
				this.setScrolling()
			}

			this.updateIndicators()
		},

		updateIndicators() {
			// Skip when the indicators are disabled by the appearance options
			if (this.appearance.scrollIndicators === false) return

			// Show the upper indicator only when there's an invisible
			// area available at the top of the scroll container
			const scrollTop = Math.ceil(this.$refs.content.scrollTop)
			this.showUpperIndicator = scrollTop > 0 ? true : false

			// Show the lower indicator only when there's an invisible
			// area available at the bottom of the scroll container
			const contentEl = this.$refs.content
			const scrollDist = contentEl.scrollHeight - contentEl.clientHeight
			this.showLowerIndicator = scrollTop >= scrollDist ? false : true
		},

		// this is an experimental feature
		// - it works only on chrome and safari
		// - instead of hiding scrollbar by overflowing it with its parent set to overflow:hidden
		//   we hide scrollbar using pseudo-element selector ::-webkit-scrollbar
		hideScrollbarUsingPseudoElement() {
			const idName = 'vuebar-pseudo-element-styles'
			const selector = '.__uic_scr_content::-webkit-scrollbar'
			let styleElm = document.getElementById(idName)
			let sheet = null

			if (styleElm) sheet = styleElm.sheet
			else {
				styleElm = document.createElement('style')
				styleElm.id = idName
				document.head.appendChild(styleElm)
				sheet = styleElm.sheet
			}

			// detect if there is a rule already added to the selector
			let ruleExists = false
			for(let itr = 0, len = sheet.rules.length; itr < len; itr++) {
				let rule = sheet.rules[itr]
				if (rule.selectorText == selector) ruleExists = true
			}

			// if there is rule added already then don't continue
			if (ruleExists) return false

			// insert rule
			// - we only need to use insertRule and don't need to use addRule at all
			//   because we're only targeting chrome & safari browsers
			if (sheet.insertRule) sheet.insertRule(selector + '{display:none}', 0)
		},

		preventParentScroll(event) {
			if (this.visibleArea >= 1) return false

			const contentEl = this.$refs.content

			const scrollDist = contentEl.scrollHeight - contentEl.clientHeight
			const scrollTop = contentEl.scrollTop

			const wheelingUp = event.deltaY < 0
			const wheelingDown = event.deltaY > 0

			if ((scrollTop <= 0) && wheelingUp) {
				event.preventDefault()
				return false
			}

			if ((scrollTop >= scrollDist) && wheelingDown) {
				event.preventDefault()
				return false
			}
		},

		updateScroll() {
			this.$refs.content.scrollTop = this.scrollTop
		},

		/*------------------------------------*\
			Refresh
		\*------------------------------------*/
		refreshScrollbar(options) {
			options = options ? options : {}

			if (options.immediate) {
				this.computeVisibleArea()
				this.computeBarTop()
				this.computeBarHeight()
				this.updateDragger()
			}

			this.$nextTick(() => {
				this.computeVisibleArea()
				this.computeBarTop()
				this.computeBarHeight()
				this.updateDragger()
			})
		},

		/*------------------------------------*\
			Events & Handlers
		\*------------------------------------*/
		createScrollHandler() {
			return throttle(event => {
				this.computeVisibleArea()
				// fallback for an undetected content change
				this.computeBarHeight()
				if (!this.barDragging) {
					this.computeBarTop()
					this.updateDragger({withScrollingClasses: true})
				}
			}, this.config.scrollThrottle)
		},

		createWheelHandler() {
			return event => {
				this.preventParentScroll(event)
			}
		},

		createDocumentMousemove() {
			return throttle(event => {
				this.computeBarTop(event)
				this.updateDragger()
				this.computeScrollTop()
				this.updateScroll()
			}, this.config.draggerThrottle)
		},

		createDocumentMouseup() {
			return event => {
				this.barDragging = false
				const containerEl = this.$refs.container

				// enable user select
				containerEl.style.userSelect = ''
				this.config.unselectableBody ? compatStyle(document.body, 'UserSelect', '') : null

				// remove dragging class
				/*
				removeClass(containerEl, this.config.containerDraggingClass)
				this.draggingActiveClassTimeout = setTimeout(() => {
					removeClass(containerEl, this.config.containerDraggingActiveClass)
				}, this.config.draggingActiveDelay)
				*/

				// remove events
				document.removeEventListener('mousemove', this.documentMousemoveFn, 0)
				document.removeEventListener('mouseup', this.documentMouseupFn, 0)
			}
		},

		createBarMousedown() {
			return event => {
				// don't do nothing if it's not left mouse button
				if (event.which!==1) return false

				this.barDragging = true
				this.mouseBarOffsetY = event.offsetY

				const containerEl = this.$refs.container
				const conf = this.config

				// disable user select
				containerEl.style.userSelect = 'none'
				conf.unselectableBody ? compatStyle(document.body, 'UserSelect', 'none') : null

				// add dragging class
				/*
				addClass(containerEl, conf.containerDraggingClass)
				this.draggingActiveClassTimeout ?
					clearTimeout(this.draggingActiveClassTimeout) : null
				addClass(containerEl, conf.containerDraggingActiveClass)
				*/

				// add events
				document.addEventListener('mousemove', this.documentMousemoveFn, 0)
				document.addEventListener('mouseup', this.documentMouseupFn, 0)
			}
		},

		createWindowResize() {
			return debounce(event => {
				this.refreshScrollbar()
			}, this.config.resizeDebounce)
		},

		createInitMutationObserver() {
			if (typeof MutationObserver === typeof void 0) return null

			const observer = new MutationObserver(throttle(mutations => {
				this.refreshScrollbar()
			}, this.config.observerThrottle))

			observer.observe(this.$refs.content, {
				childList: true,
				characterData: true,
				subtree: true,
			})

			return observer
		},

		setActivate() {
			const conf = this.config
			const containerEl = this.$refs.container

			// Add active scrolling class
			addClass(containerEl, conf.containerScrollingActiveClass)

			// Set timeout for active scrolling class removal
			if (this.scrollingActiveClassTimeout) clearTimeout(this.scrollingActiveClassTimeout)
			this.scrollingActiveClassTimeout = setTimeout(function() {
				removeClass(containerEl, conf.containerScrollingActiveClass)
			}, conf.scrollThrottle + conf.scrollingActiveDelay)
		},

		setScrolling() {
			const conf = this.config
			const containerEl = this.$refs.container

			// Add scrolling class
			addClass(containerEl, conf.containerScrollingClass)

			// Set timeout for scrolling class removal
			if (this.scrollingClassTimeout) clearTimeout(this.scrollingClassTimeout)
			this.scrollingClassTimeout = setTimeout(function() {
				removeClass(containerEl, conf.containerScrollingClass)
			}, conf.scrollThrottle + 5)
		},

		// Calculate the native scrollbar width using a temporal sample element
		getNativeScrollbarWidth() {
			// Check for existing results to prevent redundant computations
			let computed = Registry.nativeScrollbarWidth
			if(computed) return computed

			// Perform computation
			const container = document.body
			const wrapper = document.createElement('div')
			const child = document.createElement('div')

			wrapper.style.position = 'absolute'
			wrapper.style.pointerEvents = 'none'
			wrapper.style.bottom = '0'
			wrapper.style.right = '0'
			wrapper.style.width = '100px'
			wrapper.style.overflow = 'hidden'

			wrapper.appendChild(child)
			container.appendChild(wrapper)

			const fullWidth = child.offsetWidth

			wrapper.style.overflowY = 'scroll'
			computed = fullWidth - child.offsetWidth

			container.removeChild(wrapper)

			// Remember computation result
			Registry.nativeScrollbarWidth = computed

			return computed
		}
	}
}
</script>

<style lang="stylus">
.__uic_scr_
	// Component root
	&root
		height: 100%
		width: 100%

	// Main container
	&container
		position: relative
		height: 100%
		width: 100%
		overflow: hidden

	// Content container
	&content
		display: block
		overflow: hidden
		height: 100%
		width: 100%

	// Basic scroll indicator styles
	&upper-indicator, &lower-indicator
		height: 1.5rem
		width: 100%
		position: absolute
		z-index: 999998
		left: 0px
		pointer-events: none;
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .3s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0
			transform: translateX(6px)

	// Upper scroll indicator
	&upper-indicator
		top: 0px
		background: -moz-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)
		background: -webkit-linear-gradient(top, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)
		background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)

	// Lower scroll indicator
	&lower-indicator
		bottom: 0px
		background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)
		background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%)
		background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%)

	// Dragger root
	&dragger
		display: block
		position: absolute
		right: 0px
		width: 16px
		z-index: 999999
		-webkit-backface-visibility: hidden
		backface-visibility: hidden
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .3s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0
			transform: translateX(6px)

		// Dragger body
		&-body
			-webkit-transition: all .3s cubic-bezier(0.19, 1, 0.22, 1)
			transition: all .3s cubic-bezier(0.19, 1, 0.22, 1)
			margin: auto
			width: 4px
			margin-top: 4px
			height: calc(100% - 8px)
			min-height: 4px
			background-color: rgba(0, 0, 0, 0)
			border-radius: 8px

		// Dragger body when the dragger is either hovered or being dragged
		&dragging &-body, &:hover &-body
			width: 100%
			margin-top: 0px
			height: 100%
			background-color: rgba(0, 0, 0, .5)
			border-radius: 0px

	&active &dragger
		// Dragger body when the dragger is active
		&-body
			background-color: rgba(0, 0, 0, .2)

</style>
