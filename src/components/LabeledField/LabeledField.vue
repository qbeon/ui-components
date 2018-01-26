<template>
	<size-transition
	class="__uic_lf_sizer"
	mode="height"
	@contentSizeChanged="onContentSizeChanged">
		<div class="__uic_lf_body">
			<div v-show="selected">
				<transition name="__uic_lf_selection-title">
					<div
					class="__uic_lf_selection-title"
					v-show="selected">
						<transition
						name="__uic_lf_selection-title-text"
						mode="out-in"
						:key="title">
							<span class="__uic_lf_selection-title-text">{{title}}</span>
						</transition>
					</div>
				</transition>
				<transition name="__uic_lf_contents">
					<div
					class="__uic_lf_contents"
					v-show="selected">
						<slot name="contents"></slot>
					</div>
				</transition>
			</div>
			<transition name="__uic_lf_field-title">
				<div
				class="__uic_lf_field-title"
				v-show="!selected">
					<transition
					name="__uic_lf_field-title-text"
					mode="out-in"
					:key="title">
						<span class="__uic_lf_field-title-text">{{title}}</span>
					</transition>
				</div>
			</transition>
		</div>
	</size-transition>
</template>

<script>
import SizeTransition from '../SizeTransition/SizeTransition.vue'

export default {
	name: 'labeled-field',
	components: {
		'size-transition': SizeTransition
	},
	props: {
		'title': {
			type: String,
			required: false,
			default: 'Untitled'
		},
		'selected': {
			type: Boolean,
			required: false,
			default: false
		}
	},
	data() {
		return {
			currentSelection: null
		}
	},
	methods: {
		onContentSizeChanged(newSize) {
			this.$emit('contentSizeChanged', newSize)
		}
	}
}
</script>

<style lang="stylus">
.__uic_lf_
	&body
		font-size: 0px
		position: relative
		display: block
		cursor: default
		min-height: 3rem
		width: 100%
		overflow: hidden
	&sizer
		width: 100%
		overflow: hidden

	&selection-title
		max-width: 100%
		height: 1.25rem
		line-height: 1.25rem
		-webkit-touch-callout: none
		-webkit-user-select: none
		-khtml-user-select: none
		-moz-user-select: none
		-ms-user-select: none
		user-select: none
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .2s
		&-enter
			opacity: 0
			transform: translateY(6px)
		&-leave-to
			opacity: 0
		&-text
			display: inline-block
			width: 100%
			max-width: 100%
			overflow: hidden
			white-space: nowrap
			text-overflow: ellipsis
			font-size: .8rem
			color: #AAA
			&-enter-active
				transition: all .3s
			&-leave-active
				transition: all .2s
			&-enter
				opacity: 0
				transform: translateX(6px)
			&-leave-to
				opacity: 0

	&when-empty, &when-selected

	&field-title
		position: absolute
		top: 0px
		left: 0px
		height: 3rem
		width: 100%
		line-height: 3rem
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .2s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0
		&-text
			font-size: 1rem
			display: block
			height: 3rem
			width: 100%
			line-height: 3rem
			text-overflow: ellipsis
			overflow: hidden
			white-space: nowrap
			&-enter-active
				transition: all .3s
			&-leave-active
				transition: all .3s
			&-enter
				opacity: 0
				transform: translateX(6px)
			&-leave-to
				opacity: 0

	&contents
		width: 100%
		&-enter-active
			transition: all .3s
		&-leave-active
			transition: all .3s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0
</style>
