<template>
  <div class="container">
    <div class="row my-3">
      <div class="col">
        <button
          v-if="!showProjectForm"
          class="btn btn-primary"
          @click="toggleProjectForm"
        >
          Add Project
        </button>
        <button
          v-if="showProjectForm"
          class="btn btn-danger"
          @click="toggleProjectForm"
        >
          Cancel
        </button>

        <!--PROJECT MODAL-->
        <div v-if="showProjectForm" class="modal-content container">
          <new-project-form-component />
        </div>
        <!--END PROJECT MODAL-->
      </div>
    </div>
    <div class="row"></div>
  </div>
</template>

<script>
import NewProjectFormComponent from "../components/NewProjectFormComponent.vue";
export default {
  components: { NewProjectFormComponent },
  name: "Dashboard",
  data() {
    return {
      showProjectForm: false,
    };
  },
  methods: {
    toggleProjectForm() {
      this.showProjectForm = !this.showProjectForm;
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