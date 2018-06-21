import { componentName } from '../util.js'
import DateTimePicker from './DateTimePicker.vue'

export { DateTimePicker }

export default function install(Vue) {
	Vue.component(componentName(DateTimePicker.name), DateTimePicker)
}
