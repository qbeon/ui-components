import { componentName } from '../util.js'
import MonthCalendar from './MonthCalendar.vue'

export { MonthCalendar }

export default function install(Vue) {
	Vue.component(componentName(MonthCalendar.name), MonthCalendar)
}
