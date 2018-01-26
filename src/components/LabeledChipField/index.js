import { componentName } from '../util.js'
import LabeledChipField from './LabeledChipField.vue'

export { LabeledChipField }

export default function install(Vue) {
	Vue.component(componentName(LabeledChipField.name), LabeledChipField)
}
