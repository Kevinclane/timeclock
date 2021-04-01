<template>
  <div v-if="loading">
    <div class="spinner-border text-primary mt-5" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  <div v-else class="container">
    <div class="row my-3">
      <div class="col">
        <!--PROJECT MODAL-->
        <div v-if="showProjectForm" class="backdrop">
          <new-project-form-component
            class="modal-content container"
            @closeModal="toggleProjectForm"
          />
        </div>
        <!--END PROJECT MODAL-->
      </div>
    </div>
    <div class="row">
      <div
        class="col-lg-4 col-md-5 col-10 offset-1 offset-md-0 offset-lg-0 mb-2"
      >
        <div
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
import ClockInModal from "../components/ClockInModal.vue";
import NewProjectFormComponent from "../components/NewProjectFormComponent.vue";
import Project from "../components/ProjectCardComponent.vue";
export default {
  name: "Dashboard",
  data() {
    return {
      showProjectForm: false,
      loading: true,
    };
  },
  async mounted() {
    await this.$store.dispatch("getProjects");
    if (this.projects.length > 0) {
      this.$store.dispatch("getProjectCardDetails", this.projects);
    }
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.dispatch("clearProjects");
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
  components: { NewProjectFormComponent, Project, ClockInModal },
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
.backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
@media screen and (min-width: 992px) {
  .modal-content {
    max-width: 40vw;
  }
}
</style>