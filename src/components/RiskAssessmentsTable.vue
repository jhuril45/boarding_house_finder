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
    </q-table>

    <q-dialog v-model="add_assessment_dialog">
      <q-card class="risk-assessment-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Assessment</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <RiskAssessmentForm/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "stores/user";
import useFormatter from '../composables/useFormatter'

import RiskAssessmentForm from 'components/RiskAssessmentForm.vue'


const userStore = useUserStore();
const { formatDateDisplay } = useFormatter();

const { getRiskAssessments } = storeToRefs(userStore);

const add_assessment_dialog = ref(false)

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
    name: 'technician',
    required: true,
    label: 'Technician',
    align: 'left',
    field: row => row.technician,
    format: val => `${val}`,
  },
  {
    name: 'technician2',
    required: true,
    label: 'Technician(2)',
    align: 'left',
    field: row => row.technician2,
    format: val => `${val}`,
  },
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
]

const rows = computed(() => {
  return getRiskAssessments.value;
});


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
