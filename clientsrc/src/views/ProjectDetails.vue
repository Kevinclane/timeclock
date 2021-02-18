<template>
  <div class="container">test</div>
</template>

<script>
export default {
  name: "ProjectDetails",
  data() {
    return {
      place: "holder",
    };
  },
  async mounted() {
    await this.$store.dispatch(
      "getActiveProject",
      this.$route.params.projectId
    );
  },
  computed: {
    ActiveProject() {
      return this.$store.state.ActiveProject;
    },
  },
};
</script>
<style scoped>
</style>