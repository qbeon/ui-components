import LabeledField from './LabeledField.vue'

export {
  LabeledField
}

export default function install(Vue) {
  Vue.component(LabeledField.name, LabeledField)
}