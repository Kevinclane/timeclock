<template>
  <div class="row">
    <div class="col-12 bg-secondary">
      <h1 class="">{{ project.Title }}</h1>
    </div>
    <div class="col-12">
      <h2>{{ project.Payee }}</h2>
    </div>
    <h5 class="col-12">Next Invoice Available: {{ project.End }}</h5>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "WeeklyProjectDetails",
  props: ["project"],
  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>

<style scoped>
</style>