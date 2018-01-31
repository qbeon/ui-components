function decrementWeekDay(weekDayIndex) {
	// Count down the week day index
	if (weekDayIndex - 1 < 0) return 6
	else return weekDayIndex - 1
}

function incrementWeekDay(weekDayIndex) {
	// Count up the week day index
	if (weekDayIndex + 1 > 6) return 0
	else return weekDayIndex + 1
}

function daysInMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

// Returns the given number of days from the previous month in a reserved order
function prevMonthDaysFromEnd(firstDay) {
	const days = []
	const previousMonthDate = new Date(firstDay)
	previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)

	let dayOfWeek = firstDay.getDay()
	if (dayOfWeek === 0) dayOfWeek = 7

	let monthDayIndex = daysInMonth(previousMonthDate) - 1
	let weekDayIndex = dayOfWeek - 1

	for (let itr = 0; itr < dayOfWeek; itr++) {
		// Calculate the day week index
		days.unshift({
			weekIndex: weekDayIndex,
			monthIndex: monthDayIndex,
			foreign: true
		})
		monthDayIndex--
		weekDayIndex = decrementWeekDay(weekDayIndex)
	}

	return days
}

// Returns a calendar model of a given month
// including foreign days to visually fill up the calendar week-square
export default function getMonthCalendar(
	selectedYear, selectedMonth, fillAllRows
) {	
	if (selectedYear == null || selectedMonth == null) return

	let allDays = []
	var firstDayDate = new Date(selectedYear, selectedMonth, 1)
	const dayOfWeek = firstDayDate.getDay()

	// Include foreign days from the previous month
	if (dayOfWeek > 0) allDays = prevMonthDaysFromEnd(firstDayDate)
	// Include an extra week in case of full 6-row calendars
	else if (fillAllRows) allDays = prevMonthDaysFromEnd(firstDayDate)

	// Fill in actual month-native days
	const daysOfCurrentMonth = daysInMonth(firstDayDate)
	let weekDayIndex = dayOfWeek
	for (let itr = 0; itr < daysOfCurrentMonth; itr++) {
		allDays.push({
			weekIndex: weekDayIndex,
			monthIndex: itr,
			foreign: false
		})
		
		// Count up the week day index
		weekDayIndex = incrementWeekDay(weekDayIndex)
	}

	// Count down the week day index
	// because of the last increment in the loop above
	weekDayIndex = decrementWeekDay(weekDayIndex)

	// Fill in foreign days from the beginning of the next month
	if (weekDayIndex < 6) {
		// Include disabled days from the next month
		let monthDayIndex = 0
		while(weekDayIndex < 6) {
			// Calculate the day week index
			allDays.push({
				weekIndex: weekDayIndex,
				monthIndex: monthDayIndex,
				foreign: true
			})
			monthDayIndex++
			weekDayIndex = incrementWeekDay(weekDayIndex)
		}
	}

	// Convert into calendar rows
	const table = []
	for (let itr = 0; itr < allDays.length; itr += 7) {
		table.push(allDays.slice(itr, itr + 7))
	}

	// If there's still not enough rows to fill up the calendar
	// then append an extra week from the next month
	if (fillAllRows && table.length < 6) {
		const extraWeek = []

		// Get the month index of the last known day
		let monthDayIndex = table[table.length - 1][6].monthIndex
		for (let itr = 0; itr < 7; itr++) {
			monthDayIndex++
			extraWeek.push({
				weekIndex: itr,
				monthIndex: monthDayIndex,
				foreign: true
			})
		}
		table.push(extraWeek)
	}

	return table
}