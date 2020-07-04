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
            <validation-observer v-slot="{ invalid }" tag="form">
              <div class="">
                <validation-provider rules="required|email" v-slot="{ errors }" mode="lazy" name="メールアドレス">
                  <input class="" type="email" placeholder="Eメール" v-model="email" autofocus="" name="email">
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="">
                <validation-provider rules="required|email" v-slot="{ errors }" mode="lazy" name="メールアドレス（確認）">
                  <input class="" type="email" placeholder="Eメール（確認）" v-model="emailConfirmation" name="email">
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <div class="">
                <validation-provider rules="required|min:6|max:20" v-slot="{ errors }" mode="lazy" name="パスワード">
                  <input class="" type="password" placeholder="パスワード" v-model="password" maxlength="20" name="password" autocomplete="on">
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </div>
              <button class="" @click.prevent="signup()" :disabled="invalid" >登録する</button>
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
      email: '',
      password: ''
    }
  },
  methods: {
    signup() {
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
