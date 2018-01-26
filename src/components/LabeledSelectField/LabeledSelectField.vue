<template>
<div
:class="config.class.root"
@click="openContextMenu">
	<labeled-field
	:title="title"
	:selected="value ? true : false"
	:class="config.class.body">
		<div slot="contents">
			<transition :name="config.class.selectionText">
				<div
				:class="config.class.selectionText"
				v-if="currentSelection">
					<transition
					:name="config.class.selectionText"
					mode="out-in">
						<div :key="currentSelection">
							<span>{{options[currentSelection]}}</span>
						</div>
					</transition>
				</div>
			</transition>
		</div>
	</labeled-field>
	<div :class="config.class.contextMenu">
		<context-menu
		:show="showMenu"
		:appearance="appearance.contextMenu"
		@lostFocus="onMenuLostFocus">
			<scrollable :class="config.class.scrollArea">
				<ul :class="config.class.optionList">
					<li
					:class="config.class.option"
					@click="select(value)"
					v-for="(name, value) in options"
					:key="value">
						<span>{{name}}</span>
					</li>
				</ul>
			</scrollable>
		</context-menu>
	</div>
</div>
</template>

<script>
import LabeledField from '../LabeledField/LabeledField.vue'
import Scrollable from '../Scrollable/Scrollable.vue'
import ContextMenu from '../ContextMenu/ContextMenu.vue'

const appearance = {
	default: {
		contextMenu: ContextMenu.appearance.default
	},
	validator(val) {
		// Validate context menu appearance
		if (val.contextMenu && !ContextMenu.appearance.validator(val.contextMenu)) return false
		return true
	}
}

export default {
	name: 'labeled-select-field',
	appearance,
	components: {
		'labeled-field': LabeledField,
		'scrollable': Scrollable,
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
			validator(options) {
				if (options == null) {
					console.error('Missing options in select field')
					return false
				}
				for (let option in options) {
					if (typeof options[option] !== 'string') {
						console.error('Non-string option in select field')
						return false
					}
				}
				return true
			},
		},
		'value': {
			type: String,
			required: false
		},
		'appearance': {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	data() {
		const prefix = '__uic_select_'
		return {
			config: {
				class: {
					root: prefix + 'root',
					selectionText: prefix + 'selection-text',
					contextMenu: prefix + 'context-menu',
					scrollArea: prefix + 'scroll-area',
					optionList: prefix + 'option-list',
					option: prefix + 'option'
				}
			},
			showMenu: false,
			currentSelection: null
		}
	},
	created() {
		this.select(this.value)
	},
	watch: {
		value(value) {
			this.select(value)
		}
	},
	methods: {
		select(value) {
			this.showMenu = false
			this.$emit('closed')
			if (value === null) {
				this.currentSelection = null
				this.$emit('input', null)
				return
			}
			if (this.options == null || !(value in this.options)) return
			this.currentSelection = value
			this.$emit('input', this.currentSelection)
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

<style lang="stylus">
.__uic_select_
	&root
		position: relative
		display: inline-block
		font-size: 0px
		line-height: 0px
		width: 8rem
	&body
		cursor: pointer
	&context-menu
		position: absolute
		min-width: 100%
		max-height: 0px
		top: 0px
		left: 0px
		z-index: 99999999
	&scroll-area
		height: 100%
	&option-list
		list-style-type: none
		padding-top: .5rem
		padding-bottom: .5rem
	&option
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
		font-size: 1rem
		height: 1.5rem
		box-sizing: content-box
		line-height: 1.5rem
		&:hover
			background-color: #EEE
	&selection-text
		span
			display: block
			width: 100%
			height: 1.75rem
			line-height: 1.75rem
			text-overflow: ellipsis
			overflow: hidden
			white-space: nowrap
			font-size: 1rem
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .1s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0
</style>
