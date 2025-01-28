<template>
  <q-form @submit="submitRiskAssessment">
    <div class="row q-gutter-y-md">
      <div class="col-6 q-px-xs">
        <q-input outlined v-model="form.date" type="date" label="Date"/>
      </div>

      <div class="col-6 q-px-xs">
        <q-select
          outlined
          v-model="form.client"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="client_options"
          emit-value
          map-options
          @filter="filterClients"
          label="Client"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-6 q-px-xs">
        <q-input outlined v-model="form.location" type="text" label="Location"/>
      </div>

      <div class="col-6 q-px-xs">
        <q-input outlined v-model="form.task" type="text" label="Task"/>
      </div>

      <div class="col-6 q-px-xs">
        <q-select
          outlined
          v-model="form.technician"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="technicians_options"
          emit-value
          map-options
          @filter="filterTechnicians"
          label="Technician 1"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-6 q-px-xs">
        <q-select
          outlined
          v-model="form.technician2"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="technicians2_options"
          emit-value
          map-options
          @filter="filterTechnicians2"
          label="Technician 2"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-12 q-px-xs">
        <q-select
          outlined
          v-model="form.branch"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="branches_options"
          emit-value
          map-options
          @filter="filterBranches"
          label="Branch"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>



      <div class="col-12">
        <q-select
          outlined
          v-model="form.hazards"
          multiple
          :options="hazards"
          label="Hazards"
        />
      </div>

      <div class="col-12">
        <q-select
          outlined
          v-model="form.control_measures"
          multiple
          :options="control_measures"
          label="Control Measures"
        />
      </div>

      <div class="col-12">
        <q-input outlined v-model="form.additional_hazard_controls" type="text" label="Additional Hazards and controls"/>
      </div>

      <div class="col-12">
        <q-file
          outlined
          v-model="form.images"
          label="Upload pictures if you see immediate danger (max 5)"
          accept=".jpg, image/*"
          max-files="5"
          multiple
          v-show="false"
          ref="file_uploader"
          @update:model-value="uploadFiles"/>

        <div class="upload-file-label q-mb-sm">Upload pictures if you see immediate danger (max 5)</div>
        <div class="upload-file-section row" @click="addFile">
          <div class="col-4 upload-file-container" v-for="(image, index) in image_preview" :key="'image-'+index">
            <div class="upload-file-item">
              <q-img :src="image" height="100px" />
            </div>
            <q-btn
              @click.stop="removeFile(index)"
              round
              icon="close"
              class="absolute-top-right"
              color="red"
              size="sm" />
          </div>
          <div v-if="form.images.length === 0" class="upload-file-label absolute-center">Click here to upload</div>
        </div>
      </div>

      <div class="col-12 row">
        <q-btn
          size="md"
          class="full-width"
          type="submit"
          color="primary"
          label="Submit" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "stores/user";
import useFormatter from '../composables/useFormatter'

import RiskAssessmentsTable from 'components/RiskAssessmentsTable.vue'


const userStore = useUserStore();
const { formatDateDisplay, convertFileBase64 } = useFormatter();
const emit = defineEmits(["success"]);

const { getClients, getTechnicians, getBranches } = storeToRefs(userStore);

const client_options = ref(getClients.value.map(x => ({value: x.id, label: x.name})))
const technicians_options = ref(getTechnicians.value.map(x => ({value: x.id, label: x.name})))
const technicians2_options = ref(getTechnicians.value.map(x => ({value: x.id, label: x.name})))
const branches_options = ref(getBranches.value.map(x => ({value: x.id, label: x.name})))

const file_uploader = ref()
const image_preview = ref([])

function filterClients (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    client_options.value = getClients.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1).map(x => ({value: x.id, label: x.name}))
  })
}

function filterTechnicians (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    technicians_options.value = getTechnicians.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1).map(x => ({value: x.id, label: x.name}))
  })
}

function filterTechnicians2 (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    technicians2_options.value = getTechnicians.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1).map(x => ({value: x.id, label: x.name}))
  })
}

function filterBranches (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    branches_options.value = getBranches.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1).map(x => ({value: x.id, label: x.name}))
  })
}

const hazards = ref([
  "Hot Work",
  "Slip, trip & Falls",
  "Exposure to noise",
  "Working at Heights",
  "Working in tight spaces",
  "Hot surface",
  "H2S present",
  "Confined space entry",
  "Limited access",
  "Pinch Points",
  "Operating Power equipment",
  "Awkward body positions",
  "Metal grinding/sparks",
  "First time performing task",
  "Corroded metals",
  "Chemical Exposure",
  "Manmade minerals",
  "Electrical hazards",
  "Critical lift",
  "Weather -Hot",
  "Weather -Cold",
  "Airborne contaminants",
  "Flammable products",
  "Working alone",
  "Wildlife",
  "Surrounding Traffic",
  "Surrounding Workers"
])

const control_measures = ref([
  "Safety Glass",
  "Daily Work Permit",
  "Full Face shield",
  "Gas Monitor",
  "Careful driving",
  "Hearing Protection",
  "FR Coveralls",
  "Identify Tie-offs",
  "Air Circulation",
  "Review MSDS/SDS",
  "Supplied air",
  "Housekeeping",
  "Fire Extinguisher",
  "Be aware / Alert",
  "Confined space entry",
  "Respirators",
  "Lock out/Tag out",
  "Use care/caution",
  "Stay clear",
  "Barricades/Signs",
  "Review rescue plan",
  "Use proper PPE"
])

const form = ref({
  id: null,
  date: null,
  client: null,
  location: null,
  technician: null,
  technician2: null,
  branch: null,
  task: null,
  hazards: [],
  control_measures: [],
  additional_hazard_controls: null,
  permit_required: null,
  proceed_safe_work: null,
  images: [],
})

async function submitRiskAssessment() {
  try {
    await userStore.submitAssessment({...form.value,image_previews: image_preview.value})
    emit('success')
    console.log('submitRiskAssessment')
  } catch(error) {

  }
}

function addFile() {
  console.log('file_uploader', file_uploader.value)
  file_uploader.value.pickFiles()
}

async function uploadFiles(files) {
  console.log('uploadFiles', files)
  files.forEach(async (file) => {
    const image = await convertFileBase64(file)
    console.log('image', image)
    image_preview.value.push(image.data)
  });
}

function removeFile(index) {
  form.value.images.splice(index, 1)
  image_preview.value.splice(index, 1)
}

onMounted(() => {
  userStore.fetchRiskAssessments()
  console.log('client_options', client_options.value)
})
</script>


<style lang="scss">
.upload-file-section {
  padding: 10px;
  min-height: 100px;
  border: dashed rgb(209, 209, 209);
  cursor: pointer;
  position: relative;

  .upload-file-container {
    padding: 5px;
    position: relative
  }

  .upload-file-item {
    border: solid rgb(209, 209, 209);
    padding: 5px;
  }
}

.upload-file-label {
  color: rgb(131, 129, 129)
}
</style>


