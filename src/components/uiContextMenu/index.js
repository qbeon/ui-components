import ctx from './ContextMenu.vue'

export {
  ctx
}

export default function install(Vue) {
  // ctx.name is our component name
  // and will be used in template
  // and it's important to have the value in every component
  Vue.component(ctx.name, ctx)
}