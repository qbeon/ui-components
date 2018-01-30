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

// Returns a calendar model of a given month
// including foreign days to visually fill up the calendar week-square
export default function getMonthDayRows(selectedYear, selectedMonth) {	
	if (selectedYear == null || selectedMonth == null) return

	const allDays = []
	var firstDayDate = new Date(selectedYear, selectedMonth, 1)
	const dayOfWeek = firstDayDate.getDay()

	// Fill in inactive days from the end of the previous month
	if (dayOfWeek > 0) {
		const previousMonthDate = new Date(firstDayDate)
		previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
		const daysOfPreviousMonth = daysInMonth(previousMonthDate)

		// Include foreign days from the previous month
		let monthDayIndex = daysOfPreviousMonth - 1
		let weekDayIndex = dayOfWeek - 1
		for (let itr = 0; itr < dayOfWeek; itr++) {
			// Calculate the day week index
			allDays.unshift({
				weekIndex: weekDayIndex,
				monthIndex: monthDayIndex,
				foreign: true
			})
			monthDayIndex--

			weekDayIndex = decrementWeekDay(weekDayIndex)
		}
	}

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
	let table = []
	for (let itr = 0; itr < allDays.length; itr += 7) {
		table.push(allDays.slice(itr, itr + 7))
	}
	return table
}