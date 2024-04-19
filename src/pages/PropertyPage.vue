<template>
  <q-page>
    <!-- Listing Image -->
    <q-img
      :src="listing.img"
      :alt="listing.title"
      style="height: 300px; object-fit: cover"
    />

    <!-- Listing Details -->
    <q-card class="listing-card">
      <q-card-section class="host-section q-pb-sm">
        <q-card-title>
          <div class="host-name">{{ listing.title }}</div>
        </q-card-title>
      </q-card-section>

      <q-card-section class="details-section">
        <div class="detail-item">
          <q-icon name="local_offer" /> Price:
          <span class="detail-value">{{ formatCurrency(listing.price) }}</span>
        </div>
        <div class="detail-item">
          <q-icon name="phone" /> Contact Number:
          <span class="detail-value">{{ listing.contact_number }}</span>
        </div>
        <div class="detail-item">
          <q-icon name="email" /> Email:
          <span class="detail-value">{{ listing.user }}</span>
        </div>
        <!-- Add more details as needed -->
      </q-card-section>

      <!-- Description -->
      <q-card-section class="description-section">
        <q-card-title class="description-title">Description</q-card-title>
        <div class="description-text">{{ listing.description }}</div>
      </q-card-section>

      <!-- Add buttons or actions -->
      <q-card-actions align="right" class="q-pb-xl">
        <q-btn label="View Location" color="primary" @click="displayMaps" />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="location_modal" persistent maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">View Location</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <LocationViewer :location="listing.location" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Close"
            color="primary"
            @click="location_modal = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import LocationViewer from "@/components/LocationViewer.vue";
import useFormatter from "@/composables/useFormatter";

const route = useRoute();
const userStore = useUserStore();
const { getListings } = storeToRefs(userStore);

const { formatCurrency } = useFormatter();

const listing = ref({
  title: "Listing Title",
  location: "Listing Location",
  img: "https://via.placeholder.com/400",
  host: {
    name: "Host Name",
    avatar: "https://via.placeholder.com/50",
  },
  price: "$100",
  rooms: 3,
  bathrooms: 2,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  location: {
    // latitude: Math.random() * 180 - 90,
    // longitude: Math.random() * 360 - 180,
    latitude: 8.9538327,
    longitude: 125.529305,
  },
});

const location_modal = ref(false);

function displayMaps() {
  location_modal.value = true;
  console.log("Contacting host...");
}

onMounted(() => {
  console.log("route", route.params);
  console.log("getListings", getListings.value);
  listing.value = getListings.value.find(
    (x) => x.id == route.params.property_id
  );
});
</script>

<style lang="scss">
.listing-card {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff; /* Adjust to match your design */
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.host-section {
  display: flex;
  align-items: center;

  .q-avatar img {
    border-radius: 50%;
    margin-right: 10px;
  }

  .host-name {
    font-size: 18px;
    font-weight: bold;
    color: #333; /* Adjust color */
  }
}

.details-section {
  .detail-item {
    margin-bottom: 10px;

    .q-icon {
      margin-right: 5px;
    }

    .detail-label {
      font-weight: bold;
      color: #777; /* Adjust color */
    }

    .detail-value {
      font-weight: bold;
      color: #333; /* Adjust color */
    }
  }
}

.description-section {
  .description-title {
    font-size: 24px;
    font-weight: bold;
    color: #333; /* Adjust color */
    margin-bottom: 10px;
  }

  .description-text {
    font-size: 16px;
    line-height: 1.6;
    color: #555; /* Adjust color */
  }
}

.contact-button {
  margin-top: 20px;
}
</style>
