import * as components from './components'

// here we're installing our components

function uiControls (Vue, args) {
  const uiControls = components.ControlsInstall

  Vue.use(uiControls, {
    components,
    //directives,
    ...args
  })
}

export default uiControls