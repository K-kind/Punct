<template>
  <div id="app">
    <el-menu
      v-if="navIsShown"
      :default-active="activeIndex"
      mode="horizontal"
      router
    >
      <template v-if="userName">
        <el-menu-item
          index="/"
          :route="{ path: '/' }"
          class="el-menu-item__left"
        >
          ホーム
        </el-menu-item>
        <el-menu-item
          index="/archives"
          :route="{ path: '/archives' }"
          class="el-menu-item__left"
        >
          アーカイブ
        </el-menu-item>
        <el-submenu index="rightMenu" :show-timeout="10">
          <template slot="title">{{ userName }}</template>
          <el-menu-item
            index="/mypage"
            :route="{ path: '/mypage' }"
          >
            マイページ
          </el-menu-item>
          <el-menu-item
            index="/help"
            :route="{ path: '/help' }"
          >
            ヘルプ
          </el-menu-item>
          <el-menu-item><NavLeft /></el-menu-item>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item
          index="/about"
          :route="{ path: '/about' }"
          class="el-menu-item__left"
        >
          Punct
        </el-menu-item>
        <el-menu-item
          index="/login"
          :route="{ path: '/login' }"
          class="el-menu-item__left"
        >
          ログイン
        </el-menu-item>
        <el-menu-item
          index="/signup"
          :route="{ path: '/signup' }"
          class="el-menu-item__left"
        >
          新規登録
        </el-menu-item>
      </template>
    </el-menu>
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavLeft from '@/components/NavLeft.vue'

export default {
  name: 'App',
  components: {
    NavLeft
  },
  data() {
    return {
      activeIndex: '',
      navIsShown: false
    }
  },
  computed: {
    userName() {
      return this.$store.state.auth.userName
    }
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path
    },
    async userName() {
      this.navIsShown = false
      await this.$nextTick()
      this.navIsShown = true
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
  height: 100%;
}
.body {
  padding-top: 35px;
  height: 100%;
}
.el-menu {
  position: fixed!important;
  z-index: 10;
  border: none!important;
  width: 100%;
  padding-left: 8px !important;
  padding-right: 8px !important;
  background-color: $theme-gray!important;
  font-weight: bold!important;
  box-shadow: 0 0 3px 1px rgba(9, 30, 66, .25);
  &--popup {
    min-width: 110px !important;
    width: 110px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
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
  &.is-active {
    background-color: #fff!important;
    color: $theme-gray!important;
    border-bottom-color: $theme-green!important;
    pointer-events: none;
    cursor: default;
    &:hover {
      color: $theme-gray!important;
    }
  }
}
.el-submenu {
  float: right!important;
  i {
    color: #fff!important;
  }
  &.is-opened {
    i {
      color: $theme-gray!important;
    }
  }
  &.is-active {
    .el-submenu__title {
      border-bottom-color: $theme-green!important;
      background-color: #fff!important;
      color: $theme-gray!important;
      &:hover {
        color: $theme-gray!important;
      }
      i {
        color: $theme-gray !important;
      }
    }
  }
}

.el-submenu__title {
  height: 35px!important;
  line-height: 35px!important;
  color: #fff!important;
  min-width: 110px;
  padding: 0 16px !important;
  text-align: center;
  cursor: default !important;
  &:hover {
    color: $theme-green!important;
  }
}
.el-menu--popup .el-menu-item {
  color: $theme-gray!important;
  &:hover {
    color: $theme-green!important;
  }
  &.is-active {
    color: $theme-green !important;
  }
}

.el-menu.v-leave-to {
  transition: none !important;
}
</style>
