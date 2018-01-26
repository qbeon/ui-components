// This is the master component,
// it installs components either all at once or selective depending on the provided options

export default {
	install(Vue, options = {}) {
		if (this.installed) return
		this.installed = true
	
		// Components must provide a name property
		if (options.components) {
			Object.values(options.components).forEach(comp => Vue.use(comp))
		}
	
		if (options.directives) {
			Object.values(options.directives).forEach(dir => Vue.directive(dir.name, dir))
		}
	}
}
