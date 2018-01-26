import LabeledTextField from './LabeledTextField.vue'

export { LabeledTextField }

export default function install(Vue) {
	Vue.component(LabeledTextField.name, LabeledTextField)
}
