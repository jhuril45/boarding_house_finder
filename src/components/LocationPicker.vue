<template>
  <div>
    <div v-if="location">
      Latitude: {{ selected_location.latitude }} <br />
      Longitude: {{ selected_location.longitude }}
      <div ref="map" style="height: 70vh"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import L from "leaflet"; // Import Leaflet

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const emit = defineEmits(["location-selected"]);

const userStore = useUserStore();
const { location } = storeToRefs(userStore);

const selected_location = ref({
  latitude: 0,
  longitude: 0,
});
const map = ref(null);
const marker = ref(null);

watch(
  selected_location,
  (newValue) => {
    emit("location-selected", newValue);
  },
  { deep: true }
);

const initMap = () => {
  // Initialize the map
  map.value = L.map(map.value).setView(
    [selected_location.value.latitude, selected_location.value.longitude],
    15
  );

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  // Create the marker
  marker.value = L.marker(
    [selected_location.value.latitude, selected_location.value.longitude],
    { draggable: true }
  ).addTo(map.value);

  // Update location when marker is dragged
  marker.value.on("dragend", () => {
    const newPosition = marker.value.getLatLng();
    selected_location.value = {
      latitude: newPosition.lat,
      longitude: newPosition.lng,
    };
  });
};

onMounted(() => {
  selected_location.value = { ...location.value };
  setTimeout(() => {
    initMap();
  }, 1000);
});
</script>

<style>
@import "leaflet/dist/leaflet.css"; /* Import Leaflet CSS */
</style>
