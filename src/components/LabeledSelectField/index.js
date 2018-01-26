import { componentName } from '../util.js'
import LabeledSelectField from './LabeledSelectField.vue'

export { LabeledSelectField }

export default function install(Vue) {
	Vue.component(componentName(LabeledSelectField.name), LabeledSelectField)
}
