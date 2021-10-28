<template>
  <div
    v-if="project.active"
    class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2"
  >
    <router-link
      v-bind:class="{ disabled: !project.active }"
      :to="{ name: 'projectDetails', params: { projectId: project.id } }"
    >
      <div class="card border-primary mb-3 text-light project-card card-height">
        <div class="card-header">{{ project.payee }}</div>
        <div class="card-body">
          <p class="card-text">Last Day Worked: {{ project.lastDayWorked }}</p>
          <p class="card-text">
            Hours this pay period: {{ project.currentHours }}
          </p>
        </div>
      </div>
    </router-link>
  </div>
  <div
    v-else
    class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2"
    type="button"
    @click="promptSubscribe()"
  >
    <div class="card border-primary mb-3 text-light project-card card-height">
      <div class="card-header">{{ project.Payee }}</div>
      <div class="card-body">
        <i class="fa fa-lock fa-7x" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import moment from "moment";
export default {
  name: "ProjectCardComponent",
  props: ["project"],
  computed: {},
  methods: {
    promptSubscribe() {
      swal({
        title: "This project is locked",
        text: "If you wish to unlock this project, please re-subscribe",
        buttons: {
          confirm: "Subscribe",
          cancel: "Cancel",
        },
      }).then((willSubscribe) => {
        if (willSubscribe) {
          this.$router.push({ name: "subscriptions" });
        }
      });
    },
  },
};
</script>

<style scoped>
</style>