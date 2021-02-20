<template>
  <div class="container card mt-3 text-light border-primary">
    <div class="row">
      <div class="col-12 bg-secondary">
        <h1 class="">{{ activeProject.Title }}</h1>
      </div>
      <div class="col-12">
        <h2>{{ activeProject.Payee }}</h2>
      </div>
      <div class="col-12">
        {{ activeProject.Start }} - {{ activeProject.End }}
      </div>
      <div class="col-12 d-flex flex-end">
        <button @click="clockIn" class="btn btn-success m-2">Clock-In</button>
        <button @click="clockOut" class="btn btn-danger m-2">Clock-Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
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
    await this.$store.dispatch("getTimeClocks", this.$route.params.projectId);
  },
  methods: {
    clockIn() {
      debugger;
      let currentTime = new Date();
      let timeObj = {
        ProjectId: this.$route.params.projectId,
        StartTime: moment(currentTime),
      };
      this.$store.dispatch("clockIn", timeObj);
    },
    clockOut() {
      console.log("test");
    },
  },
  computed: {
    activeProject() {
      let proj = this.$store.state.activeProject;
      proj.Start = moment(proj.Start).format("dddd, MMMM Do YYYY");
      proj.End = moment(proj.End)
        .subtract(1, "days")
        .format("dddd, MMMM Do YYYY");
      return proj;
    },
    timeClocks() {
      return this.$store.state.timeClocks;
    },
  },
};
</script>
<style scoped>
</style>