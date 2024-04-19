<template>
  <q-page class="flex flex-center q-pb-lg">
    <img
      alt="Quasar logo"
      src="~assets/LandingLogo.svg"
      style="width: 60vw; height: 60vh"
    />
    <div class="full-width q-px-sm">
      <!-- <div class="full-width q-px-sm q-py-sm">
        <q-btn
          class="full-width"
          size="lg"
          label="Are you a user?"
          color="grey"
          to="/auth/register"
        />
      </div> -->
      <div class="full-width q-px-sm q-py-sm">
        <q-btn
          class="full-width"
          size="lg"
          label="Create Account"
          color="primary"
          to="/auth/register"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
