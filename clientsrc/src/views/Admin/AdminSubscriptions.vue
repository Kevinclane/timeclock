<template>
  <div class="container">
    <div class="row">
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminSubscriptions",
  mounted() {
    this.getAllSubscriptions();
  },
  methods: {
    getAllSubscriptions() {
      this.$store.dispatch("getAllSubscriptions");
    },
  },
};
</script>