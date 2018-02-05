// Returns the localized name of the given month
// displayFormat must be either of:
export default function getMonthName(date, locale, displayFormat) {
	const name = date.toLocaleString(locale, {month: displayFormat})
	return name.charAt(0).toUpperCase() + name.slice(1)
}
