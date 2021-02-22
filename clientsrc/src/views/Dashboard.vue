<template>
  <div class="container">
    <div class="row my-3">
      <div class="col">
        <!--PROJECT MODAL-->
        <div v-if="showProjectForm" class="modal-content container">
          <new-project-form-component @closeModal="toggleProjectForm" />
        </div>
        <!--END PROJECT MODAL-->
      </div>
    </div>
    <div class="row">
      <div
        class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2"
      >
        <div
          v-if="loaded"
          class="card border-primary mb-3 text-light project-card card-height d-flex justify-content-center"
          type="button"
          @click="toggleProjectForm"
        >
          <i class="fas fa-5x fa-plus"></i>
        </div>
      </div>
      <project
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>

<script>
import NewProjectFormComponent from "../components/NewProjectFormComponent.vue";
import Project from "../components/ProjectCardComponent.vue";
export default {
  components: { NewProjectFormComponent, Project },
  name: "Dashboard",
  data() {
    return {
      showProjectForm: false,
      loaded: false,
    };
  },
  async mounted() {
    await this.$store.dispatch("getProjects");
    this.loaded = true;
  },
  methods: {
    toggleProjectForm() {
      this.showProjectForm = !this.showProjectForm;
    },
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
    timeClocks() {
      return this.$store.state.timeClocks;
    },
  },
};
</script>
<style scoped>
.modal-content {
  position: fixed;
  padding: 2rem;
  top: 20vh;
  left: 10vw;
  right: 10vw;
  z-index: 100;
  border-radius: 20px;
  background-color: rgba(171, 180, 187, 0.95);
  max-height: 80vh;
  max-width: 80vw;
}
@media screen and (min-width: 992px) {
  .modal-content {
    max-width: 40vw;
  }
}
</style>