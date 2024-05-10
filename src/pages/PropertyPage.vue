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
      >
        <q-img :src="img" style="height: 300px; object-fit: cover" />
      </q-carousel-slide>
    </q-carousel>

    <!-- Listing Details -->
    <q-card class="listing-card">
      <q-card-section class="host-section q-pb-sm">
        <q-card-title>
          <div class="host-name">{{ listing.title }}</div>
          <div class="property-title q-mt-sm" v-if="booking && !is_owner">
            Booked on
            {{ formatDateDisplay(new Date(booking.date + " " + booking.time)) }}
            <span
              :class="
                'text-capitalize ' +
                (booking.status == 'booked'
                  ? 'text-green'
                  : booking.status == 'pending'
                  ? 'text-warning'
                  : 'text-red')
              "
              >({{ booking.status }})</span
            >
          </div>
          <div class="property-title q-mt-sm">
            <span
              :class="
                'text-capitalize ' +
                (listing.status == 'full'
                  ? 'text-green'
                  : listing.status == 'available'
                  ? 'text-warning'
                  : 'text-red')
              "
              >({{ listing.status }})</span
            >
          </div>
        </q-card-title>
      </q-card-section>

      <q-card-section class="details-section">
        <div class="detail-item">
          <q-icon name="local_offer" /> Price:
          <span class="detail-value">
            {{ formatCurrency(listing.price) }} / Month
          </span>
        </div>
        <div class="detail-item">
          <q-icon name="person" /> Max Person:
          <span class="detail-value">
            {{ listing.person_per_room }}
          </span>
        </div>
        <div class="detail-item">
          <q-icon name="phone" /> Contact Number:
          <span class="detail-value">
            {{ listing.contact_number }}
          </span>
        </div>
        <div class="detail-item">
          <q-icon name="email" /> Email:
          <span class="detail-value">
            {{ listing.user }}
          </span>
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
              <q-btn
                v-if="booking && booking.status === 'pending'"
                label="Remove Booking"
                color="primary"
                @click="removeBooking()"
              />
              <q-btn
                v-else-if="!booking && listing.status === 'available'"
                label="Book"
                color="primary"
                @click="initBooking()"
              />
            </div>
            <div class="q-pa-xs" v-else-if="booking_list.length">
              <q-btn
                :label="'Bookings (' + booking_list.length + ')'"
                color="primary"
                @click="viewBookingList()"
              />
            </div>
            <div
              class="q-pa-xs"
              v-if="is_owner && getUser.email == listing.user"
            >
              <q-btn
                label="Set as Full"
                color="warning"
                @click="setFullListing()"
              />
            </div>
            <div
              class="q-pa-xs"
              v-if="is_owner && getUser.email == listing.user"
            >
              <q-btn label="Remove" color="red" @click="removeListing()" />
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

    <q-dialog v-model="bookingListModal" maximized>
      <q-card style="min-width: 100vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Booking List</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item v-for="item in booking_list" :key="'booking-' + item.id">
              <q-item-section>
                <q-item-label>{{ item.user }}</q-item-label>
                <q-item-label caption lines="2">
                  {{ formatDateDisplay(new Date(item.date + " " + item.time)) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <div class="row q-gutter-x-md" v-if="item.status === 'pending'">
                  <q-btn
                    size="xs"
                    color="primary"
                    icon="check"
                    @click="approveBooking(item.id)"
                  />

                  <q-btn
                    size="xs"
                    color="red"
                    icon="close"
                    @click="declineBooking(item.id)"
                  />
                </div>
                <div
                  :class="
                    'text-capitalize ' +
                    (item.status == 'booked' ? 'text-green' : 'text-red')
                  "
                  v-else
                >
                  {{ item.status }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
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
const { getListings, getUser, getMyBookings } = storeToRefs(userStore);

const is_owner = computed(() => {
  return getUser.value?.user_type == "owner";
});

const booking = computed(() => {
  return getMyBookings.value.find(
    (x) => x.listing_id == route.params.property_id
  );
});

const booking_list = computed(() => {
  return getMyBookings.value.filter(
    (x) => x.listing_id == route.params.property_id
  );
});

const { formatCurrency, formatDateDisplay } = useFormatter();

const slide = ref(1);

const bookingModal = ref(false);
const bookingListModal = ref(false);
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
  person_per_room: 2,
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

function viewBookingList() {
  bookingListModal.value = true;
}

async function removeListing() {
  console.log("removeListing", listing.value);
  const data = await userStore.removeListing({
    ...listing.value,
  });
  console.log("removeListing", data);
  $q.notify({
    message: "Listing Removed",
    color: "green",
  });
  router.push("/");
}

async function setFullListing() {
  console.log("setFullListing", listing.value);
  const data = await userStore.setFullListing({
    ...listing.value,
  });
  console.log("setFullListing", data);
  $q.notify({
    message: "Listing set to Full",
    color: "green",
  });
  getListing();
}

async function submitBooking() {
  console.log("submitBooking", bookingForm.value);
  const data = await userStore.submitBooking({
    listing_id: listing.value.id,
    ...bookingForm.value,
    status: "booked",
  });
  console.log("submitBooking", data);
  $q.notify({
    message: "Booking Submitted",
    color: "green",
  });
  initBooking();
}

async function removeBooking() {
  console.log("removeBooking", booking.value);
  const data = await userStore.removeBooking({
    ...booking.value,
  });
  console.log("removeBooking", data);
  $q.notify({
    message: "Booking Removed",
    color: "green",
  });
}

async function approveBooking() {
  console.log("approveBooking", booking.value);
  const data = await userStore.approveBooking({
    ...booking.value,
  });
  console.log("approveBooking", data);
  $q.notify({
    message: "Booking Removed",
    color: "green",
  });
}

async function declineBooking() {
  console.log("declineBooking", booking.value);
  const data = await userStore.declineBooking({
    ...booking.value,
  });
  console.log("declineBooking", data);
  $q.notify({
    message: "Booking Removed",
    color: "green",
  });
}

async function getListing() {
  listing.value = getListings.value.find(
    (x) => x.id == route.params.property_id
  );
}

onMounted(() => {
  console.log("route", route.params);
  console.log("getListings", getListings.value);
  getListing();
  if (!listing.value) router.push("/");

  console.log("booking", booking.value);
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
