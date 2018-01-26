import { componentName } from '../util.js'
import ContextMenu from './ContextMenu.vue'

export { ContextMenu }

export default function install(Vue) {
	Vue.component(componentName(ContextMenu.name), ContextMenu)
}
