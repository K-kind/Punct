// import Vue from 'vue'
// import Element from 'element-ui'
// import '../element-variables.scss'
// import locale from 'element-ui/lib/locale/lang/ja'

// Vue.use(Element, { locale })

import Vue from 'vue'
import {
  Button,
  Input,
  Notification,
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Input)

Vue.prototype.$notify = Notification;
