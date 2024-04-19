<template>
  <q-page>
    <q-form @submit="submitListing" greedy ref="form_ref">
      <q-card class="post-listing-card">
        <q-card-section>
          <q-input
            outlined
            label="Title"
            v-model="form.title"
            placeholder="Enter title"
            :rules="[(val) => !!val || 'Invalid Title']"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            type="number"
            label="Price"
            v-model="form.price"
            placeholder="Enter price"
            number
            :rules="[(val) => (!!val && val > 0) || 'Invalid Price']"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            type="number"
            label="Contact Number"
            v-model="form.contact_number"
            placeholder="Enter number of contact number"
            :rules="[(val) => !!val || 'Invalid Contact Number']"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            label="Description"
            v-model="form.description"
            placeholder="Enter description"
            type="textarea"
            rows="5"
            :rules="[(val) => !!val || 'Invalid Description']"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-section>
          <q-field
            outlined
            class="q-mb-md"
            v-model="form.location"
            :rules="[(val) => !!val || ' is required Location']"
            hide-bottom-space
          >
            <template v-slot:control>
              <div>
                Latitude: {{ form.location?.latitude || "" }} <br />
                Longitude: {{ form.location?.longitude || "" }}
              </div>
            </template>
          </q-field>

          <q-btn color="primary" @click="getCurrentLocation">
            Select Location
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-field
            outlined
            class="q-mb-md"
            v-model="form.img"
            :rules="[(val) => !!val || 'Invalid Image']"
            hide-bottom-space
          >
            <template v-slot:control>
              <div class="full-width row justify-center" @click="captureImage">
                <q-img
                  fit="contain"
                  height="150px"
                  width="100%"
                  :src="form.img"
                  v-if="form.img"
                />
                <q-icon
                  name="cloud_upload"
                  color="grey"
                  class="dropzone-icon"
                  size="150px"
                  v-else
                />
              </div>
            </template>
          </q-field>

          <q-btn color="primary" @touchstart.prevent="" @click="captureImage">
            {{ form.img ? "Change" : "Add" }} Image
          </q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            size="lg"
            class="full-width q-my-md"
            label="Post Listing"
            color="primary"
            type="submit"
          />
        </q-card-actions>
      </q-card>
    </q-form>

    <q-dialog v-model="location_modal" persistent maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Select Location</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <LocationPicker @location-selected="onLocationSelected" />
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
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useUserStore } from "stores/user";

import LocationPicker from "../components/LocationPicker.vue";

const userStore = useUserStore();
console.log("userStore", userStore);
const $q = useQuasar();

const form_ref = ref(null);
const router = useRouter();

const form = ref({
  title: "",
  location: null,
  price: null,
  rooms: null,
  contact_number: null,
  bathrooms: null,
  description: "",
  img: null,
});

const location = ref(null);
const map = ref(null);
const marker = ref(null);
const location_modal = ref(false);

const getCurrentLocation = () => {
  location_modal.value = true;
  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     location.value = {
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //     };
  //     console.log("location.value", location.value);
  //     initMap();
  //   },
  //   (error) => {
  //     console.error("Error getting location:", error);
  //   }
  // );
};

const captureImage = () => {
  navigator.camera.getPicture(
    (imageData) => {
      // imageUrl.value = "data:image/jpeg;base64," + imageData;
      form.value.img = "data:image/jpeg;base64," + imageData;
      // console.log("captureImage", imageData);
    },
    (message) => {
      console.error("Camera error: " + message);
    },
    {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
    }
  );
};

function onLocationSelected(location) {
  console.log("onLocationSelected", location);
  form.value.location = location;
}

async function submitListing() {
  console.log("submitListing", form.value);
  const data = await userStore.submitListing(form.value);
  console.log("submitListing", data);
  $q.notify({
    message: "Success",
    color: "green",
  });
  router.push("/home");
  // form.value = {
  //   title: "",
  //   location: null,
  //   price: null,
  //   rooms: null,
  //   bathrooms: null,
  //   description: "",
  // };
  // console.log("submitListing", form_ref.value);
  // setTimeout(() => {
  //   form_ref.value.resetValidation();
  // }, 100);
}

onMounted(() => {
  // setTimeout(() => {
  //   getCurrentLocation();
  // }, 1000);
});
</script>

<style lang="scss">
.post-listing-card {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  .q-card-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .q-card-section {
    margin-bottom: 20px;
  }

  .q-input {
    max-width: 400px;
  }

  .q-card-actions {
    justify-content: flex-end;
  }
}
</style>
