<template>
	<div id="app">
		<scrollable
		:appearance="{
			scrollIndicators: false
		}">
			<div class="navigation">
				<div
				class="logo"
				@click="goHome"></div>
				<selection-field
				class="pageSelector"
				title="Page"
				:options="pages"
				v-model="currentPage"/>
			</div>
			<transition
			name="router-view"
			mode="out-in">
				<router-view></router-view>
			</transition>
		</scrollable>
	</div>
</template>

<script>
import Router from './router'
import SelectionField from './components/Select.vue'
import Scrollable from './components/Scrollable.vue'

export default {
	components: {
		'selection-field': SelectionField,
		'scrollable': Scrollable
	},
	data() {
		return {
			pages: {
				'Home': 'Home',
				'TextFieldComponent': 'Text Field Component',
				'SelectFieldComponent': 'Select Field Component',
				'LabeledChipFieldComponent': 'Labeled Chip Field Component',
				'ScrollableComponent': 'Scrollable Component',
				'LabeledFieldComponent': 'Labaled Field Component',
				'SizeTransitionComponent': 'Size Transition Component',
				'MenuComponent': 'Menu Component',
			},
			currentPage: 'Home'
		}
	},
	created() {
		this.currentPage = this.$route.name
	},
	watch: {
		currentPage(currentPage) {
			this.$router.push({name: currentPage})
		},
		$route(to) {
			this.currentPage = to.name
		}
	},
	methods: {
		goHome() {
			this.$router.push({name: 'Home'})
		}
	}
}
</script>

<style lang="stylus">
@import './styles/main.styl'
@import './styles/vars.styl'

.navigation
	width: 100%
	max-width: 960px
	box-sizing: content-box
	height: 6rem
	display: flex
	align-items: center
	z-index: 1000
	margin: auto
	.logo
		width: 2.5rem
		height: 2.5rem
		display: inline-block
		background-image: url(/public/logo.png)
		background-size: contain
		background-position: center
		$default-transition(.5s)
		&:hover
			transform: scale(1.2)
	.pageSelector
		margin-left: 1rem

.router-view
	&-enter-active
		transition: all .3s
	&-leave-active
		transition: all .1s
	&-enter
		opacity: 0
		transform: translateX(6px)
	&-leave-to
		opacity: 0

@media(min-width: 960px) and (max-width: 1014px)
	.navigation
		box-siting: border-box
		width: calc(100% - 3rem)
		margin-left: 1.5rem
		margin-right: 1.5rem

@media(max-width: 959px)
	.navigation
		box-sizing: border-box
		padding-left: 1.5rem
		padding-right: 1.5rem
</style>
