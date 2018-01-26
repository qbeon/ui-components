import LabeledSelectField from './LabeledSelectField.vue'

export { LabeledSelectField }

export default function install(Vue) {
	Vue.component(LabeledSelectField.name, LabeledSelectField)
}
