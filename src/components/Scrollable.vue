<template>
	<div class="__uic_scrollable_root">
		<div
		ref="container"
		class="__uic_scrollable_container">
			<transition name="__uic_scrollable_upperIndicator">
				<div
				v-show="showUpperIndicator"
				class="__uic_scrollable_upperIndicator"></div>
			</transition>
			<transition name="__uic_scrollable_lowerIndicator">
				<div
				v-show="showLowerIndicator"
				class="__uic_scrollable_lowerIndicator"></div>
			</transition>
			<div
			ref="content"
			class="__uic_scrollable_content">
				<div>
					<slot></slot>
				</div>
			</div>
			<transition name="dragger">
				<div
				ref="dragger"
				class="__uic_scrollable_dragger"
				:class="{__uic_scrollable_dragger_active: barDragging}"
				v-show="draggerEnabled">
					<div class="__uic_scrollable_dragger_body"></div>
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
} from './util.js'

export default {
	appearance,
	name: 'scrollable',
	props: {
		'enabled': {
			type: Boolean,
			required: false,
			default: true
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
		appearance() {
			this.refreshScrollbar()
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
				scrollingPhantomDelay: 1000,
				draggingPhantomDelay: 1000,
				preventParentScroll: false,
				useScrollbarPseudo: false, // experimental

				containerScrollVisibleClass: 'vb-visible',
				containerScrollInvisibleClass: 'vb-invisible',
				containerScrollingClass: 'vb-scrolling',
				containerScrollingPhantomClass: 'vb-scrolling-phantom',
				containerDraggingClass: 'vb-dragging',
				containerDraggingPhantomClass: 'vb-dragging-phantom',
				draggerClass: 'vb-dragger',
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
			draggingClassTimeout: null,
			scrollingPhantomClassTimeout: null,
			draggingPhantomClassTimeout: null,

			// references to a functions we'll need when removing events
			barMousedownFn: null,
			documentMousemoveFn: null,
			documentMouseupFn: null,
			windowResizeFn: null,
			scrollHandlerFn: null,
			wheelHandlerFn: null,
		}
	},
	mounted() {
		const conf = this.config

		// detect browser
		const browser = detectBrowser()

		// dragger enabled?
		const elNativeScrollbarWidth = this.getNativeScrollbarWidth(this.$el.firstElementChild)
		const overlayScrollbar = elNativeScrollbarWidth == 0
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
			if (conf.useScrollbarPseudo && (browser.chrome || browser.safari)) {
				hideScrollbarUsingPseudoElement()
			}

			// hide original browser overlay scrollbar and add padding to compensate for that
			else if (overlayScrollbar) {
				compatStyle(contentEl, 'BoxSizing', 'content-box')
				contentEl.style.paddingRight = '20px'
			}

			// hide original browser scrollbar behind element edges and hidden overflow
			else {
				contentEl.style.width = 'calc(100% + ' + elNativeScrollbarWidth + 'px)'
			}
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

			const containerEl = this.$refs.container
			const conf = this.config

			if (options.withScrollingClasses) {
				// add scrolling class
				addClass(containerEl, conf.containerScrollingClass)

				// remove scrolling class
				this.scrollingClassTimeout ?
					clearTimeout(this.scrollingClassTimeout) : null
				this.scrollingClassTimeout = setTimeout(function() {
					removeClass(containerEl, conf.containerScrollingClass)
				}, conf.scrollThrottle + 5)

				// add phantom scrolling class
				addClass(containerEl, conf.containerScrollingPhantomClass)

				// remove phantom scrolling class
				this.scrollingPhantomClassTimeout ?
					clearTimeout(this.scrollingPhantomClassTimeout) : null
				this.scrollingPhantomClassTimeout = setTimeout(function() {
					removeClass(containerEl, conf.containerScrollingPhantomClass)
				}, conf.scrollThrottle + conf.scrollingPhantomDelay)
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
			const selector = '.__uic_scrollable_content::-webkit-scrollbar'
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
				removeClass(containerEl, this.config.containerDraggingClass)
				this.draggingPhantomClassTimeout = setTimeout(() => {
					removeClass(containerEl, this.config.containerDraggingPhantomClass)
				}, this.config.draggingPhantomDelay)

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
				addClass(containerEl, conf.containerDraggingClass)
				this.draggingPhantomClassTimeout ?
					clearTimeout(this.draggingPhantomClassTimeout) : null
				addClass(containerEl, conf.containerDraggingPhantomClass)

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

		/*------------------------------------*\
			Calculate scrollbar width in element
			- if the width is 0 it means the scrollbar is floated/overlayed
			- accepts "container" paremeter because ie & edge can have different
				scrollbar behaviors for different elements using '-ms-overflow-style'
		\*------------------------------------*/
		getNativeScrollbarWidth(container) {
			container = container ? container : document.body

			let fullWidth = 0
			let barWidth = 0

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

			fullWidth = child.offsetWidth
			wrapper.style.overflowY = 'scroll'
			barWidth = fullWidth - child.offsetWidth

			container.removeChild(wrapper)

			return barWidth
		}
	}
}
</script>

<style lang="stylus" scoped>
.__uic_scrollable
	&_root
		height: 100%
		width: 100%
	&_container
		position: relative
		height: 100%
		width: 100%
		overflow: hidden
	&_content
		display: block
		overflow-x: hidden
		overflow-y: scroll
		height: 100%
		width: 100%
	&_upperIndicator, &_lowerIndicator
		height: 1.5rem
		width: 100%
		position: absolute
		z-index: 999998
		left: 0px
		pointer-events: none;
	&_upperIndicator
		top: 0px
		background: -moz-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)
		background: -webkit-linear-gradient(top, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)
		background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)
	&_lowerIndicator
		bottom: 0px
		background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)
		background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%)
		background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%)

	&_upperIndicator-enter-active, &_lowerIndicator-enter-active
		transition: all .3s
	&_upperIndicator-leave-active, &_lowerIndicator-leave-active
		transition: all .3s
	&_upperIndicator-enter, &_lowerIndicator-enter
		opacity: 0
		transform: translateX(6px)
	&_upperIndicator-leave-to, &_lowerIndicator-leave-to
		opacity: 0
		transform: translateX(6px)


	&_dragger
		display: block
		position: absolute
		right: 0px
		width: 16px
		z-index: 999999
		-webkit-backface-visibility: hidden
		backface-visibility: hidden
		&_wake
			background-color: rgba(0, 0, 0, .3)
		&_body
			-webkit-transition: all .3s cubic-bezier(0.19, 1, 0.22, 1)
			transition: all .3s cubic-bezier(0.19, 1, 0.22, 1)
			margin: auto
			width: 4px
			margin-top: 4px
			height: calc(100% - 8px)
			min-height: 4px
			background-color: rgba(0, 0, 0, .15)
			border-radius: 8px
		&_active &_body, &:hover &_body
			width: 100%
			margin-top: 0px
			height: 100%
			background-color: rgba(0, 0, 0, .5)
			border-radius: 0px

.dragger-enter-active
	transition: all .3s
.dragger-leave-active
	transition: all .3s
.dragger-enter
	opacity: 0
	transform: translateX(6px)
.dragger-leave-to
	opacity: 0
	transform: translateX(6px)
</style>
