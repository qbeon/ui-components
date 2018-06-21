import { componentName } from '../util.js'
import ResizeObserver from './ResizeObserver.vue'

export { ResizeObserver }

export default function install(Vue) {
	Vue.component(componentName(ResizeObserver.name), ResizeObserver)
}
