<template>
  <div class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2">
    <router-link
      :to="{ name: 'projectDetails', params: { projectId: Project.id } }"
    >
      <div class="card border-primary mb-3 text-light project-card card-height">
        <div class="card-header">{{ Project.Title }}</div>
        <div class="card-body">
          <h4 class="card-title">{{ Project.Payee }}</h4>
          <p class="card-text">Last Day Worked</p>
          <p class="card-text">Total Hours</p>
          <p class="card-text">Hours this pay period</p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ProjectCardComponent",
  props: ["Project"],
};
</script>

<style scoped>
</style>