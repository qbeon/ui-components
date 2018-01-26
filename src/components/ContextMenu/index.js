import ContextMenu from './ContextMenu.vue'

export { ContextMenu }

export default function install(Vue) {
	Vue.component(ContextMenu.name, ContextMenu)
}
