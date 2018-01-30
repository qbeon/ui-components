<template>
<div class="__uic_dp_root">
	<div class="__uic_dp_body">
		<!-- YEAR PICKER -->
		<transition
		name="__uic_dp_body"
		mode="out-in">
			<div
			class="__uic_dp_year-body"
			v-if="currentPicker === 'year'">
				<div class="__uic_dp_year-header">
					<div
					class="__uic_dp_to-previous-year-page"
					:class="{'inactive': !hasPreviousYearPage}"
					@click="previousYearPage"
					v-html="arrowRightIcon"/>
					<span class="__uic_dp_current-displayed-years">
						{{displayedYears.from}} <i>-</i> {{displayedYears.to}}
					</span>
					<div
					class="__uic_dp_to-next-year-page"
					:class="{'inactive': !hasNextYearPage}"
					@click="nextYearPage"
					v-html="arrowRightIcon"/>
				</div>
				<scrollable class="__uic_dp_year-list-scroll">
					<ul class="__uic_dp_year-list">
						<li
						class="__uic_dp_year"
						v-for="year in years"
						:key="year"
						@click="selectYear(year)">{{year}}</li>
					</ul>
				</scrollable>
			</div>
		</transition>

		<!-- MONTH PICKER -->
		<transition
		name="__uic_dp_body"
		mode="out-in">
			<scrollable
			class="__uic_dp_month-body"
			v-if="currentPicker === 'month'">
				<div class="__uic_dp_month-header">
					<div
					class="__uic_dp_to-previous-month-page"
					:class="{'inactive': !hasPreviousMonthPage}"
					@click="previousMonthPage"
					v-html="arrowRightIcon"/>
					<span
					class="__uic_dp_current-displayed-months"
					@click="goToYearSelection">
						{{selectedYear}}
					</span>
					<div
					class="__uic_dp_to-next-month-page"
					:class="{'inactive': !hasNextMonthPage}"
					@click="nextMonthPage"
					v-html="arrowRightIcon"/>
				</div>
				<ul class="__uic_dp_month-list">
					<li
					class="__uic_dp_month"
					v-for="month in months"
					:key="month.index"
					@click="selectMonth(month.index)">{{month.name}}</li>
				</ul>
			</scrollable>
		</transition>

		<!-- DAY PICKER -->
		<transition
		name="__uic_dp_body"
		mode="out-in">
			<div
			class="__uic_dp_day-body"
			v-if="currentPicker === 'day'">
				<div class="__uic_dp_day-header">
					<div
					class="__uic_dp_to-previous-day-page"
					:class="{'inactive': !hasPreviousDayPage}"
					@click="previousDayPage"
					v-html="arrowRightIcon"/>
					<span
					class="__uic_dp_current-displayed-months"
					@click="goToMonthSelection">
						{{months[selectedMonth].name}} {{selectedYear}}
					</span>
					<div
					class="__uic_dp_to-next-day-page"
					:class="{'inactive': !hasNextDayPage}"
					@click="nextDayPage"
					v-html="arrowRightIcon"/>
				</div>
				<div class="__uic_dp_day-table">
					<ul class="__uic_dp_day-table-head">
						<li class="__uic_dp_day-table-head-cell">Sun</li>
						<li class="__uic_dp_day-table-head-cell">Mon</li>
						<li class="__uic_dp_day-table-head-cell">Tue</li>
						<li class="__uic_dp_day-table-head-cell">Wed</li>
						<li class="__uic_dp_day-table-head-cell">Thu</li>
						<li class="__uic_dp_day-table-head-cell">Fri</li>
						<li class="__uic_dp_day-table-head-cell">Sat</li>
					</ul>
					<div
					class="__uic_dp_day-table-row"
					v-for="(week, index) in dayTable"
					:key="index">
						<div
						class="__uic_dp_day-table-cell"
						:class="{
							'foreign': day.foreign,
							'selected': day.monthIndex == selectedDay
						}"
						v-for="day in week"
						:key="day.monthIndex"
						@click="selectDay(day)">
							{{day.monthIndex + 1}}
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</div>
</template>

<script>
import Scrollable from '../Scrollable/Scrollable.vue'
import getMonthDayRows from './getMonthDayRows'
import { ArrowRight } from '../icons.js'

// Month is 1-indexed (January is 1, February is 2, etc).
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate() + 1
}

function calculateMiddleYearSpan(min, max, perPage) {
	// Prevent out of range
	if (perPage > max - min) perPage = max - min

	const middle = Math.floor((min + max) / 2)
	const delta = Math.floor(perPage / 2)
	
	// If not divisible by 2 then
	if (perPage % 2 === 0) return {from: middle - delta, to: middle + delta - 1}
	else return {from: middle - delta, to: middle + delta}
}

export default {
	name: 'date-picker',
	components: {
		'scrollable': Scrollable
	},
	props: {
		value: {
			type: Date,
			required: false
		},
		mode: {
			type: String,
			required: false,
			default: 'year-date',
			validator(mode) {
				switch (mode) {
				case 'year-date':
					return true
				}
				console.error('Invalid date picker mode: ' + mode)
				return false
			}
		},
		yearsPerPage: {
			type: Number,
			required: false,
			default: 20
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
		}
	},
	data() {
		return {
			// Provides the SVG icon
			arrowRightIcon: ArrowRight,

			years: [],
			months: [
				{index: 0, name: 'January'},
				{index: 1, name: 'February'},
				{index: 2, name: 'March'},
				{index: 3, name: 'April'},
				{index: 4, name: 'May'},
				{index: 5, name: 'June'},
				{index: 6, name: 'July'},
				{index: 7, name: 'August'},
				{index: 8, name: 'September'},
				{index: 9, name: 'October'},
				{index: 10, name: 'November'},
				{index: 11, name: 'December'}
			],
			dayTable: [],

			displayedYears: calculateMiddleYearSpan(
				this.minYear, this.maxYear, this.yearsPerPage
			),
			selectedYear: null,
			selectedMonth: null,
			selectedDay: null,

			currentPicker: 'year',
		}
	},
	computed: {
		hasNextYearPage() {
			return this.displayedYears.to < this.maxYear
		},
		hasPreviousYearPage() {
			return this.displayedYears.from > this.minYear
		},
		hasNextMonthPage() {
			return this.selectedYear + 1 <= this.maxYear
		},
		hasPreviousMonthPage() {
			return this.selectedYear - 1 >= this.minYear
		},
		hasNextDayPage() {
			// If the next month is the first of the next year
			// and the next year is bigger maximum - then no
			if (this.selectedMonth + 1 > 11 &&
				this.selectedYear + 1 > this.maxYear) return false
			return true
		},
		hasPreviousDayPage() {
			// If the previous month is the last of the previous year
			// and the previous year is smaller minimum - then no
			if (this.selectedMonth - 1 < 0 &&
				this.selectedYear - 1 < this.minYear) return false
			return true
		},
		selectedDate() {
			return new Date(
				this.selectedYear != null ? this.selectedYear : 1970,
				this.selectedMonth != null ? this.selectedMonth : 0,
				this.selectedDay != null ? this.selectedDay : 1,
			)
		}
	},
	watch: {
		selectedYear() {
			// Recalculate days
			this.renewDaysTable()
		},
		selectedMonth() {
			// Recalculate days
			this.renewDaysTable()
		}
	},
	created() {
		// Ensure minimum year is smaller maximum
		if (this.minYear > this.maxYear) console.error(
			'WARNING: min year (' + minYear +
			') is smaller than max year (' + maxYear + ')'
		)

		if (this.value == 'current') this.value = new Date().toISOString()
		
		// Initialize years
		for (let itr = this.displayedYears.from;
			itr <= this.displayedYears.to;
			itr++
		) {
			this.years.push(itr)
		}

		// Initialize days
		this.renewDaysTable()
	},
	methods: {
		// Fills currently displayed years with the next page of years
		nextYearPage() {
			const from = this.displayedYears.from
			const to = this.displayedYears.to

			// Don't do anything if already at the very end
			if (to >= this.maxYear) return

			const newYears = []
			let lastYear = to + this.yearsPerPage
			let firstYear = from + this.yearsPerPage

			const currentPageSize = to - from
			if (currentPageSize < this.yearsPerPage) {
				firstYear = to + 1
				lastYear = firstYear + this.yearsPerPage - 1
			}

			// Prevent overflow
			if (lastYear > this.maxYear) lastYear = this.maxYear

			// Finally generate years list
			for (let itr = firstYear; itr <= lastYear; itr++) newYears.push(itr)
			this.years = newYears
			this.displayedYears = { from: firstYear, to: lastYear }
		},
		// Fills currently displayed years with the previous page of years
		previousYearPage() {
			const from = this.displayedYears.from
			const to = this.displayedYears.to

			// Don't do anything if already at the very beginning
			if (from <= this.minYear) return

			const newYears = []
			let lastYear = to - this.yearsPerPage
			let firstYear = from - this.yearsPerPage

			const currentPageSize = to - from
			if (currentPageSize < this.yearsPerPage) {
				lastYear = from - 1
				firstYear = lastYear - this.yearsPerPage + 1
			}

			// Prevent overflow
			if (firstYear < this.minYear) firstYear = this.minYear

			// Finally generate the years list
			for (let itr = firstYear; itr <= lastYear; itr++) newYears.push(itr)

			this.years = newYears
			this.displayedYears = { from: firstYear, to: lastYear }
		},
		nextMonthPage() {
			if (!this.hasNextMonthPage) return
			this.selectedYear++
		},
		previousMonthPage() {
			if (!this.hasPreviousMonthPage) return
			this.selectedYear--
		},
		nextDayPage() {
			if (!this.hasNextDayPage) return
			// Increment year after december and set month to january
			if (this.selectedMonth + 1 > 11) {
				this.selectedYear++
				this.selectedMonth = 0
			} else this.selectedMonth++
		},
		previousDayPage() {
			if (!this.hasPreviousDayPage) return
			// Decrement year after january and set month to december
			if (this.selectedMonth - 1 < 0) {
				this.selectedYear--
				this.selectedMonth = 11
			} else this.selectedMonth--
		},
		goToYearSelection() {
			this.currentPicker = 'year'
		},
		goToMonthSelection() {
			this.currentPicker = 'month'
		},

		selectYear(year) {
			this.selectedYear = year
			this.currentPicker = 'month'
		},
		selectMonth(month) {
			this.selectedMonth = month
			this.currentPicker = 'day'
		},
		selectDay(day) {
			if (day.foreign) return
			this.selectedDay = day.monthIndex
			this.$emit('input', this.selectedDate)
		},

		renewDaysTable() {
			this.dayTable = getMonthDayRows(
				this.selectedYear, this.selectedMonth, true
			)
		}
	}
}
</script>

<style lang="stylus">
.__uic_dp_
	&root
		position: relative
		display: inline-block
		font-size: 0px
		line-height: 0px
		width: 17rem
		height: 17rem
		box-sizing: content-box
	&body
		width: 100%
		height: 100%
		overflow: hidden
		&-enter-active
			transition: all .75s
		&-leave-active
			transition: all .1s
		&-enter
			opacity: 0
			transform: translateX(6px)
		&-leave-to
			opacity: 0

	&year-body
		width: 100%
		height: 100%
		display: block
	&year-list
		list-style: none
		margin: 0px
		padding: 0px
		display: flex
		flex-wrap: wrap
		padding-left: .5rem
		padding-right: .5rem
	&year-list-scroll
		height: 14rem
	&year
		width: 16,666666667%
		font-size: 1rem
		display: inline-block
		box-sizing: content-box
		padding: .5rem
		padding-top: .4rem
		padding-bottom: .4rem
		height: 2rem
		line-height: 2rem
		flex-grow: 1
		min-width: 3rem
		max-width: 4rem
		text-align: center
		cursor: pointer
		border-radius: .2rem
		-webkit-transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		&:hover
			background-color: #EEE
	&year-header
	&month-header
	&day-header
		display: flex
		justify-content: center
		align-items: center
		height: 3rem
		padding-left: .5rem
		padding-right: .5rem
	&current-displayed-years
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		i
			color: #AAA
	&to-previous-year-page
	&to-next-year-page
	&to-previous-month-page
	&to-next-month-page
	&to-previous-day-page
	&to-next-day-page
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
	&to-previous-year-page
	&to-previous-month-page
	&to-previous-day-page
		margin-right: 1rem
		svg
			transform: rotate(180deg)
		&:hover
			svg
				transform: rotate(180deg) translateX(6px)
		&.inactive
			svg
				fill: #DDD
	&to-next-year-page
	&to-next-month-page
	&to-next-day-page
		margin-left: 1rem
		&:hover
			svg
				transform: translateX(6px)
		&.inactive
			svg
				fill: #DDD
	
	&month-body
		width: 100%
		height: 100%
		display: block
	&month-list
		list-style: none
		margin: 0px
		padding: 0px
		display: flex
		flex-wrap: wrap
		justify-content: center
		padding-left: .5rem
		padding-right: .5rem
	&month
		font-size: 1rem
		display: inline-block
		box-sizing: content-box
		padding: .5rem
		height: 2rem
		line-height: 2rem
		max-width: 5rem
		flex-grow: 1
		text-align: center
		cursor: pointer
		border-radius: .2rem
		-webkit-transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		transition: all .5s cubic-bezier(0.19, 1, 0.22, 1)
		&:hover
			background-color: #EEE
	&current-displayed-months
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		cursor: pointer
		i
			color: #AAA

	&day-body
		width: 100%
		height: 100%
		display: block
	&day-label-list
		list-style: none
		display: flex
		justify-content: center
		align-items: center
		height: 2rem
		width: 100%
		li
			height: 2rem
			line-height: 2rem
			display: inline-block
			flex-grow: 1
			font-size: 1rem
			text-align: center
	&day-table-head
		list-style: none
	&day-table-head-cell, &day-table-cell
		font-size: 1rem
		display: inline-block
		box-sizing: content-box
		width: 14.285714285714286%
		height: 2rem
		line-height: 2rem
		flex-grow: 1
		text-align: center
	&day-table-head-cell
		cursor: default
		font-size: .8rem
	&day-table-cell
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
	&current-displayed-days
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		i
			color: #AAA
</style>
