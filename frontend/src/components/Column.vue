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
  border-radius: 4px;
  background-color: $light-gray;
  box-shadow: 0 0 3px 1px rgba(9, 30, 66, .25);
  &__heading {
    font-size: 1.4rem;
    padding: 8px;
  }
}
</style>
