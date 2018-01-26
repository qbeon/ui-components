import { componentName } from '../util.js'
import Scrollable from './Scrollable.vue'

export { Scrollable }

export default function install(Vue) {
	Vue.component(componentName(Scrollable.name), Scrollable)
}
