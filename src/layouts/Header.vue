<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        v-if="getUser"
      />

      <q-toolbar-title> App Name </q-toolbar-title>

      <div>v {{ app_version }}</div>
    </q-toolbar>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> Menu </q-item-label>

      <EssentialLink
        v-for="link in essentialLinks.filter((x) => x.is_show)"
        :key="link.title"
        v-bind="link"
      />
      <q-item clickable v-if="user" @click="logOutUser()">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref, defineComponent, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import EssentialLink from "components/EssentialLink.vue";

const userStore = useUserStore();
const router = useRouter();
const { getUser } = storeToRefs(userStore);

const user = computed(() => {
  return getUser.value;
});

const essentialLinks = computed(() => [
  {
    title: "Login",
    icon: "person",
    link: "/login",
    is_show: getUser.value == null,
  },
  {
    title: "Home",
    icon: "home",
    link: "/home",
    is_show: getUser.value !== null,
  },
  {
    title: "Post Listing",
    icon: "add",
    link: "/post-listing",
    is_show: getUser.value !== null,
  },
]);

const leftDrawerOpen = ref(false);
const app_version = ref("0.0.0");

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function logOutUser() {
  await userStore.logout();
  router.push("/auth/login");
}
</script>

<script>
export default defineComponent({
  name: "MainHeader",
});
</script>
