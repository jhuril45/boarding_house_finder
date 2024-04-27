<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "stores/user";

export default defineComponent({
  name: "App",
  methods: {
    requestLocationPermission() {
      console.log("this", this.$q.platform.is.cordova);
      const permissions = cordova.plugins.permissions;
      console.log("permissions", permissions);
      permissions.checkPermission(
        permissions.ACCESS_FINE_LOCATION,
        (granted) => {
          if (!granted.hasPermission) {
            permissions.requestPermission(
              permissions.ACCESS_FINE_LOCATION,
              (status) => {
                if (!status.hasPermission) {
                  // Handle permission denied
                } else {
                  const userStore = useUserStore();
                  userStore.getCurrentLocation();
                }
              },
              (error) => console.error(error)
            );
          } else {
            const userStore = useUserStore();
            userStore.getCurrentLocation();
          }
        },
        (error) => console.error(error)
      );

      permissions.checkPermission(
        permissions.MEDIA_CONTENT_CONTROL,
        (granted) => {
          if (!granted.hasPermission) {
            permissions.requestPermission(
              permissions.MEDIA_CONTENT_CONTROL,
              (status) => {
                if (!status.hasPermission) {
                  // Handle permission denied
                }
              },
              (error) => console.error(error)
            );
          }
        },
        (error) => console.error(error)
      );
    },
  },
  mounted() {
    if (this.$q.platform.is.cordova) {
      this.requestLocationPermission();
    }

    // const script = document.createElement("script");
    // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4yLWq_DDK0EDdiiC3u6NsMrrlzVMSuz0`;
    // script.async = true;
    // script.defer = true;
    // document.head.appendChild(script);
  },
});
</script>
