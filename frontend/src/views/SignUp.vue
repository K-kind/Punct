<template>
  <div class="signup">
    <section class="">
      <div class="">
        <div v-show="errorMessage" class="">
          <div class="">
            {{ errorMessage }}
          </div>
        </div>
        <div class="">
          <div class="">
            <validation-observer v-slot="{ handleSubmit }" tag="div">
              <form @submit.prevent="handleSubmit(onSubmit)">
                <div class="">
                  <validation-provider rules="required|max:8" v-slot="{ errors }" mode="eager" name="ユーザー名">
                    <input class="" type="text" placeholder="ユーザー名" v-model="name" autofocus name="name">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <div class="">
                  <validation-provider rules="required|email" v-slot="{ errors }" mode="eager" name="メールアドレス">
                    <input class="" type="email" placeholder="Eメール" v-model="email" name="email">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <div class="">
                  <validation-provider rules="required|email" v-slot="{ errors }" mode="eager" name="メールアドレス（確認）">
                    <input class="" type="email" placeholder="Eメール（確認）" v-model="emailConfirmation" name="email-confirmation">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <div class="">
                  <validation-provider rules="required|min:6|max:20" v-slot="{ errors }" mode="eager" name="パスワード">
                    <input class="" type="password" placeholder="パスワード" v-model="password" maxlength="20" name="password" autocomplete="on">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <div class="">
                  <validation-provider rules="required|min:6|max:20" v-slot="{ errors }" mode="eager" name="パスワード（確認）">
                    <input class="" type="password" placeholder="パスワード（確認）" v-model="passwordConfirmation" maxlength="20" name="password-confirmation" autocomplete="on">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <button type="submit">登録する</button>
              </form>
            </validation-observer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import {
  CREATE,
  DESTROY
} from '@/store/mutation-types'

export default {
  name: 'SignUp',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      name: '',
      email: '',
      emailConfirmation: '',
      password: '',
      passwordConfirmation: '',
    }
  },
  methods: {
    onSubmit() {
      let payload = {
        name: this.name,
        email: this.email,
        email_confirmation: this.emailConfirmation,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      }
      this.$store.dispatch(`user/${CREATE}`, payload)
    }
  },
  computed: {
    errorMessage () {
      return this.$store.state.message.error
    }
  },
  created() {
    // let flash = this.$store.state.message.flash
    // if (flash) {
    //   this.$notify({ message: flash, duration: 2500 })
    // }
    this.$store.dispatch(`message/${DESTROY}`)
  },
}
</script>

<style scoped>
</style>
