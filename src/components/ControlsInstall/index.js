// this component is master-component
// which installs our components all at once or selected ones depends on options object

const ControlsInstall = {
  install (Vue, options = {}) {
    if(this.installed) return
    this.installed = true

    // you must have value name in your components
    // see index.js in uiContextMenu for details
    if(options.components) {
      Object.values(options.components).forEach(c => Vue.use(c))
    }

    if(options.directives) {
      Object.values(options.directives).forEach(d => Vue.directive(d.name, d))
    }
  }
}

export default ControlsInstall