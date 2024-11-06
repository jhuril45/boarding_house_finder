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
            type="number"
            label="Max Person"
            v-model="form.person_per_room"
            placeholder="Enter Max Person"
            :rules="[(val) => !!val || 'Invalid Max Person']"
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
            label="Featured Image"
            v-model="form.img"
            :rules="[(val) => !!val || 'Invalid Image']"
            hide-bottom-space
          >
            <template v-slot:control>
              <div
                class="full-width row justify-center q-mt-sm"
                @click="captureImage()"
              >
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

          <q-btn color="primary" @click="captureImage()">
            {{ form.img ? "Change" : "Select" }} Featured Image
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-field
            outlined
            class="q-mb-md"
            label="Business Permit Image"
            v-model="form.business_permit_img"
            :rules="[(val) => !!val || 'Invalid Image']"
            hide-bottom-space
          >
            <template v-slot:control>
              <div
                class="full-width row justify-center q-mt-sm"
                @click="captureImage('business_permit')"
              >
                <q-img
                  fit="contain"
                  height="150px"
                  width="100%"
                  :src="form.business_permit_img"
                  v-if="form.business_permit_img"
                />
                <q-icon
                  name="cloud_upload"
                  color="grey"
                  class="dropzone-icon full-width"
                  size="150px"
                  v-else
                />
              </div>
            </template>
          </q-field>

          <q-btn color="primary" @click="captureImage('business_permit')">
            {{ form.business_permit_img ? "Change" : "Select" }} Business Permit
            Image
          </q-btn>
        </q-card-section>

        <q-card-section>
          <div class="full-width row justify-center">
            <q-carousel
              animated
              v-model="slide"
              arrows
              navigation
              infinite
              v-if="form.other_images.length"
              height="300px"
              class="col-12"
            >
              <q-carousel-slide
                :key="'other-img-' + index"
                :name="parseInt(index + 1)"
                v-for="(img, index) in form.other_images"
                :img-src="img"
              />
            </q-carousel>
            <q-icon
              name="cloud_upload"
              color="grey"
              class="dropzone-icon"
              size="150px"
              @click="captureImage('other_images')"
              v-else
            />
          </div>

          <q-btn
            class="q-mt-sm"
            color="primary"
            @click="captureImage('other_images')"
            type="button"
          >
            {{ form.other_images.length ? "Add" : "Select" }} Other Images
          </q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            size="lg"
            class="full-width q-my-md"
            label="Post Listing"
            color="primary"
            type="submit"
            :loading="loading"
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
import { useRoute } from "vue-router";

import LocationPicker from "../components/LocationPicker.vue";

const route = useRoute();
const userStore = useUserStore();
console.log("userStore", userStore);
const $q = useQuasar();

const form_ref = ref(null);
const router = useRouter();
const request_files = ref(null);
const loading = ref(false);
const slide = ref(1);

const form = ref({
  // title: "",
  // location: null,
  // price: null,
  // rooms: null,
  // contact_number: null,
  // bathrooms: null,
  // description: "",
  // img: null,
  // business_permit_img: null,
  // business_permit: null,
  // other_images: [],
  // person_per_room: null,
  title: "Test",
  location: {
    latitude: 8.946884993592914,
    longitude: 8.946884993592914,
  },
  price: 1,
  rooms: 2,
  contact_number: "1",
  bathrooms: 1,
  description: "Test",
  img: "data:image/jpeg;base64,/9j/4QDeRXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAABwAAkAcABAAAADAyMTABkQcABAAAAAECAwCGkgcAFQAAAMAAAAAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAMgAAAADoAQAAQAAACwBAAAAAAAAQVNDSUkAAABQaWNzdW0gSUQ6IDM1AP/bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/CABEIASwAyAMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAABAgMABAUG/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/9oADAMBAAIQAxAAAAH6QnbZDNgXMAGOBc2BQ2BQ2BQ2BQ2VIHDSBwJQwy2XPs9OrE9PKubAubAubAuOBcwAYlNA2GocS0DgFDCkoYJjbc/R2Y7q5BjgGOAY4AGADHArAy1DYaZwmgYJqGE2McnPU2Otzzv28Vsjo2OAY4BjgXHAAcPAhAV5zRDCgbbO0D7PVMdx9HDf5/t9XzPZt5vQHa/LQLZSMg5AxwLmE0oZU8pwDYqlV5zRzbHXny7k6Ph+vkPpcHtd3znfU+9fxbVPsv5dWeieFg7dykXU3JVVRAM7YJotmllToVmnUw59ubcGy1+fzD0/ODYo6uryyn6p4u+XSvNx3PtdHzrte4/nlr1n8ftiu2cxz7dEymGpbnowyyRr5OOs8sHdvEM2EdqJwPWEJ38el9nKnUnyt6XRnfDUXy0p2Tvy2qz5sr6X4OyxUMHXn6O7I4Wm3XxVZaCDMQnqYJCoGezgMV6u4evDb0a8vXy2vNTy40RFTTTobg6an005Kw/N3Rto8asbd3n9F5dEvF8mmfAi1AI3TaNJdc+nHSN82N+d5cZaszF9Yh6E+uLo8ebDa+8/aZc95X7eDp6I9OdbVonynoyFaNBsaLnohM4u7wllp5bV5euK25b57XfnTOhzNXfGGrnELJXXl6ennvFUUZGBDdTFYq01qnK+rFabnPbwOL0o9ePH3rebEnnlrSvK+kHLqzNEasOm3PVOmXIYDIKkp4zirs0Kzp0rCk1FR5Oi7+aPLcdm51qe3t87qltoajo18YrTFMlWTIJQquoTYYfROLq60XnjV/N7vLqIxK9PKWqpVHjObvo5P6NOlVEjdgS7uEZdSD5VrNNI1ATDO3PdAmuDj9bzGeb007NMYc1eRWubrqW3XstfYaoyyQvSjMxtKpSSaVCcBWaYsrFSosmT8b0lb5FnxaJo6l5WvOk2cMq+sXqSM5MyS2E1RTKUymRAJUbIwZAUCfNDv4nXmcHpeZ0ZC07VK1BnSmGR9cnPFLsHH1JEtFOwnRMCvMhxIM6DLA0wssclZ0R5+zzNJm0S08cKW1MP7WchnVejyupLr5DzNP2eV0p+toqyXPDJdAoZci+T5ZlGSprUeX5/vePU8wotyMcH/8QAKRAAAgICAQQCAgICAwAAAAAAAAECEQMSEBMgITEiMARBIzIUQjNQYP/aAAgBAQABBQL/ANj+vpor/s9iy/vf0bikJl/cz9dsiOYjkIzFITLL+pDF74XOT0nRHIQyEcgpikbFlllllj4un+2P32Myy8cKVGOaZs4tZBZDc3NjY2NhSLPZfls9qy+GSZnl2wzyik8cx9SAsosh1BZTZSNqNxSvh+mX42N/CdmxNmVX34808YsmDKS/Gkk3KJ1BZWQ/IjMlcBZhy2hGXhvyvbHQ3RaKsy++zRscJLmGSeMX5SkdLBlMn4+XEdNZFjzzxvWGQwyeKbjUfcXVi9uEm6okzL3JyidSZui4H8RrAxtwK3JYYSXRkjZSIojGouavrn+RHeWX422Tfib+uM5QFkwzKWkcbZj2NZbeUpZH1W31Yy8xohTIzSMkif2VZj+Lu5LpSLgZbS/4nKW7ZdG2xFiMkeEIXfRRHFIUcddOpKjJm8SnsPMkSyyqO0njhQjaicr4REXeumhSnJdODfwwinu5a65ckj/WMdTX4Rgan6eQcr4iRF2rDNmmOImhtm7kV5e2sfiSnNykhcLwN+JTPZXESIhRkzpn8aOrJHmQoCl4+JcVHqURyW8yWRSrBhjKoxdvZCZKXEYjXEREfA5OXZGy4jnZs2exQocZ6x8LOnPL6F7gvD8cLiXjhEfpjqdWj+Vij8m6MjWWehohDG6NmWxrhC+iqJWRnRG5S2ZJ9QxY1c5Kc20PJRvwpWRpKb4Qu9NIc3zdHs0ZlpR8j8La2mORAsbK4X0qNmkIrqRqM8kjwlJfCXlP0xPhCZJlFFfRVv8AqWm4xiX43bedqnLQ22YoVAuhyFbK5ojE1NRxKKHxaRs27pU7nMyxm4uLRjhtkzSUp+hvylZCJRqUJCRR5HFjgdM1ZUj5ikxM32EseWOT4FWQjrCXgbsUSERcVwhIoofFFFcKKQsbifKsnTkZsURZEsE8vxcrEhIRZXKXFl9lHs9GyQ8qJSm04NixqBKtpS8+yK7NSiu9uj3xVlwQ4uR0scY1NvJsllklD2LiuEXzZsWWWN9j8rxFfJiirlbJQTlmxeGmmhLnc2Nzc27L4ss2PZ4Q6H4NpU5oetTuXCG+dWxxYkyKGPhIpDi2VXFl0Weyas1Jx1UpEX52LNhcMVCotE2RZGjUZPsoosk6EreqhCWGhqyq4sTJSZbtMbGWY2yMmTkyc2Qdi7MrpeiB/vl/ux8//8QAIhEAAgIBBQEAAwEAAAAAAAAAAAECESADEBIhMTATQVFh/9oACAEDAQE/AfjQhdlfCjjtREWa2VlnTOFij8H6Rfey8IbVhRRQ10JUyhLoghLbiVhFkXTpnDs4dEBF4cEx6dCQ9N/oroVih6R0+ziNb9FbULTfooqzpCQ7vraWSYneyjyFEsocclESYj8ldI5akiMaLHqYoSE69Yv82jJDkXY1jZ3IUaIj7ZGJxHQ5YpFpCkKVkqix6gtUu80X/CNI1BuxF0XlYi6J+EUeFWVny/grKtjdHonn7vZIW1lY2WWWPZv4Vg9//8QAJREAAgIBBAIBBQEAAAAAAAAAAAECERIDECAhMUEwEyIyUWFx/9oACAECAQE/AfjfRfO9siyyQ+b2dFHaHOhyv4ES8bPyTLL5NifY+4iZKXZqS6G9shPhIl2rQp3Ec+zUJfczHhnKPkWon4LFqemZU/4y0m0fWXTNTVuKMxPazsyY0n6LaHqrwyc+q9GbkVIUX7FbIrrhZY4okmvA2JU7LHC1Z+KI6i5OZKaJS/ZHT6MYRJSscLFojGWZM7G6Gr9HumKqJxYolVsx70OojlJlf0j4JyFIQlxbKHEwoj2iMDArlW1fsf8AhBCGVtfOiJYhlliZZkZGReydHng4GPCit4D40UUUUUIXwvZi2T3/AP/EADYQAAEDAQUGBQIEBwEAAAAAAAEAAhEhEBIiMVEwQEFhcYEDIDKRoSNSM2JysQQTQlOAgsHR/9oACAEBAAY/Av8AAedv6oPNQ6m83TiboVgddP2v/wDVVp8tM7YsB8s7KAZGhWIXCpaZCqIth+eq1Gtl8d1GuVgshRsKQe6q0+1uBxCjxfCB6L6XiXTo5S5lNV9M1+1QRI0Klhjkrj+KI4cEDYVKnjZE+ejiFWD1Cr4bF+H7OWTx3XqdH6Vg/iY5L6nhMJ1YYKrPUhSIPMZFXfEbVESoGSqRoohXW+6qa6BUoFA2lFj8MNOoXoLmflMr6PjdisTmE8lnTmpMJoDoGkZoyaalGRM80SKFGVE+yptsyDqvqQD92SxvDumawypGXVA/9VLcgNwxQBzV2S5UDWjUoAHueKPFS63Pb1qsDICxvryUgNnmjLr3KUYp0Vy7DRxAWqkZqOc7bKBqaKviT+lYGe9Vjd2UMCq+eiDaNVajVTfcZ5qOO0oFie0fK/qd8LDDegWqqsLaaqjJOqg/Co0BVieiMUlN/uH4shU2VST5a1szVFXEdAvSBPZRF5Ek7pl3KwABVfAVD3KMRH7pzhx3OvssUdFkJXA9VhugK7FAsXpRIhreCpuHNaWxZosMSqnc+HdS5/YKAyeqguhmqyWWapuepWXypLQAqtEDILrSU5oOVFFkKdvFnpcV6FVnypuU6q40AISbBeUDIbTNZmzgsh7r8P5X4blLmOnojeb4g/1RxCedIV1zpEYSFki7cqLLusDyEb5dHJyxzGiwtjuv5bRiJqUG7joPJwYNSqSZ4miNR2CpluNfa2mI8lwHyVX3lUcQPzKovKI99zjgoyX2/up+VDVV2SFYnVRnuWcW0lcFiLuypVBsbfjHnhUUm6VFZPfdiVSnVYphYRiK0purYtHRdAgdfJ//xAAoEAACAgEEAQMFAQEBAAAAAAAAAREhMRBBUWFxIIGRMKGxwdHwQOH/2gAIAQEAAT8h/wCiP+WNII+vBBBH/M1j6b+srZEeiPRGh/WLI86xjWCPRJP1XnXeNYGtYEEUE/pMytaw+/W6FrdBP1xq6sdaYe4tSwMQ8I7Cff0GrQkn0Z1V0YaMi0Zu0gaA0R5MN+glBemCizahI4JuNxRWPIxZ0YjbRDhUtNjYVw21xFBFaheHgcBwKW8FP2GOCYwnfuQKClkaoiYv98cGQ+U/H9CYIdh2i7kW4kZaOBNodMQXceSHAGToU65KSvc3Ni5sQ8+JhCcFyyCCPQk+QyKTuXj5/pds479xhDm7Ewk5TsR4tgz34QtLsjWeBOs4WTvYdaInYZd2+hKBUFwbXA/ZMmkEEC/GCGBPnU9nwO4uhfNfsPEWdRYh8VoUh2mz7Ey2Bhv1eeAy4hBjo5Y7F7+RoYGpn7oWKZfAgR2UrI75llTSm7Gv0QQfbIcHM8OzkHhNfhnO3uEvnwkYnNyjm5fswtwaUhSJslpULXV7XEToGbX+TgVypKtYEulaw2Ie6W34IqA/lP8AoEjlrQLdqgQQTKbLIsQgyIizGRdkiEJEEEEEEDy/sz8VE+xPDsKBGOHshodW12VY5zU+CSQx2cDk16jk46LSqcv/AHZDObUhKhcAnYcstDtLgLas/cmSJiEiCCCCCCBOGdXFBNCmYlYRKcV4CSXOtuPkgfcOMeGOJKplTKBcCPNJkFE7oi929kTaWi1SRApJOW4sgJ10IIIIII0J24SkaQPFLxwON1OliXJ8/pDku4Uk3hjUbPBBJS2ux1uraLCXjBkMtsOEgWxCiCEemLIsybg90RH7FdD4tJHjZOWSVPwBUgN4ttCJ1lxMf6CVm1Lgc2634FfGnIOdYQoIx2IsP5LMtpiE9BBBAqnzGA9xOFn7k6nyUqXONhIo9oXJuLfcfAG7GUJdlkHIM+EiHGSu7pdIVIrYdaFxEZDoJCamVGQXwsy+w9tM7oRIX5z5HNLbbsSrc+6ruEc/JHA+8JhmL9cDpE+aVdxSqHwUNRs5EIvNibQ1009iYnTdlFkQkJpZtKyfesfoolKuXggctPvHwcaX2PICTaLM/Ddjyx1cBDuCXBBKUcNM2yO5aboZvAllvoyjLAm2OkI1l6W28vSpsht15Rq1Hy9yhX3Y/AUZemxclSvL+iYAq3SEqKKiy7EBMWKJqK/Qr17iuduQ3AhV/wCRmCeUYJBt9lhraSexsSi6l8sjZpJlyKi/DG/TpJ8k1Y5oQkglxpkMSSSTrZ5/AsRl8v3JEpZRH5Em0JT0jZe+G28DbouBqe8O0WMECsZEbscqbr0JPVPobGyRlpRctBk+3hORpaA7i6lbK9vI1nJeF+xiau1MVZEIfB+wiUMZsd7jRg5BLwPQQjRJkEDQyUCUscYRy7IbBubeZYQXyBLEr8aBVtK8IY6EX+kEnU8sYsnk3A6cvYvuWLUFaMQQW0Ug04INEDCEJeRxO77g5Q+C2l8k7eOQ51UNxtEW7Helq1HAziUMoYyICYBqBLQmFGovRRHQe/lHJ8hBKhox9g+UESya6UkJTdJr+jsiuOA0ohbJ/wAkrrw4nuXPdRSnHJUmhKi6MjZKgkEpkEiBCBPSRoYYgRcXe72RNOLfLJKubc3Zvt4TfQyLrgmbv+ibTizeQr5AfxwKSmEXbLBokEihAloJxpetoabkbf2MS9hvGhFcjD7gMp5xD+sTy7P6Dqymu245sYaCcCZOw2JicxrBGiEvBDwV/lmTaiR0I8NoOGO/8IabCMM0+wmsA8xoq0ff6N1+7S0RCZhjXZsIKRHkaEobQ0HD0SFd7I7edO8LlmWXZck/AEl+ilrH5/8AAjRfK2SIMKbGiRxwt2yeg0r/ACI3fktxeTgHInA4KCBDkZsXpKKEy5HAhF/A5OWTGPgyR0zzuM1ZGew6mRpZOrfMUIOFU3jD7F67Pjb5FRR4HG2xhpOXuJOR2Dnib0EKCvcSOIe1D8htsYm5whNyPYyU0JakvsUcmpMiPasiUHwExDaUOw5uRoMmhNRosEgMF7DG7PcFJWKkiBKEMRmNEn+ENVU+R/Ax8ua7G9pr2FtN5SQS2ESSQzQIj4GDZJyJbkASRL2GNYo1emzHrbmRCd+WbBqel2fmUPPKkvShn//aAAwDAQACAAMAAAAQ2y2iy6a7aQwEw484ws+Gcy3CAAAMMAEIrNhfeCzIayyCqIB0wt4ynmtBW7zd+0VGB26PQW7sGReG+CkzrqwizPRPviO0/wDsgsXy6JhjTJB7ffCpQsIJ+QbX8sFVDFs2ozTRW8bzZLjSDKkw/wD22RMffdnkkvOKqd8WXZ6fJMPLv/JnOcV/dl3cF3W9qItHmsd9EITzGd/8BkvxXn7V08Bdamf4hDLN4f4ZePm81XMTz1yVfC79IRjuD/8A/8QAIBEBAQEBAAMBAQEAAwAAAAAAAQARIRAxQSBRcZGh8P/aAAgBAwEBPxD9jkdnFw7MPYWfsBsQvZYzEjJT9vGyHxH9wQCOGfvLmbYt8XtZKPBZ4ECl7T8sGRrbrJbQkG2+pY98bbl17fwZlhGA9ezkAEshACzwY+7Fxy+iH0+oBvRG9HstMf8Am6h+2KCOrBssLJj+xp6ba+oD1ksOdkSTmfIdPqNOMu+csglOe77IX52ze+2B2zuFhVuvIgssgjfsD5J9H/V8jpf4JVrBDWPeEeMsIfy4e4HGE6gz3EIsmukeQgnoj+lozNbR7IdSfbEhdOWectPd8nbfqYFp6Shmck+32s/Ot/TA+s/9/kOi7LvPELH2jXnfAkh93fQte0t0t1lIJbHEfkB92jnBa9bFFd1slsbZZBZd4gL31hBdsewZYLVtsWbI9XViXm2kh5trH4GXY9+GTy+Rg74//8QAJxEBAQEAAgIBAgYDAQAAAAAAAQARITEQQVGB8CBhcZHR4TChscH/2gAIAQIBAT8Q3/B1DJsV8SN87bb4cNrPpEINIG/jOnEMvafjbCQlvhttttnmQkc0Xq6rrLGA/h2QbpfM9JkB9WB+sRq5IUjPcL14yyDnEfljmFEsOPTzLkfv1dn0W3m3xns4lnDT8rvUvs7jXoZ4b/ZOh8op9OGSCetH6xo3uMHfFuWngvq3ylzCt+/hkPDv6j/0kGOko9av3J4G7jp9/fdwI/MQ/LFR9WUW23yM5eLe/t/p7m3/AM6utTp4LkHcUgtltbbcspHW/QgPn+uw8npu8wjCR5MHcpWT3adE/N/b+YV1s205/SVyOWmglTbBEMvAA6tlLqyDchOgPzf4lPDq0YYcwkeIKc3B4bZb4IS63w9z3mftboV5nbxcXCDwkkkTk4Lb8orwRs5hhkrl1PFi3bLCyDJuXRdsPU8YLICdMstbEjwYF5ZdjPcQMMk1syJuHhLLVwuTuHnmwnDYtsW2zZE+Dr4PygbEsYEnwNskGXCHZZ4bz4t9xzf/xAAnEAEAAgIBAwQDAQEBAQAAAAABABEhMUFRYXEQgZGhscHR8OHxIP/aAAgBAQABPxAMypUqVKlRlSpWJUTEqVKjKiRJUqMCOErtKlSpUSVK7Su0rtEldomNSu0SV2iZ1K7SomdTwldo5anbExKlSpUqVKlRK9KlSrx6VS0ZSokSVcqJ6h6VKlf/ABUqVEuJCBGncS5Xo4iSsSqjGVXortK7SpUqV2ldpXaVKlSokHZMnoSV6kr0Q9NEmT1C5UqJXrVypUq5UwDBSOkTEoiKXeJUSNo+gajmF4CvSpUqVK9GVKqM5mdup6XHB6m46iZlJixHcSWSZNwFhdZZ6VKlSpUSVKzBf6ml5MMqVMVGodejqXYRolWR0w4hLuE8wXmXy2CJ6pcqV6EdymK2HZijCXCIvomfhiViJmIodIGWSI4PmXVl6AKGZ3INbhsAkJAyz0rvAyCaUeIllRUVsw/qLTkamQV1Iq9wQ2xUxZ8rhqYF3CTPESwsZAoLAms/cF5IVbhJuB1gesp1gK3KdYQOYi/AfQNjnnt/7DHBnMVHsT5j83TMPZHVzBd7glblI59oVLpAzFTiKmWK9YmD7Lx51KOqbB5Oo8ncg4z9wU3DTcv5lvMRLHUD1gesYX5TqNYioH2hhtqoDFwt+6YqOZnWuK4CWi+oiwazDFWJSF+jTLjSArduqw7oyu4wQVXEpexj2A94gFxk7nU6nclb/Utr9oVRYEitPlThixhOGG8zMGdWwUxhGggpp88ywLQ6eRNQqBhmu3MwUY0lC2squblks8/8it/2EIK3Wah2bN0S8XfpCGvQaQeP4Tj2qU6X5Vv2OT2MLD3CieAw/U7PwFQfX5gJIM3cBdMFr5h551o94URsal1SB/0gpBNJxt+xKpUtOVJslbQyfK4ba5FIpvtsA6rGeiFf7rUXaXRo8xr0VytqU2CHNVcQlH0fAn0EufC3B7N6oEN4T5gdZZ6OxY8jT7y2QYc39PipldZc7sv9iyP91PJMs1cv7OYuvOmyQLzwu/D+Qpy6s6t0j0YmJLVujk9mK4vCo0jSeYZORjtiNTsMYNX/AJj0ETdM3iiv9zHBZYBS6b9olDolG3u/yInKtlz4gqDRg9AlQvK8kcui6/4S7/IfUuWP+BeCX6XhfkZ/mx9wipwao96gp12CzsiJBCmEy70JctY4r2iU2eYVHmPhAZXf/wBhNuOR7Hdf65mgwJEe+c2yvklE5XT8xgMubkOQ5i5hQL4szb0P3EhU6AXLe9cfuJ7XwNR2pApujqPMukaZBz5lwBXlhlFBj0D07S8ZrLkFdCx9ozmnEifhUV8i1fPSCfMattZZ5BklicVda8hKJVxQo9TmVnSNgQgcl/jmOzyBFVGi48uI5MgBZZzVZdPzDUcaFGO4b8XMJcLTAdQtiLfdyHRen5h4IMCVzy5i9YvVggoqsDth3HcxQ19Rx9DNopQW9JQbFhKp7nJB9CZYe9m48Lzt/Z/IMRdMmqBpVvuRvxYpEl1TPiWxdt8lpRNv9hChE9/yHVhF2pA7PeBiOYeveUxgB6AOkGtfS5grBQJbAWctQzmTBr0D/wCAYrCDy08GYEX33/Mv7Hq4C7O4thfKDxeIpSwTIOyn6gHEqaTY6sunVvmK9UMCgOwRq1FOx7FTGSFOhzg7P8hHfvafyInYQmF0CDQGesOzJMmXMwExeiu8r0q4XpDQT8NRICJkf+EKCz+JaYlEA2HvS8eA+IIkUVbVXBgr2yxYsxPs79T2zFlZIFlOLquz/wAjmUAFVgX9MaVF40Gjur15jAxTsMqFGfeHAoOk193LuVwjULK4yIjXGuSGZIGjELWpUbS06OWe0pH2T/BVcsTC3+tb+EcbGwmD2NQWSt5FP0Qre26Hyx+Yu6lbauuy/wAirEcagd+WKCcBfZrHHiHstcxufk29VjuaThiKjaG1t7Srom0T5mS3MqRM+pkgwXDRM6Z1DHy4h7+gvg/qLSLlnwFsEgjyX2WxW1HaWEUw5JcgKYoj3lPypEfdyxRUlrcX3vD7zMul3RYurmVMQbhlUdHom+DesPX3jQltfRasd3+1CVCLlnGrh0Az1zLMz5ip5EtxcC9Rcre0v2/HpJdw4MQU4DTVx++kZK9poqOowhgBt6Hv/I+1DY+OXv8AEwmwaePg0TEJXS8fEOkq0AWrLhUbTq8D8EKNkK9AH2wGIO16ht/cKJbarV2rGukRCiVVbJfrHWpkBkYj5fELrS2BbYnKwWho7RfWV6wp6NCay5fpdLgXuXFRRTWYwwWQ7EQIq7SF9ANvaHQPigvyf1GyAGNVOwZYoUGijwaIevDRZmzV9W245m0IXigB7xlUs+5qQxd9fM4QCoF8N8TCl3QBV9iLdbzxK6zePUWJePS4sWovMAxBGHfl0PuLLeknJ2BrywMU/e9l/mZXTLpQo02gnue3aGVo33DKyjKjjDR2musQ9HaBNDr1nAQJdiyv1Dc7JQgAgxVdQBHMVRVUJJ7YZS42mNTOx4q18tsc6WyPybMVbEIvcBWUOybekNrXQv8AE0VlVCw6nB7S03YCsh1rpEXRTd8RMPtHZc9oFm0MsuAOCVBcQLu+0ZyYiiWpYgtwUtILFYiA+g28wLwIwYfi3b7reO/xLSgYUaeWiW2jACnlWX8pziy7ddVRxqOlnjt/INTQze4zsP2lCclxdotOIFovJlIZyWvdiicOZhxC2JTUaTN1EcME7JeKQMrHJoImw908HV7xg+8csa9CbSdC2CUGYLJ47wq2qFllt0/cxhvWVbMKKGmb58Mb9scTOztCplGuCAcVAFHjiKuL8S8ViVaJYYJMEGjEFbqCMEUaSw4jhqXuVrsWy1rPspnz1idDwFUFKiawBY6kVWdPqJD3BUXxUvkjTXZEugNq76V1vhgNKiumA8s4C4zhFtRllQIV5YF6g948C5IoMYjfiZN1KTUvdSkqoYTvn2WbtHgltiDphHIH3zOW/LPxKH1kfqOcFcshbCRRG/47wtXUTUPAv72wQb+Xv2D9R4ozZuVVrTxXnEYHKs+UUU5qzpqXHAeAz/yOOdDABGdy/BcvZPiAMFdWAJiDvUyZmMy6jpglukKSoS59AUg3JAK3Ff5Lfr8R5G9o28sVQbAq375hYx+UZPQYqCwaB606F/KFiMUzPNOaHTR1mKPM12CYQMz3hChm6RwNypuJiGolRFQYBx6HE1L8BG1yx3VL4ivQJSVY3a0EvyryY8PQ+3xDAAAwBonAXmW4FLRXL0DmDh19h9uL+YWqeCxP8eIZEW1XYqsq3PtMrRtaZQgsDiY5HuyuukEBZDTEeDmPZ1oBgaMdRLjd3POcRAqhMFqGRZ9+rxxNsyiol2iyh7Ear8fYSmHDpSMeXHsuNpVyhfB32IuaqaN/fzEaEo62LlWV0DJpenxEmLBpzLgddSroaIl3axijMwaR7WIhyQROsmgMusMId068rAbWFtL2Bo/3WXi1uWpgaTkegc/7UApraPy6nbUTgAerPgTULFzYh+PtHZScWq+VzE6rsYHxC5kKbPYfEUjhEaUNp4uvuEAA1eHyiDZuteYrl12iFYLjDZOARqtSIsHobihjDBW8Qo2zBQzNhqbL5hjcosxXXV57TIgpgo0dDoS2WHV/lx7SxinyVPucsNcO0/sGPJRHxLhGQWt0Y3M9CLB/b8x2xZnKj+BGzbSqy0PGvEKoPgR1m+xHMVFmUR2ykGyZoFJmNsRMzDqC+dQEFtsAs6OkvPeQp/5gWW80EPpHVzEcvBg+oWgtF4DnrF0zRA6KdzR7wxkMqi1ILrEPcior2kON5ltTYNkMwccTCMkwB2y8RVMQhdxveUFUEKZzLTSZiSNIDbpDBp44/wCxRzFTMyNZmymIF5zLC28wKw0xpc6jMrAOhFngTAkmVLHQNH5hQyaiIt4XeCNbYAN5ztOtfcdsdqlCoxWhZAHQ6QgNzSx8TleZzUQOY62ldBqUlQvaYAmpibp4gBUHkuFwg1N9oZTAVi1nrEsLXha1mVnar74hiboPzYfiADjaXFmo1j86jbguAuf/2Q==",
  business_permit_img:
    "data:image/jpeg;base64,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",
  other_images: [
    "data:image/jpeg;base64,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",
    "data:image/jpeg;base64,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",
  ],
  person_per_room: 1,
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

const captureImage = (type = "img") => {
  navigator.camera.getPicture(
    (imageData) => {
      console.log("imageData", imageData);
      // imageUrl.value = "data:image/jpeg;base64," + imageData;
      if (type == "img") {
        form.value.img = "data:image/jpeg;base64," + imageData;
      } else if (type == "business_permit") {
        form.value.business_permit_img = "data:image/jpeg;base64," + imageData;
      } else if (type == "other_images") {
        form.value.other_images.push("data:image/jpeg;base64," + imageData);
      }
    },
    (message) => {
      console.error("Camera error: " + message);
    },
    {
      quality: 50,
      // destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      destinationType: Camera.DestinationType.DATA_URL,
      // sourceType: Camera.PictureSourceType.CAMERA,
      sourceType: 1,
      // destinationType: 1,
    }
  );
};

function onLocationSelected(location) {
  console.log("onLocationSelected", location);
  form.value.location = location;
}

async function submitListing() {
  try {
    if (loading.value) return;
    loading.value = true;
    const data = await userStore.submitListing({
      ...form.value,
      status: "available",
    });
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
  } catch (error) {
    $q.notify({
      message: error,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
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
