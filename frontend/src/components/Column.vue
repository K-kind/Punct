<template>
  <div class="column">
    <h2 class="column__heading"><slot name="head"></slot></h2>
    <slot name="body"></slot>
  </div>
</template>

<script>
export default {
  name: 'Column',
}
</script>

<style lang="scss" scoped>
.column {
  margin: 0 4px;
  border-radius: 3px;
  background-color: $light-gray;
  &__heading {
    font-size: 1.4rem;
    padding: 8px;
  }
}
</style>
