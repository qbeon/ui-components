<template>
  <div class="select-container">
    <label :for="name"><slot name="label"></slot></label>
    <select :name="name" 
      class="select-input">
      <slot></slot>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    name: String,

  }
}
</script>

<style lang="stylus" scoped>
.select-container
  position relative
  padding .5rem
  .select-input
    min-width 100px
    box-shadow 0 0 0 1px #d9d9d9
    border 0
    border-radius 4px
    padding 1.375rem .5rem .25rem
    font-size 1rem
    font-family inherit
  label
    position absolute
    color #757575
    font-size .85rem
    padding .125rem .625rem

</style>
