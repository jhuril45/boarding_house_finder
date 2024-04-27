<template>
  <q-page class="signup-page">
    <div class="signup-container">
      <!-- Placeholder for the image -->
      <img
        src="https://via.placeholder.com/300x100"
        alt="Create Account"
        class="signup-image"
      />

      <q-card class="signup-form-card" flat>
        <q-card-section>
          <div class="signup-header text-center">
            <q-card-title class="text-h5">Create an Account</q-card-title>
          </div>

          <q-form @submit="submitForm">
            <q-input
              v-model="formData.name"
              label="Full Name"
              dense
              outlined
              placeholder="Enter your full name"
              :rules="nameRules"
            />
            <q-input
              v-model="formData.email"
              label="Email"
              dense
              outlined
              placeholder="Enter your email"
              type="email"
              :rules="emailRules"
            />
            <q-input
              v-model="formData.contact_number"
              label="Contact Number"
              dense
              outlined
              placeholder="Enter your contact number"
              :rules="nameRules"
            />
            <q-input
              v-model="formData.password"
              label="Password"
              dense
              outlined
              placeholder="Enter your password"
              type="password"
              :rules="passwordRules"
            />
            <q-input
              v-model="formData.confirmPassword"
              label="Confirm Password"
              dense
              outlined
              placeholder="Confirm your password"
              type="password"
              :rules="confirmPasswordRules"
            />
            <q-btn
              type="submit"
              color="primary"
              label="Sign Up"
              class="btn-signup"
              dense
            />
          </q-form>

          <div class="signup-footer">
            <q-card-actions align="center">
              <span class="text-caption">Already have an account?</span>
              <q-btn
                to="/auth/login"
                color="primary"
                label="Sign In"
                flat
                dense
              />
            </q-card-actions>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user";
import { useRoute } from "vue-router";

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();

const formData = ref({
  name: "Test",
  email: "test@gmail.com",
  contact_number: "09123456789",
  password: "password",
  confirmPassword: "password",
  user_type: route.params.user_type,
});

const nameRules = ref([(val) => !!val || "Name is required"]);

const emailRules = ref([
  (val) => !!val || "Email is required",
  (val) => /.+@.+\..+/.test(val) || "Invalid email format",
]);

const contact_numberRules = ref([
  (val) => !!val || "Contact Number is required",
  (val) => val.length >= 8 || "Contact Number must be at least 5 characters",
]);

const passwordRules = ref([
  (val) => !!val || "Password is required",
  (val) => val.length >= 8 || "Password must be at least 8 characters",
]);

const confirmPasswordRules = ref([
  (val) => !!val || "Confirm Password is required",
  (val) => val === formData.value.password || "Passwords do not match",
]);

async function submitForm() {
  console.log("Form submitted:", formData.value);
  await userStore.register(formData.value);
  router.push("/home");
}
</script>

<style scoped>
.signup-page {
  display: flex;
  justify-content: center;
  align-items: start;
}

.signup-container {
  max-width: 800px;
  width: 100%;
  padding: 10px;
}

.signup-image {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0;
}

.signup-header {
  padding: 20px;
  border-bottom: 1px solid #ccc; /* Separator line */
}

.signup-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
}

.signup-footer {
  padding: 20px;
}

.btn-signup {
  width: 100%;
}
</style>
