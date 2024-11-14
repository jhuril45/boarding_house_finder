<template>
  <div>
    <div v-if="props.location">
      <div id="map" ref="map" style="height: 70vh; width: 100%"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

const props = defineProps({
  location: {
    type: Object,
    default: () => ({
      latitude: 0,
      longitude: 0,
    }),
  },
});

const selected_location = ref({
  latitude: props.location.latitude || 0,
  longitude: props.location.longitude || 0,
});
const map = ref(null);
const routeControl = ref(null);
const userMarker = ref(null);
const destinationMarker = ref(null);

function initMap() {
  // Initialize the map with OpenStreetMap tiles
  map.value = L.map(map.value).setView(
    [selected_location.value.latitude, selected_location.value.longitude],
    13
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  // Set up the route control with only directions, no labels
  routeControl.value = L.Routing.control({
    waypoints: [
      L.latLng(
        selected_location.value.latitude,
        selected_location.value.longitude
      ),
    ],
    routeWhileDragging: false,
    show: false, // Hide the instructions panel if it appears
    lineOptions: {
      styles: [{ color: "red", weight: 4 }],
    },
    createMarker: () => null, // Remove markers if not needed
  }).addTo(map.value);

  // Add the destination marker
  destinationMarker.value = L.marker([
    selected_location.value.latitude,
    selected_location.value.longitude,
  ])
    .addTo(map.value)
    .bindPopup("Destination");

  calculateAndDisplayRoute();
}

function calculateAndDisplayRoute() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userPosition = L.latLng(
        position.coords.latitude,
        position.coords.longitude
      );

      // Update route waypoints with the user's current location and the destination
      routeControl.value.setWaypoints([
        userPosition,
        L.latLng(
          selected_location.value.latitude,
          selected_location.value.longitude
        ),
      ]);

      // Add or update the user marker
      if (!userMarker.value) {
        userMarker.value = L.marker(userPosition)
          .addTo(map.value)
          .bindPopup("You are here");
      } else {
        userMarker.value.setLatLng(userPosition);
      }
    },
    (error) => {
      console.error("Error getting location:", error);
    }
  );
}

onMounted(() => {
  selected_location.value = JSON.parse(JSON.stringify(props.location));
  setTimeout(() => {
    initMap();
  }, 1000);
});

watch(
  () => props.location,
  (newLocation) => {
    selected_location.value = { ...newLocation };
    if (routeControl.value) {
      calculateAndDisplayRoute();
    }
    // Update the destination marker when location changes
    if (destinationMarker.value) {
      destinationMarker.value.setLatLng([
        selected_location.value.latitude,
        selected_location.value.longitude,
      ]);
    }
  },
  { deep: true }
);
</script>

<style>
@import "leaflet/dist/leaflet.css";

#map {
  height: 70vh;
  width: 100%;
  position: relative;
}

.leaflet-routing-alternatives-container {
  display: none !important;
}
</style>
