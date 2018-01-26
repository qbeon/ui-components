import { componentName } from '../util.js'
import LabeledTextField from './LabeledTextField.vue'

export { LabeledTextField }

export default function install(Vue) {
	Vue.component(componentName(LabeledTextField.name), LabeledTextField)
}
