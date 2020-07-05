<template>
  <div id="app">
    <el-menu v-show="userName" :default-active="activeIndex" mode="horizontal" router>
      <el-menu-item index="/" :route="{ path: '/' }">
        ホーム
      </el-menu-item>
      <el-menu-item index="/archives" :route="{ path: '/archives' }">
        アーカイブ
      </el-menu-item>
      <el-submenu index="MyPage" :show-timeout="10">
        <template slot="title">{{ userName }}</template>
        <el-menu-item>マイページ</el-menu-item>
        <el-menu-item>ヘルプ</el-menu-item>
        <el-menu-item><NavLeft /></el-menu-item>
      </el-submenu>
    </el-menu>
    <el-menu v-show="!userName" :default-active="activeIndex" mode="horizontal" router>
      <el-menu-item index="/login" :route="{ path: '/login' }">
        ログイン
      </el-menu-item>
      <el-menu-item index="/signup" :route="{ path: '/signup' }">
        新規登録
      </el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
import 'normalize.css'
import NavLeft from '@/components/NavLeft.vue'

export default {
  name: 'App',
  components: {
    NavLeft
  },
  data() {
    return {
      activeIndex: ''
    }
  },
  computed: {
    userName() {
      return this.$store.state.auth.userName
    }
  },
  mounted() {
    this.activeIndex = location.pathname
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    }
  },
}
</script>

<style lang="scss">
// @import "@/assets/sass/prepends.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $gray-color;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: $gray-color;
}
#nav a.router-link-exact-active {
  // color: $theme-color;
  /* color: #ade4cb; */
  /* color: #c0ebd7; */
}
</style>
