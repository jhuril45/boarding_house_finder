<template>
  <q-page v-if="listing">
    <!-- Listing Image -->
    <!-- <q-img
      :src="listing.img"
      :alt="listing.title"
      style="height: 300px; object-fit: cover"
    /> -->
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
      height="300px"
    >
      <q-carousel-slide
        :key="'other-img-' + index"
        :name="parseInt(index + 1)"
        v-for="(img, index) in [listing.img, ...listing.other_images]"
        :img-src="img"
      >
        <q-img :src="img" style="height: 300px; object-fit: cover" />
      </q-carousel-slide>
    </q-carousel>

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

      <q-card-section class="description-section">
        <q-card-title class="description-title">Business Permit</q-card-title>
        <div>
          <q-img
            :src="listing.business_permit_img"
            style="height: 300px; object-fit: cover"
          />
        </div>
      </q-card-section>

      <!-- Add buttons or actions -->
      <q-card-actions align="right" class="q-pb-xl">
        <q-page-sticky>
          <div class="q-pa-lg row">
            <div class="q-pa-xs" v-if="!is_owner">
              <q-btn label="Book " color="primary" @click="initBooking" />
            </div>
            <div class="q-pa-xs">
              <q-btn
                label="Edit "
                color="primary"
                @click="displayMaps"
                v-if="is_owner && getUser.email == listing.user"
              />
            </div>
            <div class="q-pa-xs">
              <q-btn label="Location" color="primary" @click="displayMaps" />
            </div>
          </div>
        </q-page-sticky>
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
          <DirectionViewer :location="listing.location" />
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

    <q-dialog v-model="bookingModal" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Booking</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitBooking" greedy ref="form_ref">
            <q-input
              label="Date"
              v-model="bookingForm.date"
              mask="date"
              :rules="['date']"
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="bookingForm.date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-input>
            <q-input
              v-model="bookingForm.time"
              mask="time"
              :rules="['time']"
              label="Time"
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="bookingForm.time">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-input>

            <q-btn label="Submit" color="primary" type="submit" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import DirectionViewer from "@/components/DirectionViewer.vue";
import useFormatter from "@/composables/useFormatter";
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { getListings, getUser } = storeToRefs(userStore);

const is_owner = computed(() => {
  return getUser.value?.user_type == "owner";
});

const { formatCurrency } = useFormatter();

const slide = ref(1);

const bookingModal = ref(false);
const form_ref = ref();
const bookingForm = ref({
  date: null,
  time: null,
});

const listing = ref({
  title: "Listing Title",
  location: "Listing Location",
  img: "https://via.placeholder.com/400",
  business_permit_img: "https://picsum.photos/id/1015/200/200",
  other_images: [
    "https://picsum.photos/id/1015/200/200",
    "https://picsum.photos/id/1017/200/200",
  ],
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

function initBooking() {
  bookingForm.value = {
    date: null,
    time: null,
  };
  bookingModal.value = !bookingModal.value;
}

async function submitBooking() {
  console.log("submitBooking", bookingForm.value);
  const data = await userStore.submitBooking({
    listing_id: listing.value.id,
    ...bookingForm.value,
  });
  console.log("submitBooking", data);
  $q.notify({
    message: "Booking Submitted",
    color: "green",
  });
  initBooking();
}

onMounted(() => {
  console.log("route", route.params);
  console.log("getListings", getListings.value);
  listing.value = getListings.value.find(
    (x) => x.id == route.params.property_id
  );

  if (!listing.value) router.push("/");

  console.log(getUser.value.email === listing.value.user);
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
