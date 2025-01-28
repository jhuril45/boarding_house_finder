<template>
  <q-card class="risk-assessment-card q-pa-none" flat >
    <q-carousel
      animated
      v-model="slide"
      control-color="grey"
      navigation
      arrows
      height="300px"
      full-screen
    >
      <q-carousel-slide
        :name="parseInt(index) + 1"
        v-for="(image,index) in data.image_previews"
        :id="parseInt(index) + 1"
        :key="'img-'+index">
        <q-img fit="contain" :src="image" height="200px"/>
      </q-carousel-slide>
    </q-carousel>

    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-6 text-h6 ellipsis">
          Client: {{data.client}}
        </div>
        <div class="col-6 text-h6 ellipsis">
          Branch: {{data.branch}}
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col-6 text-subtitle2">
          Location: {{data.location}}
        </div>
        <div class="text-subtitle2 col-6">
          Task: {{data.task}}
        </div>
        <div class="text-subtitle2 col-6">
          Permit Required: {{data.permit_required == true || data.permit_required == 1 ? 'Yes' : 'No'}}
        </div>
        <div class="text-subtitle2 col-6">
          Proceed to safe work: {{data.proceed_safe_work == true || data.proceed_safe_work == 1 ? 'Yes' : 'No'}}
        </div>
        <div class="text-subtitle2 col-6">
          Techinician 1: {{data.technician}}
        </div>
        <div class="text-subtitle2 col-6">
          Techinician 2: {{data.technician2}}
        </div>
      </div>

      <div class="text-caption ">
        Hazards: {{data.hazards.join(', ')}}.
      </div>
      <div class="text-caption ">
        Control Measures: {{data.hazards.join(', ')}}.
      </div>
      <div class="text-caption ">
        Additional Hazards and controls: {{data.additional_hazard_controls}}.
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "stores/user";
import useFormatter from '../composables/useFormatter'


const userStore = useUserStore();
const { formatDateDisplay, convertFileBase64 } = useFormatter();
const emit = defineEmits(["success"]);

const { getClients, getTechnicians, getBranches } = storeToRefs(userStore);

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      date: null,
      client: '',
      location: '',
      technician: '',
      technician2: '',
      branch: '',
      task: '',
      additional_hazard_controls: '',
      permit_required: false,
      proceed_safe_work: false,
      hazards: [],
      control_measures: [],
      images: [],
    }),
  },
});

const slide = ref(1)

onMounted(() => {
})
</script>


<style lang="scss">
.risk-assessment-card {
  max-width: 500px;
  width: 100%;

  .q-carousel__slide {
    // background-size: contain;
    // background-position: 100%;

  }
}
</style>


