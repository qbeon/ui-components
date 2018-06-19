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
					v-for="(monthName, index) in monthNames"
					:key="index"
					@click="selectMonth(index)">{{monthName}}</li>
				</ul>
			</scrollable>
		</transition>

		<!-- DAY PICKER -->
		<transition
		name="__uic_dp_body"
		mode="out-in">
			<month-calendar
			class="__uic_dp_month-calendar"
			v-if="currentPicker === 'day'"
			navigable
			selectionMode="day"
			:locale="locale"
			v-model="monthCalendarModel"
			:maxYear="maxYear"
			:minYear="minYear"
			:fullMonthCalendar="fullMonthCalendar"
			@input="onDaySelectorInput"
			@monthClick="goToMonthSelection"/>
		</transition>
	</div>
</div>
</template>

<script>
import MonthCalendar from '../MonthCalendar/MonthCalendar.vue'
import Scrollable from '../Scrollable/Scrollable.vue'
import { ArrowRight } from '../icons'
import getMonthName from '../getMonthName'

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
		'scrollable': Scrollable,
		'month-calendar': MonthCalendar,
	},
	props: {
		locale: {
			type: String,
			required: false,
			default: 'en-US'
		},
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
		},
		validator: {
			type: Function
		},
		validateOnInit: {
			type: Boolean,
			default: false
		},
		// Includes extra foreign weeks
		// to preserve the 6-rows layout when enabled
		fullMonthCalendar: MonthCalendar.props.fullMonthCalendar,
	},
	data() {
		return {
			// Provides the SVG icon
			arrowRightIcon: ArrowRight,
			monthNames: null,

			years: [],
			displayedYears: null,
			selectedYear: null,
			selectedMonth: null,
			monthCalendarModel: null,
			currentPicker: 'year',
			isInitValue: true,
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
		}
	},
	created() {
		this.init()
		this.initMonthNames()
		this.onInput(this.value)
	},
	watch: {
		value(val) {
			this.init()
			this.onInput(val)
		},
		locale() {
			this.initMonthNames()
		}
	},
	methods: {
		initMonthNames() {
			this.monthNames = []
			const current = new Date(Date.UTC(1970, 0, 1))
			this.monthNames.push(getMonthName(current, this.locale, 'long'))
			for (let itr = 1; itr < 12; itr++) {
				current.setUTCMonth(current.getUTCMonth() + 1)
				this.monthNames.push(getMonthName(current, this.locale, 'long'))
			}
		},
		init() {
			// Ensure minimum year is smaller maximum
			if (this.minYear > this.maxYear) console.error(
				'WARNING: min year (' + minYear +
				') is smaller than max year (' + maxYear + ')'
			)

				// Initialize years
			this.displayedYears = calculateMiddleYearSpan(
				this.minYear, this.maxYear, this.yearsPerPage
			)
			this.years = []
			for (let itr = this.displayedYears.from;
				itr <= this.displayedYears.to;
				itr++
			) this.years.push(itr)

			if (this.value == null) {
				this.selectedYear = 1970
				this.selectedMonth = 0
				this.currentPicker = 'year'
			} else {
				this.selectedYear = this.value.getFullYear()
				this.selectedMonth = this.value.getMonth()
				this.monthCalendarModel = {
					displayedMonth: this.value,
					selectedDay: this.value
				}
				this.currentPicker = 'day'
			}
		},
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
			this.monthCalendarModel = {
				displayedMonth: new Date(
					Date.UTC(this.selectedYear, this.selectedMonth, 1)
				),
				selectedDay: this.selectedDay
			}
		},
		onDaySelectorInput(val) {
			if (val.selectedDay) this.onInput(val.selectedDay)
		},
		// onInput expects either null or a Date object
		onInput(val) {
			if (val == null) {
				this.goToYearSelection()
				this.selectedMonth = null
			} else {
				this.selectedYear = val.getFullYear()
				this.selectedMonth = val.getMonth()
				this.$emit('input', val)
			}

			// Validate
			this.validate(val)
		},
		validate(val) {
			if (this.validator) {
				if (this.isInitValue && !this.validateOnInit) {
					this.isInitValue = false
					return
				} else this.isInitValue = false
				if (this.validator(val) === true) this.$emit('valid')
				else this.$emit('invalid')
			}
		},
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

	&month-calendar&month-calendar
		width: 100%
		height: 100%
</style>
