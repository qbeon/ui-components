import { componentName } from '../util.js'
import TextField from './TextField.vue'

export { TextField }

export default function install(Vue) {
	Vue.component(componentName(TextField.name), TextField)
}
