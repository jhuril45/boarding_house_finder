<template>
  <q-page class="home-page">
    <!-- Header with Search Bar -->
    <div class="home-header">
      <div class="search-bar">
        <q-input
          v-model="searchQuery"
          outlined
          placeholder="Search properties..."
          dense
          clearable
        />
      </div>
      <q-btn icon="search" class="search-btn" round flat />
    </div>

    <div>
      <!-- Featured Properties -->
      <div class="featured-properties">
        <div class="featured-properties-title">Featured Listing</div>
        <q-scroll-area class="properties-scroll" style="height: 320px">
          <div class="properties-list">
            <q-item
              v-for="(property, index) in listings"
              :key="index"
              class="q-pa-none"
              :to="'/property/' + property.id"
            >
              <q-item-section>
                <q-item-label>
                  <div class="property-card q-px-xs shadow-8">
                    <q-img
                      :src="property.img"
                      :alt="property.title"
                      cover
                      height="200px"
                      width="250px"
                    />
                    <div class="property-content">
                      <div class="property-title">{{ property.title }}</div>
                      <div class="property-subtitle">
                        {{ formatCurrency(property.price) + "/Month" }}
                      </div>
                      <div class="property-subtitle">
                        {{ property.description }}
                      </div>
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-scroll-area>
      </div>

      <div class="featured-properties q-mt-3 q-py-4">
        <div class="featured-properties-title">New Listing</div>
        <q-scroll-area class="properties-scroll" style="height: 130px">
          <div class="properties-list">
            <div
              class="q-px-sm"
              v-for="(property, index) in listings"
              :key="index"
            >
              <q-card>
                <q-card-body>
                  <q-item clickable class="property-item q-pa-none">
                    <q-item-section side>
                      <q-img
                        :src="property.img"
                        :alt="property.title"
                        class="property-img"
                      />
                    </q-item-section>
                    <q-item-section class="q-px-sm">
                      <q-item-label lines="1">
                        <div class="property-title">{{ property.title }}</div>
                        <div class="property-subtitle">
                          {{ formatCurrency(property.price) + "/Month" }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-body>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import useFormatter from "@/composables/useFormatter";

const { formatCurrency } = useFormatter();

const searchQuery = ref("");

const userStore = useUserStore();
const { listings } = storeToRefs(userStore);
</script>

<style scoped>
.home-page {
  padding: 20px;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  flex: 1;
  margin-right: 10px;
}

.featured-properties,
.featured-list {
  max-width: 800px;
  margin: 0 auto;
}

.featured-properties-title {
  font-size: 24px;
  font-weight: 500;
  margin-top: 10px;
}

.properties-list,
.list-scroll {
  display: flex;
  padding: 10px;
}

.property-card {
  flex: 0 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.property-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.property-content {
  padding: 10px;
}

.property-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.property-subtitle {
  font-size: 14px;
  color: #666;
}

.list-scroll {
  margin-top: 20px;
}

.list-scroll .q-item {
  cursor: pointer;
}

.list-scroll .q-item-label {
  white-space: normal;
}

.property-item {
  /* padding: 10px; */
  border-bottom: 1px solid #ccc;
}
</style>
