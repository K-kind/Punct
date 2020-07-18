import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
// import {
//   faCoffee,
// } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faGoogle,
  // faCoffee,
)

Vue.component('Fa', FontAwesomeIcon)
// <Fa :icon="['fab', 'google']" >
