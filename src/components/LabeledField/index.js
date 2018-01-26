import { componentName } from '../util.js'
import LabeledField from './LabeledField.vue'

export { LabeledField }

export default function install(Vue) {
	Vue.component(componentName(LabeledField.name), LabeledField)
}
