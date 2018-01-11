import Ripple from './uiRipple/ripple'

export {
  Ripple
}

export default function install(Vue) {
  Vue.directive('ripple', Ripple)
}