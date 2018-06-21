<template>
<div
class="__uic_ldf_root"
tabindex="0"
@focus="onFocus">
	<labeled-field
	:title="title"
	:selected="value ? true : false"
	class="__uic_ldf_body">
		<div slot="contents">
			<transition name="__uic_ldf_displayed-date">
				<div
				class="__uic_ldf_displayed-date"
				v-if="value">
					<transition
					name="__uic_ldf_displayed-date"
					mode="out-in">
						<div :key="value.getTime()">
							<span>{{formattedValue}}</span>
						</div>
					</transition>
				</div>
			</transition>
		</div>
	</labeled-field>
	<context-menu
	:show="showMenu"
	:appearance="appearance.contextMenu"
	@close="showMenu = false">
		<date-time-picker class="__uic_ldf_picker"
		:locale="locale"
		:value="value"
		:min-year="minYear"
		:max-year="maxYear"
		:years-per-page="yearsPerPage"
		@input="onInput"
		:mode="mode"
		:default-time="defaultTime"
		:validator="validator"
		:validate-on-init="validateOnInit"
		@valid="$emit('valid')"
		@invalid="$emit('invalid')"/>
	</context-menu>
</div>
</template>

<script>
import LabeledField from '../LabeledField/LabeledField.vue'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import DateTimePicker from '../DateTimePicker/DateTimePicker.vue'

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
	name: 'labeled-date-time-field',
	appearance,
	components: {
		'labeled-field': LabeledField,
		'context-menu': ContextMenu,
		'date-time-picker': DateTimePicker,
	},
	props: {
		locale: {
			type: String,
			required: false,
			default: 'en-US'
		},
		title: {
			type: String,
			required: false
		},
		value: {
			type: Date,
			required: false
		},
		displayFormat: {
			type: String,
			required: false,
			default: ''
		},
		mode: DateTimePicker.props.mode,
		defaultTime: DateTimePicker.props.defaultTime,
		minYear: DateTimePicker.props.minYear,
		maxYear: DateTimePicker.props.maxYear,
		yearsPerPage: DateTimePicker.props.yearsPerPage,
		validator: DateTimePicker.props.validator,
		validateOnInit: DateTimePicker.props.validateOnInit,
		appearance: {
			type: Object,
			required: false,
			default: () => appearance.default,
			validator: appearance.validator
		}
	},
	data() {
		return {
			showMenu: false
		}
	},
	computed: {
		formattedValue() {
			if (this.value == null) return
			return new Intl.DateTimeFormat(this.locale).format(this.value)
		}
	},
	methods: {
		onInput(value) {
			this.showMenu = false
			this.$emit('input', value)
		},
		onFocus() {
			this.showMenu = true
		}
	}
}
</script>

<style lang="stylus">
.__uic_ldf_
	&root
		position: relative
		display: inline-block
		font-size: 0px
		line-height: 0px
		width: 8rem
		outline: none
	&body
		cursor: pointer
	&picker
		padding: 1rem
		padding-top: .5rem
	&displayed-date
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
