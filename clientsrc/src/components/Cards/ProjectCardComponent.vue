<template>
  <div class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2">
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
</template>

<script>
export default {
  name: "ProjectCardComponent",
  props: ["project"],
};
</script>

<style scoped>
</style>