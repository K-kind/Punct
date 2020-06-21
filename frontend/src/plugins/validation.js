import { extend } from 'vee-validate'
import {
  required,
  email,
  min,
  max
} from "vee-validate/dist/rules"

extend('required', {
  ...required,
  message: '{_field_}は必須です'
})

extend('email', {
  ...email,
  message: 'メールアドレスが無効です'
})

extend('min', {
  ...min,
  params: ['length'],
  message: '{_field_}は{length}文字以上でなければなりません'
})

extend('max', {
  ...max,
  params: ['length'],
  message: '{_field_}は{length}文字以下でなければなりません'
})
