<template>
  <div class="contact">
    <div class="contact__container">
      <h1>お問い合わせ</h1>
      <div class="contact__text">
        <p>
          Punctをご利用頂きありがとうございます。<br>
          ご不明点やご意見がございましたら、フォームよりご連絡ください。
        </p>
        <p>
          ※ 返信がご不要な場合は、メールアドレスは省略していただいて構いません。
        </p>
      </div>
      <validation-observer v-slot="{ handleSubmit }" tag="div">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="contact__inputs">
            <validation-provider
              v-slot="{ errors }"
              rules="email"
              mode="eager"
              name="メールアドレス"
            >
              <el-input
                v-model="email"
                prefix-icon="el-icon-message"
                type="email"
                placeholder="メールアドレス"
                name="email"
                autocomplete="on"
                size="small"
                :maxlength="255"
              />
              <p class="contact__error">
                <span>{{ errors[0] }}</span>
              </p>
            </validation-provider>
          </div>
          <div class="contact__inputs">
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              mode="passive"
              name="お問い合わせ内容"
            >
              <el-input
                v-model="contact"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10 }"
                placeholder="お問い合わせ内容"
                name="contact"
                :maxlength="10000"
              />
              <p class="contact__error">
                <span>{{ errors[0] }}</span>
              </p>
            </validation-provider>
          </div>

          <div class="contact__btn-wrapper">
            <el-button
              @click.prevent="handleSubmit(onSubmit)"
              class="contact__btn"
              type="primary"
              native-type="submit"
            >
              送信する
            </el-button>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { GET, DESTROY, CONTACT } from '@/store/mutation-types'

export default {
  name: 'Contact',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      contact: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  methods: {
    onSubmit() {
      this.$store.dispatch(`user/${CONTACT}`, {
        email: this.email,
        contact: this.contact
      }).then(() => {
        this.contact = ''
        const flash = this.$store.state.message.flash
        const duration = this.$store.state.message.duration
        this.$notify({ message: flash, duration, offset: 20 })
        this.$store.dispatch(`message/${DESTROY}`)
      })
    }
  },
  created() {
    if (!this.$store.state.auth.userName) {
      return
    }
    this.$store.dispatch(`user/${GET}`).then(() => {
      this.email = this.user.email
    })
  },
}
</script>

<style scoped lang="scss">
.contact {
  padding: 32px 0 16px;
  &__container {
    width: 60%;
    @include mq {
      width: 90%;
    }
    margin: 0 auto;
  }
  &__text {
    font-size: 1.6rem;
    line-height: 1.8;
    padding-bottom: 24px;
    p {
      margin: 8px 0;
    }
  }
  &__inputs {
    padding-bottom: 4px;
  }
  &__error {
    line-height: 32px;
  }
  &__btn-wrapper {
    padding-top: 24px;
    text-align: center;
  }
  &__btn {
    font-weight: bold;
  }
}
</style>
