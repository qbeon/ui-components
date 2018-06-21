import { componentName } from '../util.js'
import LabeledDateTimeField from './LabeledDateTimeField.vue'

export { LabeledDateTimeField }

export default function install(Vue) {
	Vue.component(
		componentName(LabeledDateTimeField.name),
		LabeledDateTimeField
	)
}
