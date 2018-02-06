import { componentName } from '../util.js'
import AsyncImage from './AsyncImage.vue'

export { AsyncImage }

export default function install(Vue) {
	Vue.component(componentName(AsyncImage.name), AsyncImage)
}
