<template>
  <q-page class="row justify-center">
    <div class="col-12 col-sm-3 row justify-center">
      <div class="col-12 row justify-center items-end">
        <img
          alt="Quasar logo"
          src="/dv_logo.jpg"
          style="width: 12.5rem; "
        >
      </div>
      <div class="col-12 shadow-0">
        <q-form class="q-pt-md" @submit="loginUser">
          <div class="q-gutter-y-lg">
            <div class="form-input">
              <q-input
                ref="email"
                outlined
                v-model="form.email"
                placeholder="Email Address"
                hide-bottom-space
                autocomplete="off"
              />
            </div>
            <div class="form-input">
              <q-input
                ref="Password"
                :type="show_password ? 'text' : 'password'"
                outlined
                v-model="form.password"
                placeholder="Password"
                hide-bottom-space
                autocomplete="off"
              >
                <template v-slot:append>
                  <q-icon
                    @click="show_password = !show_password"
                    :name="show_password ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer "
                  />
                </template>
              </q-input>
            </div>
            <div class="row">
              <!-- <div class="col-4">
                <div class="form-input">
                  <q-checkbox size="42px" v-model="form.remember" label="Remember" />
                </div>
              </div> -->
              <div class="col-12">
                <div>
                  <q-btn padding="0" class="auth-btn2 text-underline" color="primary" flat to="/auth/forgot-password">
                    <u>Forgot Password?</u>
                  </q-btn>
                </div>
              </div>
            </div>
            <div class="form-input">
              <p class="text-negative text-caption q-mt-sm" v-if="form_error">{{ form_error }}</p>
              <q-btn class="full-width login-btn" color="primary" label="Login" type="submit" :loading="loading"/>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

defineOptions({
  name: 'LoginPage'
});

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const show_password = ref(false)
const form_error = ref(null)

const loading = ref(false)

async function loginUser() {
  try {
    if (loading.value) return;
    form_error.value = null
    loading.value = true;
    await userStore.logoutUser()
    const response = await userStore.loginUser({
      email: form.value.email,
      password: form.value.password
    })
    console.log('loginUser response', response)
    if (response.error) {
      form_error.value = response.error
      return
    }

    const user_response = await userStore.getUser()
    if(user_response.role_name.includes("Admin")) {
      router.push('/')
    } else {
      router.push('/user-profile')
    }


  } catch (error) {
    console.log('loginUser', error)
  } finally {
    loading.value = false;
  }
}
</script>
