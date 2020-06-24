<template>
  <div id="app">
    <div id="nav">
      <span v-if="userName">
        <router-link to="/">ホーム</router-link> |
        <router-link to="/archives">アーカイブ</router-link> |
        <a href="Javascript:void(0)">{{ userName }}</a>
      </span>
      <span v-else>
        <router-link to="/login">ログイン</router-link>
      </span>
    </div>
    <router-view/>
  </div>
</template>

<script>
import 'normalize.css'
import { SET_NAME } from '@/store/mutation-types'

export default {
  name: 'App',
  computed: {
    userName() {
      return this.$store.state.auth.userName
    }
  },
  created() {
    this.$store.dispatch(`auth/${SET_NAME}`)
    console.log('Set name します')
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
