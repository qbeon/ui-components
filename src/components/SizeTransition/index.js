import { componentName } from '../util.js'
import SizeTransition from './SizeTransition.vue'

export { SizeTransition }

export default function install(Vue) {
	Vue.component(componentName(SizeTransition.name), SizeTransition)
}
