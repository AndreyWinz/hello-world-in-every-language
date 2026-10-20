<template>
  <main id="app">
    <h1 class="title">Hello, World!</h1>
    <button @click="incrementCounter">Count: {{ counter }}</button>
  </main>
</template>

<script>
export default {
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    incrementCounter() {
      this.counter++;
    },
  },
};
</script>

<style>
#app {
  padding: 10px;
}

.title {
  color: #5C6AC4;
}
</style>
