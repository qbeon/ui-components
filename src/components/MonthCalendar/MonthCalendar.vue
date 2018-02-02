<template>
<div class="__uic_mc_root">
	<div class="__uic_mc_body">
		<div class="__uic_mc_header">
			<div
			v-if="navigable"
			class="__uic_mc_to-previous-page"
			:class="{'inactive': !hasPreviousPage}"
			@click="onPreviousClicked"
			v-html="arrowRightIcon"/>
			<span
			class="__uic_mc_displayed-month"
			:class="{'clickable': navigable}"
			@click="$emit('monthClick')">{{monthNames[month]}} {{year}}</span>
			<div
			v-if="navigable"
			class="__uic_mc_to-next-page"
			:class="{'inactive': !hasNextPage}"
			@click="onNextClicked"
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
					'selectable': isSelectable(day),
					'foreign': day.origin !== 0,
					'selected': isSelected(day),
				}"
				v-for="day in week"
				:key="day.monthIndex"
				@click="onDaySelected(day)">{{day.monthIndex + 1}}</div>
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

function printError(msg) {
	console.error('UI Controls - MonthCalendar: ' + msg)
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
			},
			validator(value) {
				// If selected day is defined then the date property must be of type Date
				if (value.selectedDay != null && (
					value.selectedDay.date == null ||
					typeof value.selectedDay.date.getTime !== 'function'
				)) {
					printError('invalid selected day date: ' +
						value.selectedDay.date +
						'(' + typeof value.selectedDay.date + ')'
					)
					return false
				}
				return true
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
		navigable: {
			type: Boolean,
			required: false,
			default: false
		},
		// Will disable switching to the origin month of foreign days on selection
		disableSwitchingOnSelection: {
			type: Boolean,
			required: false,
			default: false
		},
		// Will disable selection of foreign days (days of the previous or next month)
		disableForeignSelection: {
			type: Boolean,
			required: false,
			default: false
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

			year: null,
			month: null,

			arrowRightIcon: ArrowRight,
			dayTable: null
		}
	},
	computed: {
		hasNextPage() {
			// If the next month is the first of the next year
			// and the next year is bigger maximum - then no
			if (this.month + 1 > 11 &&
				this.year + 1 > this.maxYear) return false
			return true
		},
		hasPreviousPage() {
			// If the previous month is the last of the previous year
			// and the previous year is smaller minimum - then no
			if (this.month - 1 < 0 &&
				this.year - 1 < this.minYear) return false
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
				this.year = this.value.displayedMonth.getFullYear()
				this.month = this.value.displayedMonth.getMonth()
				this.verifyRange()
			} else {
				this.year = this.minYear
				this.month = 0
			}
			this.dayTable = getMonthCalendar(
				this.year, this.month, this.fullMonthCalendar
			)
		},
		verifyRange() {
			if (this.year < this.minYear) printWarning(
				'displayed year (' +
					this.year +
					') exceeds minimum (' +
					this.minYear +
					')'
			)
			if (this.year > this.maxYear) printWarning(
				'displayed year (' +
					this.year +
					') exceeds maximum (' +
					this.maxYear +
					')'
			)
		},
		goToNextPage() {
			if (!this.hasNextPage) return false
			// Increment year after december and set month to january
			if (this.month + 1 > 11) {
				this.year++
				this.month = 0
			} else this.month++
			return true
		},
		goToPreviousPage() {
			if (!this.hasPreviousPage) return
			// Decrement year after january and set month to december
			if (this.month - 1 < 0) {
				this.year--
				this.month = 11
			} else this.month--
			return true
		},
		onPreviousClicked() {
			// Don't emit input if page transition failed
			if (this.goToPreviousPage()) this.emitInput()
		},
		onNextClicked() {
			// Don't emit input if page transition failed
			if (this.goToNextPage()) this.emitInput()
		},
		onDaySelected(day) {
			if (this.selectionMode === 'none') return
			if (this.disableForeignSelection && day.origin !== 0) return

			if (!this.disableSwitchingOnSelection) {
				if (day.origin < 0) {
					// Switch to previous month
					if (!this.goToPreviousPage()) return
				} else if (day.origin > 0) {
					// Switch to next month
					if (!this.goToNextPage()) return
				}
			}

			this.emitInput(day)
		},
		emitInput(selectedDay) {
			if (selectedDay == null && this.value != null) {
				selectedDay = this.value.selectedDay
			}
			this.$emit('input', {
				displayedMonth: new Date(this.year, this.month, 1),
				selectedDay: selectedDay
			})
		},
		isSelected(day) {
			if (this.value.selectedDay != null &&
				this.value.selectedDay.date.getFullYear() == day.date.getFullYear() &&
				this.value.selectedDay.date.getMonth() == day.date.getMonth() &&
				this.value.selectedDay.date.getDate() == day.date.getDate()
			) return true
			return false
		},
		isSelectable(day) {
			if (this.disableForeignSelection && day.origin !== 0) return false
			if (this.selectionMode !== 'day') return false
			return true
		}
	}
}
</script>

<style lang="stylus">
@import '../../styles/vars'

.__uic_mc_
	&root
		width: 17rem

	&body
		width: 100%
		height: 100%
		selectable(none)

	&header
		display: flex
		justify-content: center
		align-items: center
		height: 3rem
		padding-left: .5rem
		padding-right: .5rem

	&displayed-month
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		i
			color: #AAA
		&.clickable
			cursor: pointer

	&to-previous-page
	&to-next-page
		width: 2rem
		height: 2rem
		cursor: pointer
		$default-transition(.5s)
		display: flex
		justify-content: center
		align-items: center
		svg
			height: 1rem
			width: 1rem
			$default-transition(.5s)
			fill: #AAA
		&:hover
			svg
				fill: #000
		&.inactive
			cursor: default
			svg
				fill: #DDD
			&:hover
				svg
					transform: none
	&to-previous-page
		margin-right: 1rem
		svg
			transform: rotate(180deg)
		&:hover
			svg
				transform: rotate(180deg) translateX(6px)
	&to-next-page
		margin-left: 1rem
		&:hover
			svg
				transform: translateX(6px)

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
		//flex-grow: 1
		text-align: center
	&table-head-cell
		font-size: .8rem
	&table-cell
		border-radius: .2rem
		$default-color-transition(.2s)
		&.foreign
			color: #CCC
		// Selected must have а higher specificity than selectable
		&.selected.selected
			background-color: #333
			color: white
			&:hover
				background-color: #888
		&.selectable
			cursor: pointer
			&:hover
				background-color: #EEE

	&current-displayed-days
		font-size: 1rem
		height: 1.5rem
		line-height: 1.5rem
		i
			color: #AAA
</style>
