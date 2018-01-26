import * as components from './components'

// here we're installing our components
export default function Controls (Vue, args) {
	Vue.use(components.Install, {
		components,
		//directives,
		...args
	})
}
