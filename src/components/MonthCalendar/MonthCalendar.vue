<template>
<div class="__uic_mc_root">
	<div class="__uic_mc_body">
		<div class="__uic_mc_header">
			<div
			class="__uic_mc_to-previous-page"
			:class="{'inactive': !hasPreviousPage}"
			@click="goToPreviousPage"
			v-html="arrowRightIcon"/>
			<span
			class="__uic_mc_displayed-month"
			@click="$emit('monthClick')">
				{{monthNames[selectedMonth]}} {{selectedYear}}
			</span>
			<div
			class="__uic_mc_to-next-page"
			:class="{'inactive': !hasNextPage}"
			@click="goToNextPage"
			v-html="arrowRightIcon"/>
		</div>
		<div class="__uic_mc_table">
			<div class="__uic_mc_table-head">
				<div class="__uic_mc_table-head-cell">Sun</div>
				<div class="__uic_mc_table-head-cell">Mon</div>
				<div class="__uic_mc_table-head-cell">Tue</div>
				<div class="__uic_mc_table-head-cell">Wed</div>
				<div class="__uic_mc_table-head-cell">Thu</div>
				<div class="__uic_mc_table-head-cell">Fri</div>
				<div class="__uic_mc_table-head-cell">Sat</div>
			</div>
			<div
			class="__uic_mc_table-row"
			v-for="(week, index) in dayTable"
			:key="index">
				<div
				class="__uic_mc_table-cell"
				:class="{
					'selectable': selectionMode === 'day',
					'foreign': day.foreign,
				}"
				v-for="day in week"
				:key="day.monthIndex"
				@click="onDaySelected(day)">
					{{day.monthIndex + 1}}
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { ArrowRight } from '../icons'
import getMonthCalendar from '../getMonthCalendar'

function logInvalidProp(prop) {
	logInvalidProperty('MonthCalendar', prop, ...arguments)
}

function printWarning(msg) {
	console.warn('UI Controls - MonthCalendar: ' + msg)
}

export default {
	name: 'month-calendar',
	props: {
		value: {
			type: Object,
			required: false,
			default: function() {
				return {
					displayedMonth: new Date(),
					selectedDay: null,
				}
			}
		},
		minYear: {
			type: Number,
			required: false,
			default: 1970
		},
		maxYear: {
			type: Number,
			required: false,
			default: 2100
		},
		// Includes extra foreign weeks
		// to preserve the 6-rows layout when enabled
		fullMonthCalendar: {
			type: Boolean,
			required: false,
			default: true
		},
		selectionMode: {
			type: String,
			required: false,
			default: 'none',
			validator(selectionMode) {
				switch (selectionMode) {
					case 'none':
					case 'day':
					return true
				}
				logInvalidProp('selectionMode', selectionMode)
				return false
			}
		}
	},
	data() {
		return {
			monthNames: [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			],

			selectedYear: null,
			selectedMonth: null,

			arrowRightIcon: ArrowRight,
			dayTable: null
		}
	},
	computed: {
		hasNextPage() {
			// If the next month is the first of the next year
			// and the next year is bigger maximum - then no
			if (this.selectedMonth + 1 > 11 &&
				this.selectedYear + 1 > this.maxYear) return false
			return true
		},
		hasPreviousPage() {
			// If the previous month is the last of the previous year
			// and the previous year is smaller minimum - then no
			if (this.selectedMonth - 1 < 0 &&
				this.selectedYear - 1 < this.minYear) return false
			return true
		},
	},
	created() {
		this.init()
	},
	watch: {
		value() {
			this.init()
		}
	},
	methods: {
		init() {
			if (this.value != null && this.value.displayedMonth != null) {
				this.selectedYear = this.value.displayedMonth.getFullYear()
				this.selectedMonth = this.value.displayedMonth.getMonth()
				this.verifyRange()
			} else {
				this.selectedYear = this.minYear
				this.selectedMonth = 0
			}
			this.dayTable = getMonthCalendar(
				this.selectedYear, this.selectedMonth, this.fullMonthCalendar
			)
		},
		verifyRange() {
			if (this.selectedYear < this.minYear) printWarning(
				'displayed year (' +
					this.selectedYear +
					') exceeds minimum (' +
					this.minYear +
					')'
			)
			if (this.selectedYear > this.maxYear) printWarning(
				'displayed year (' +
					this.selectedYear +
					') exceeds maximum (' +
					this.maxYear +
					')'
			)
		},
		goToNextPage() {
			if (!this.hasNextPage) return
			// Increment year after december and set month to january
			let year = this.selectedYear
			let month = this.selectedMonth
			if (month + 1 > 11) {
				year++
				month = 0
			} else month++
			this.$emit('navigation', {
				navDir: -1,
				year: year,
				month: month
			})
			this.emitInput(year, month)
		},
		goToPreviousPage() {
			if (!this.hasPreviousPage) return
			// Decrement year after january and set month to december
			let year = this.selectedYear
			let month = this.selectedMonth
			if (month - 1 < 0) {
				year--
				month = 11
			} else month--
			this.$emit('navigation', {
				navDir: 1,
				year: year,
				month: month
			})
			this.emitInput(year, month)
		},
		onDaySelected(day) {
			if (this.selectionMode === 'none') return
			this.emitInput(this.selectedYear, this.selectedMonth, day)
		},
		emitInput(year, month, selectedDay) {
			if (selectedDay == null && this.value != null) {
				selectedDay = this.value.selectedDay
			}
			this.$emit('input', {
				displayedMonth: new Date(year, month, 1),
				selectedDay: selectedDay
			})
		}
	}
}
</script>

<style lang="stylus">
.__uic_mc_
	&root
		width: 17rem

	&body
		width: 100%
		height: 100%

	&header
		display: flex
		justify-content: center
		align-items: center
		height: 3rem
		padding-left: .5rem
		padding-right: .5rem
		cursor: pointer

	&displayed-month
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		cursor: pointer
		i
			color: #AAA

	&to-previous-page
	&to-next-page
		width: 2rem
		height: 2rem
		cursor: pointer
		-webkit-transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		display: flex
		justify-content: center
		align-items: center
		svg
			height: 1rem
			width: 1rem
			-webkit-transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
			transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
			fill: #AAA
		&:hover
			svg
				fill: #000
		&.inactive
			cursor: default
	&to-previous-page
		margin-right: 1rem
		svg
			transform: rotate(180deg)
		&:hover
			svg
				transform: rotate(180deg) translateX(6px)
		&.inactive
			svg
				fill: #DDD
	&to-next-page
		margin-left: 1rem
		&:hover
			svg
				transform: translateX(6px)
		&.inactive
			svg
				fill: #DDD

	&table-head
	&table-row
		display: flex
		flex-direction: row
		justify-content: center
		align-items: center

	&table-head-cell, &table-cell
		font-size: 1rem
		box-sizing: content-box
		width: 14.285714285714286%
		height: 2rem
		line-height: 2rem
		flex-grow: 1
		text-align: center
	&table-head-cell
		cursor: default
		font-size: .8rem
	&table-cell
		cursor: pointer
		border-radius: .2rem
		-webkit-transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		&:hover
			background-color: #EEE
		&.foreign
			color: #CCC
		&.selected
			background-color: #333
			color: white

	&table-head-cell
		font-size: .8rem
	


	&current-displayed-days
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		i
			color: #AAA
</style>
