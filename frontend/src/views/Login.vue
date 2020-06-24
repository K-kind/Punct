<template>
  <div class="login">
    <section class="hero is-light is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <article v-show="errorMessage" class="message is-warning">
            <div class="message-body">
              {{ errorMessage }}
            </div>
          </article>
          <div class="column is-4 is-offset-4">
            <div class="box">
              <validation-observer v-slot="{ invalid }" tag="form">
                <div class="field">
                  <validation-provider rules="required|email" v-slot="{ errors }" mode="lazy" name="メールアドレス">
                    <input class="input is-large" type="email" placeholder="Eメール" v-model="email" autofocus="" name="email">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <div class="field">
                  <validation-provider rules="required|min:6|max:20" v-slot="{ errors }" mode="lazy" name="パスワード">
                    <input class="input is-large" type="password" placeholder="パスワード" v-model="password" maxlength="20" name="password" autocomplete="on">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <div class="field">
                  <label class="checkbox">
                  <input type="checkbox">
                  ログインしたままにする
                  </label>
                </div>
                <button class="button is-block is-info is-large is-fullwidth" @click.prevent="login()" :disabled="invalid" >ログイン</button>
              </validation-observer>
            </div>
            <p class="has-text-grey">
              <a href="..">パスワードを忘れた方はこちら</a>
            </p>
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
  name: 'Login',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$store.dispatch(
        `auth/${CREATE}`, {
          email: this.email,
          password: this.password
        }
      )
    }
  },
  computed: {
    errorMessage () {
      return this.$store.state.message.error
    }
  },
  created() {
    this.$store.dispatch(`message/${DESTROY}`)
  },
}
</script>

<style scoped>
</style>
