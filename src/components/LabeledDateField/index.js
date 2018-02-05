import { componentName } from '../util.js'
import LabeledDateField from './LabeledDateField.vue'

export { LabeledDateField }

export default function install(Vue) {
	Vue.component(componentName(LabeledDateField.name), LabeledDateField)
}
