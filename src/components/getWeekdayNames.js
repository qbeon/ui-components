// Returns an array of localized weekday names
// firstWeekDay begins at 0 = sunday
// displayFormat must be either 'narrow', 'short' or 'long'
export default function getWeekdayNames(locale, firstWeekDay, displayFormat) {
	const names = []

	// Determine beginning date, default: 4th January 1970 (sunday)
	const current = new Date(Date.UTC(1970, 0, 4))
	switch (firstWeekDay) {
	case 1: 
		current.setUTCDate(current.getUTCDate() + 1)
		break
	case 2: 
		current.setUTCDate(current.getUTCDate() + 2)
		break
	case 3: 
		current.setUTCDate(current.getUTCDate() + 3)
		break
	case 4: 
		current.setUTCDate(current.getUTCDate() + 4)
		break
	case 5: 
		current.setUTCDate(current.getUTCDate() + 5)
		break
	case 6: 
		current.setUTCDate(current.getUTCDate() + 6)
		break
	}

	names.push(current.toLocaleString(locale, {weekday: displayFormat}))
	for (let itr = 1; itr < 7; itr++) {
		current.setDate(current.getDate() + 1)
		names.push(current.toLocaleString(locale, {weekday: displayFormat}))
	}
	return names
}
