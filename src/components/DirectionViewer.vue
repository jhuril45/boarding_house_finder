<template>
  <div>
    <div v-if="location">
      <div id="map" ref="map" style="height: 70vh"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

const emit = defineEmits(["location-selected"]);
const props = defineProps({
  location: {
    type: Object,
    default: () => {
      return {
        latitude: 0,
        longtitude: 0,
      };
    },
  },
});

const userStore = useUserStore();
const { getUserLocation } = storeToRefs(userStore);

const selected_location = ref({
  latitude: 0,
  longitude: 0,
});
const map = ref(null);
const marker = ref(null);

watch(
  selected_location,
  (first, second) => {
    emit("location-selected", first);
  },
  {
    deep: true,
    // immediate: true,
  }
);

function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: {
      lat: 8.9538327,
      lng: 125.529305,
    },
  });
  directionsRenderer.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const user_location = {
    // latitude: 8.9538327,
    // longitude: 125.529305,
    latitude: 1,
    longitude: 1,
  };
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("position", position);
      var start = new google.maps.LatLng(
        // 8.9538327,
        // 125.529305
        position.coords.latitude,
        position.coords.longitude
        // parseFloat(getUserLocation.value.latitude).toFixed(2),
        // parseFloat(getUserLocation.value.longitude).toFixed(2)

        // props.location.longitude.toFixed(2)
      );
      var end = new google.maps.LatLng(
        props.location.latitude,
        props.location.longitude
        // 8.944733,
        // 125.5347149
        // parseFloat(props.location.latitude).toFixed(2),
        // parseFloat(props.location.longitude).toFixed(2)
        // getUserLocation.value.longitude.toFixed(2)
      );

      console.log("start", start);
      console.log("end", end);
      directionsService.route(
        {
          origin: start,
          destination: end,
          // origin: "Chicago, IL",
          // destination: "Los Angeles, CA",
          // travelMode: "DRIVING",
          travelMode: google.maps.TravelMode.DRIVING,
        },
        function (response, status) {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    },
    (error) => {
      console.error("Error getting location:", error);
    }
  );

  // var start = new google.maps.LatLng(
  //   // 8.9538327,
  //   user_location.latitude,
  //   user_location.longitude
  //   // parseFloat(getUserLocation.value.latitude).toFixed(2),
  //   // parseFloat(getUserLocation.value.longitude).toFixed(2)

  //   // props.location.longitude.toFixed(2)
  // );
  // var end = new google.maps.LatLng(
  //   props.location.latitude,
  //   props.location.longitude
  //   // 8.944733,
  //   // 125.5347149
  //   // parseFloat(props.location.latitude).toFixed(2),
  //   // parseFloat(props.location.longitude).toFixed(2)
  //   // getUserLocation.value.longitude.toFixed(2)
  // );

  // console.log("start", start);
  // console.log("end", end);
  // directionsService.route(
  //   {
  //     origin: start,
  //     destination: end,
  //     // origin: "Chicago, IL",
  //     // destination: "Los Angeles, CA",
  //     travelMode: "DRIVING",
  //   },
  //   function (response, status) {
  //     if (status === "OK") {
  //       directionsRenderer.setDirections(response);
  //     } else {
  //       window.alert("Directions request failed due to " + status);
  //     }
  //   }
  // );
}

onMounted(() => {
  // Load Google Maps API
  console.log("getUserLocation", getUserLocation.value);
  console.log(
    "getUserLocation 2",
    parseFloat(getUserLocation.value.longitude).toFixed(2)
  );
  selected_location.value = JSON.parse(JSON.stringify(props.location));
  setTimeout(() => {
    console.log("selected_location.value", selected_location.value);
    initMap();
  }, 1000);
  // const script = document.createElement("script");
  // script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
  // script.async = true;
  // script.defer = true;
  // script.onload = initMap;
  // document.head.appendChild(script);
});
</script>
