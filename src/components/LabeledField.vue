<template>
<div :class="config.class.root">
	<size-transition
	:class="config.class.sizer"
	mode="height">
		<div :class="config.class.body">
			<div v-show="selected">
				<transition :name="config.class.selectionTitle">
					<div
					:class="config.class.selectionTitle"
					v-show="selected">
						<transition
						:name="config.class.selectionTitleText"
						mode="out-in">
							<div :key="title">
								<span :class="config.class.selectionTitleText">{{title}}</span>
							</div>
						</transition>
					</div>
				</transition>
				<transition :name="config.class.contents">
					<div
					:class="config.class.contents"
					v-show="selected">
						<slot name="contents"></slot>
					</div>
				</transition>
			</div>
			<transition :name="config.class.fieldTitle">
				<div
				:class="config.class.fieldTitle"
				v-show="!selected">
					<transition
					:name="config.class.fieldTitleText"
					mode="out-in">
						<div :key="title">
							<span :class="config.class.fieldTitleText">{{title}}</span>
						</div>
					</transition>
				</div>
			</transition>
		</div>
	</size-transition>
</div>
</template>

<script>
import SizeTransition from './SizeTransition.vue'

export default {
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
		const prefix = '__uic_labeled-field_'
		return {
			config: {
				class: {
					root: prefix + 'root',
					body: prefix + 'body',
					sizer: prefix + 'sizer',
					selectionTitle: prefix + 'selection-title',
					selectionTitleText: prefix + 'selection-title-text',
					contents: prefix + 'contents',
					fieldTitle: prefix + 'field-title',
					fieldTitleText: prefix + 'field-title-text'
				}
			},
			currentSelection: null
		}
	},
}
</script>

<style lang="stylus">
.__uic_labeled-field_
	&body
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
			height: 1.25rem
			line-height: 1.25rem
			margin-bottom: .25rem
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
