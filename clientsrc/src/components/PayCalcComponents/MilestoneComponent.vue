<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">${{ project.Rate }}</div>
  </div>
</template>

<script>
export default {
  name: "MilestoneComponent",
  computed: {
    project() {
      return this.$store.state.activeProject;
    },
  },
};
</script>