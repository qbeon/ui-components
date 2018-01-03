<template>
<div class="root">
	<div
	class="body"
	@click="openContextMenu">
		<div class="when-selected">
			<transition name="selection-title">
				<div
				class="selection-title"
				v-if="currentSelection">
					<span>{{title ? title : 'Untitled'}}</span>
				</div>
			</transition>
			<transition name="selection-value">
				<div
				class="selection-text"
				v-if="currentSelection">
					<transition
					name="selection-text"
					mode="out-in">
						<div :key="currentSelection">
							<span>{{options[currentSelection]}}</span>
						</div>
					</transition>
				</div>
			</transition>
		</div>

		<div class="when-empty">
			<transition name="field-title">
				<div
				class="title"
				v-if="!currentSelection">
					<transition name="slide-fade">
						<div :key="title">
							<span>{{title ? title : 'Untitled'}}</span>
						</div>
					</transition>
				</div>
			</transition>
		</div>
	</div>
	<div class="ctx-menu">
		<context-menu
		:show="showMenu"
		@lostFocus="onMenuLostFocus">
			<ul class="options-list">
				<li
				class="option"
				@click="select(value)"
				v-for="(name, value) in options"
				:key="value">
					<span>{{name}}</span>
				</li>
			</ul>
		</context-menu>
	</div>
</div>
</template>

<script>
import ContextMenu from '../components/ContextMenu.vue'

export default {
	components: {
		'context-menu': ContextMenu
	},
	props: {
		'title': {
			type: String,
			required: false
		},
		'options': {
			type: Object,
			required: true,
			validator(value) {
				for (let option in value) {
					if (typeof value[option] !== 'string') return false
				}
				return true
			},
		},
		'selected': {
			type: String,
			required: false
		}
	},
	data() {
		return {
			showMenu: false,
			currentSelection: null
		}
	},
	created() {
		this.select(this.selected)
	},
	watch: {
		selected(newVal, oldVal) {
			this.select(newVal)
		}
	},
	methods: {
		select(value) {
			this.showMenu = false
			this.$emit('closed')
			if (value === null) {
				this.currentSelection = null
				this.$emit('selectionChanged', null)
				return
			}
			if (!(value in this.options)) return
			this.currentSelection = value
			this.$emit('selectionChanged', this.currentSelection)
		},
		openContextMenu() {
			this.showMenu = true
			this.$emit('opened')
		},
		onMenuLostFocus() {
			this.showMenu = false
			this.$emit('closed')
		}
	}
}
</script>

<style lang="stylus" scoped>
.root
	position: relative

.body
	position: relative
	display: flex
	font-size: 1rem
	height: 2.5rem
	align-items: center
	cursor: pointer

.ctx-menu
	position: absolute
	min-width: 100%
	max-height: 0px
	top: 0px
	left: 0px
	z-index: 99999999

.options-list
	list-style-type: none
	padding-top: .5rem
	padding-bottom: .5rem
	.option
		padding: .5rem
		padding-left: 1rem
		padding-right: 1rem
		white-space: nowrap
		cursor: pointer
		-webkit-touch-callout: none
		-webkit-user-select: none
		-khtml-user-select: none
		-moz-user-select: none
		-ms-user-select: none
		user-select: none
		transition: all .3s
		&:hover
			background-color: #EEE

.selection-title
	display: block
	font-size: .8rem
	color: #AAA
	text-overflow: ellipsis
	white-space: nowrap
	max-width: 100%
	overflow: hidden
	-webkit-touch-callout: none
	-webkit-user-select: none
	-khtml-user-select: none
	-moz-user-select: none
	-ms-user-select: none
	user-select: none

.when-empty, .when-selected
	max-width: 100%
	position: absolute

.when-empty
	max-width: 100%
	display: block
	.title
		span
			display: block
			width: 100%
			text-overflow: ellipsis
			overflow: hidden
			white-space: nowrap

.selection-text
	span
		display: block
		width: 100%
		text-overflow: ellipsis
		overflow: hidden
		white-space: nowrap

.selection-title-enter-active
	transition: all .3s
.selection-title-leave-active
	transition: all .2s
.selection-title-enter
	opacity: 0
	transform: translateY(6px)
.selection-title-leave-to
	opacity: 0

.selection-value-enter-active
	transition: all .3s
.selection-value-leave-active
	transition: all .2s
.selection-value-enter
	opacity: 0
	transform: translateX(6px)
.selection-value-leave-to
	opacity: 0

.field-title-enter-active
	transition: all .3s
.field-title-leave-active
	transition: all .2s
.field-title-enter
	opacity: 0
	transform: translateX(6px)
.field-title-leave-to
	opacity: 0

.selection-text-enter-active
	transition: all .3s
.selection-text-leave-active
	transition: all .1s
.selection-text-enter
	opacity: 0
	transform: translateX(6px)
.selection-text-leave-to
	opacity: 0

.context-menu-enter-active
	transition: all .3s
.context-menu-leave-active
	transition: all .3s
.context-menu-enter
	opacity: 0
	transform: translateY(-6px)
.context-menu-leave-to
	opacity: 0
	transform: translateX(-6px)
</style>
