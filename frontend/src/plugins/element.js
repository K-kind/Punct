import Vue from 'vue'
import {
  Button,
  Input,
  InputNumber,
  Checkbox,
  Divider,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Notification,
} from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(Divider)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.component(CollapseTransition.name, CollapseTransition)
Vue.prototype.$notify = Notification;
