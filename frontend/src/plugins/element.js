import Vue from 'vue'
import {
  Button,
  Input,
  Menu,
  Submenu,
  MenuItem,
  Notification,
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Input)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.prototype.$notify = Notification;
