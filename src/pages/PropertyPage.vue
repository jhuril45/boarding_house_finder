<template>
  <q-page>
    <q-page-container>
      <!-- Listing Image -->
      <q-img
        :src="listing.imageUrl"
        :alt="listing.title"
        style="height: 300px; object-fit: cover"
      />

      <!-- Listing Details -->
      <q-card class="listing-card">
        <q-card-section>
          <q-card-title>{{ listing.title }}</q-card-title>
          <q-card-subtitle>{{ listing.location }}</q-card-subtitle>
        </q-card-section>

        <q-card-section class="host-section">
          <q-avatar>
            <img :src="listing.host.avatar" />
          </q-avatar>
          <div class="host-name">{{ listing.host.name }}</div>
        </q-card-section>

        <q-card-section class="details-section">
          <div class="detail-item">
            <q-icon name="local_offer" /> Price:
            <span class="detail-value">{{ listing.price }}</span>
          </div>
          <div class="detail-item">
            <q-icon name="hotel" /> Rooms:
            <span class="detail-value">{{ listing.rooms }}</span>
          </div>
          <div class="detail-item">
            <q-icon name="bathtub" /> Bathrooms:
            <span class="detail-value">{{ listing.bathrooms }}</span>
          </div>
          <!-- Add more details as needed -->
        </q-card-section>

        <!-- Description -->
        <q-card-section class="description-section">
          <q-card-title class="description-title">Description</q-card-title>
          <div class="description-text">{{ listing.description }}</div>
        </q-card-section>

        <!-- Add buttons or actions -->
        <q-card-actions align="right">
          <q-btn label="Contact Host" color="primary" @click="contactHost" />
        </q-card-actions>
      </q-card>
    </q-page-container>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      listing: {
        title: "Listing Title",
        location: "Listing Location",
        imageUrl: "https://via.placeholder.com/400",
        host: {
          name: "Host Name",
          avatar: "https://via.placeholder.com/50",
        },
        price: "$100",
        rooms: 3,
        bathrooms: 2,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        // Add more details from your Figma design
      },
    };
  },
  methods: {
    contactHost() {
      // Implement your contact host logic here
      console.log("Contacting host...");
    },
  },
};
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
  margin-bottom: 20px;

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
  margin-top: 20px;

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
