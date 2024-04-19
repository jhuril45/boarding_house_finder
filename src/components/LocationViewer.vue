<template>
  <div>
    <div v-if="location">
      <div ref="map" style="height: 70vh"></div>
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
// const { location } = storeToRefs(userStore);

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

// const getCurrentLocation = () => {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       location.value = {
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       };
//       setTimeout(() => {
//         initMap();
//       }, 1000);
//     },
//     (error) => {
//       console.error("Error getting location:", error);
//     }
//   );
// };

const initMap = () => {
  map.value = new google.maps.Map(map.value, {
    center: {
      lat: selected_location.value.latitude,
      lng: selected_location.value.longitude,
    },
    zoom: 15,
  });

  // Create the marker
  marker.value = new google.maps.Marker({
    position: {
      lat: selected_location.value.latitude,
      lng: selected_location.value.longitude,
    },
    map: map.value,
    draggable: false, // Make the marker draggable
  });

  // Add event listener for when marker is dragged
  marker.value.addListener("dragend", () => {
    const newPosition = marker.value.getPosition();
    // userStore.setLocation({
    //   latitude: newPosition.lat(),
    //   longitude: newPosition.lng(),
    // });
    selected_location.value = {
      latitude: newPosition.lat(),
      longitude: newPosition.lng(),
    };
  });

  // Observe changes to the map element to handle dynamic updates
  const observer = new MutationObserver(() => {
    if (map.value.offsetWidth === 0 || map.value.offsetHeight === 0) {
      map.value.setCenter({
        lat: selected_location.value.latitude,
        lng: selected_location.value.longitude,
      });
    }
  });
  observer.observe(map.value, {
    attributes: true,
    childList: true,
    subtree: true,
  });
};

onMounted(() => {
  // Load Google Maps API
  console.log("props.location", props.location);
  selected_location.value = JSON.parse(JSON.stringify(props.location));
  setTimeout(() => {
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
