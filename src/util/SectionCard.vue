<template>
	<div class="__util_sectioncard_root">
		<div class="__util_sectioncard_header">
			<h6
			class="__util_sectioncard_title"
			:class="{'has-description': hasDescription}">{{name}}</h6>
			<div class="__util_sectioncard_description">
				<slot name="description"></slot>
			</div>
		</div>
		<div class="__util_sectioncard_content">
			<slot></slot>
		</div>
		<ul class="__util_sectioncard_footer">
			<li
			v-for="(callback, controlName) in controls"
			:key="controlName"
			@click="callback">
				<span>{{controlName}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true
		},
		controls: {
			type: Object,
			required: false
		}
	},
	computed: {
		hasDescription() {
			return this.$slots.description ? true : false
		}
	}
}
</script>

<style lang="stylus">
.__util_sectioncard_
	&root
		background-color: white
		margin-bottom: 3rem
		border-radius: 4px
		box-shadow: 0px 0px 8px 1px #0000001f
		background-color: white
		overflow: hidden
	&title
		margin-bottom: 0px
		&.has-description
			margin-bottom: .25rem
	&description
		p
			color: #888
	&header, &content
		padding: 1rem
	&header
		border-bottom: 1px solid #FAFAFA
	&footer
		list-style-type: none
		li
			display: inline-block
			padding: 1rem
			padding-left: .5rem
			padding-right: .5rem
			cursor: pointer
			-webkit-touch-callout: none
			-webkit-user-select: none
			-khtml-user-select: none
			-moz-user-select: none
			-ms-user-select: none
			user-select: none
			&:first-child
				padding-left: 1rem
			&:last-child
				padding-right: 1rem
			&:hover
				span
					color: #03A9F4
			span
				-webkit-transition: all .3s ease-out
				transition: all .3s ease-out
				color: #4FC3F7
				font-size: .9rem
</style>
