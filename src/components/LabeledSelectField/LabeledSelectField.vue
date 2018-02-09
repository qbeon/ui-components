<template>
<div
class="__uic_lsf_root"
tabindex="0"
@focus="showMenu = true">
	<labeled-field
	:title="title"
	:selected="value ? true : false"
	class="__uic_lsf_body">
		<div slot="contents">
			<transition name="__uic_lsf_selection-text">
				<div
				class="__uic_lsf_selection-text"
				v-if="currentSelection">
					<transition
					name="__uic_lsf_selection-text"
					mode="out-in">
						<div :key="currentSelection">
							<span>{{options[currentSelection]}}</span>
						</div>
					</transition>
				</div>
			</transition>
		</div>
	</labeled-field>
	<context-menu
	:show="showMenu"
	:appearance="appearance.contextMenu"
	prefer-parent-width
	@close="showMenu = false">
		<scrollable class="__uic_lsf_scroll-area">
			<ul class="__uic_lsf_option-list">
				<li
				class="__uic_lsf_option"
				@click="select(value)"
				v-for="(name, value) in options"
				:key="value">
					<span>{{name}}</span>
				</li>
			</ul>
		</scrollable>
	</context-menu>
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
		return {
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
			if (value === null) {
				this.currentSelection = null
				this.$emit('input', null)
				return
			}
			if (this.options == null || !(value in this.options)) return
			this.currentSelection = value
			this.$emit('input', this.currentSelection)
		}
	}
}
</script>

<style lang="stylus">
.__uic_lsf_
	&root
		position: relative
		display: inline-block
		font-size: 0px
		line-height: 0px
		width: 8rem
		outline: none
	&body
		cursor: pointer
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
