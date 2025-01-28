<template>
  <div class="q-pa-md">
    <q-table
      title="Risk Assessments"
      :rows="rows"
      :columns="columns"
      row-key="name"
      flat
    >
      <template v-slot:top>
        <div>Risk Assessments</div>
        <q-space/>
        <q-btn color="primary" label="Add Assessment" @click="add_assessment_dialog=true"/>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="row q-gutter-x-md">
            <q-btn label="View" size="sm" color="positive" @click="viewRiskAssessment(props.row)"/>
            <q-btn label="Delete" size="sm" color="negative"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="add_assessment_dialog">
      <q-card class="risk-assessment-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Assessment</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <RiskAssessmentForm @success="sucessSubmitForm"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="view_assessment_dialog">
      <q-card class="risk-assessment-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">View Assessment</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <RiskAssessmentCard
            :data="assessment_data"
            v-if="assessment_data" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from 'quasar'
import { storeToRefs } from "pinia";
import { useUserStore } from "stores/user";
import useFormatter from '../composables/useFormatter'

import RiskAssessmentForm from 'components/RiskAssessmentForm.vue'
import RiskAssessmentCard from 'src/components/RiskAssessmentCard.vue'

const $q = useQuasar()
const userStore = useUserStore();
const { formatDateDisplay, convertFileBase64 } = useFormatter();

const { getRiskAssessments } = storeToRefs(userStore);

const add_assessment_dialog = ref(false)
const view_assessment_dialog = ref(false)
const assessment_data = ref(null)

const columns = [
  {
    name: 'client',
    required: true,
    label: 'Client',
    align: 'left',
    field: row => row.client,
    format: val => `${val.name}`,
  },
  {
    name: 'location',
    required: true,
    label: 'Location',
    align: 'left',
    field: row => row.location,
    format: val => `${val}`,
  },
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: row => row.date,
    format: val => `${formatDateDisplay(val, "MMM, DD YYYY")}`,
  },
  {
    name: 'branch',
    required: true,
    label: 'Branch',
    align: 'left',
    field: row => row.branch,
    format: val => `${val.name}`,
  },
  // {
  //   name: 'technician',
  //   required: true,
  //   label: 'Technician',
  //   align: 'left',
  //   field: row => row.technician,
  //   format: val => `${val.name}`,
  // },
  // {
  //   name: 'technician2',
  //   required: true,
  //   label: 'Technician(2)',
  //   align: 'left',
  //   field: row => row.technician2,
  //   format: val => `${val.name}`,
  // },
  {
    name: 'permit_required',
    required: true,
    label: 'Permit Required',
    align: 'left',
    field: row => row.permit_required,
    format: val => `${Boolean(val) ? 'Yes' : 'No'}`,
  },
  {
    name: 'proceed_safe_work',
    required: true,
    label: 'Proceed Safework',
    align: 'left',
    field: row => row.proceed_safe_work,
    format: val => `${Boolean(val) ? 'Yes' : 'No'}`,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'left',
  },
]

const rows = computed(() => {
  return getRiskAssessments.value;
});

function sucessSubmitForm() {
  add_assessment_dialog.value = false
  $q.notify({
    color: "green-4",
    textColor: "white",
    icon: "done",
    message: "Success",
  });
}

async function viewRiskAssessment(data) {
  console.log('viewRiskAssessment', data)
  view_assessment_dialog.value = true
  const images = []
  data.images.forEach(async(image) => {
    const img = await convertFileBase64(image)
    console.log('img', img)
    images.push(img.data)
  });
  assessment_data.value = {
    ...data,
    client: data.client.name,
    technician: data.technician.name,
    technician2: data.technician2.name,
    branch: data.branch.name,
    // images: images,
  }
  console.log('assessment_data.value', assessment_data.value)
}


onMounted(() => {
  userStore.fetchRiskAssessments()
})
</script>

<style lang="scss">
.risk-assessment-card {
  max-width: 600px;
  width: 100%;
}
</style>
