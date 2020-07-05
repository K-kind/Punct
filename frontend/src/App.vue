<template>
  <div id="app">
    <el-menu v-show="userName" :default-active="activeIndex" mode="horizontal" router>
      <el-menu-item index="/" :route="{ path: '/' }" class="el-menu-item__left">
        ホーム
      </el-menu-item>
      <el-menu-item index="/archives" :route="{ path: '/archives' }" class="el-menu-item__left">
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
      <el-menu-item index="/login" :route="{ path: '/login' }" class="el-menu-item__left">
        ログイン
      </el-menu-item>
      <el-menu-item index="/signup" :route="{ path: '/signup' }" class="el-menu-item__left">
        新規登録
      </el-menu-item>
    </el-menu>
    <div class="body">
      <router-view/>
    </div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $theme-gray;
}
.body {
  padding-top: 50px;
}
.el-menu {
  position: fixed!important;
  width: 100%;
  background-color: $theme-gray!important;
  font-weight: bold!important;
  .is-active {
    background-color: #fff!important;
    color: $theme-gray!important;
    border-bottom-color: $theme-green!important;
    cursor: default;
    &:hover {
      color: $theme-gray!important;
    }
  }
}
.el-menu-item {
  height: 35px!important;
  line-height: 35px!important;
  color: #fff!important;
  &:hover {
    color: $theme-green!important;
  }
  &__left {
    width: 110px;
    text-align: center;
  }
}
.el-submenu {
  float: right!important;
  margin-right: 6px!important;
  i {
    color: #fff!important;
  }
  &.is-opened {
    i {
      color: $theme-gray!important;
    }
  }
}

.el-submenu__title {
  height: 35px!important;
  line-height: 35px!important;
  color: #fff!important;
  &:hover {
    color: $theme-green!important;
  }
}
.el-menu--popup .el-menu-item {
  color: $theme-gray!important;
  &:hover {
    color: $theme-green!important;
  }
}

</style>
