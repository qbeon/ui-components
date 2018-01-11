<template>
  <div class="container">
    <div>

      <checkbox v-model="kek">kek</checkbox>
      {{ kek }}
    </div>
  </div>
</template>

<script>
export default {
  data:() => ({
    kek: true
  })
} 
</script>

<style lang="stylus" scoped>
.container
  display flex
  width 640px
  justify-content center

</style>
