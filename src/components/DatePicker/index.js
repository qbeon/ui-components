import { componentName } from '../util.js'
import DatePicker from './DatePicker.vue'

export { DatePicker }

export default function install(Vue) {
	Vue.component(componentName(DatePicker.name), DatePicker)
}
