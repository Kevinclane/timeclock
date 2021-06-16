<template>
  <div class="container-fluid border-gold bg-dark">
    <div class="row">
      <div class="col-12">
        <i
          class="fa fa-exclamation-circle fa-5x text-gold"
          aria-hidden="true"
        ></i>
      </div>
      <div class="col-12 my-1">
        Your subscription time has run out and your account has been returned to
        the free version.
      </div>
      <div class="col-12 my-1">
        The free version only allows one project to be active.
      </div>
      <div class="col-12 my-1">
        Please select the project you wish to keep active.
      </div>
      <div class="col-12 my-1">The rest will be locked, NOT deleted.</div>
    </div>
    <div class="row" v-for="project in projects" :key="project._id">
      <button
        type="button"
        @click="selectProject(project)"
        class="col-8 offset-2 my-3 text-light btn btn-primary"
      >
        {{ project.Payee }}
      </button>
    </div>
    <div class="row">
      <div class="col-12">
        <div>OR</div>
        <div>Subscribe again to keep your projects alive!</div>
        <button class="mt-3 btn btn-green">Subscriptions</button>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
export default {
  name: "DowngradeProjectPickModal",
  props: ["projects"],
  methods: {
    selectProject(project) {
      swal({
        title: "Are you sure?",
        text: "Once you select, all other projects will be locked until you subscribe again.",
        buttons: true,
        dangerMode: true,
      }).then((choose) => {
        if (choose) {
          swal("This project has been saved!", {
            icon: "success",
          });
          this.$store.dispatch("chooseDowngradeProject", project);
          this.$emit("projectPicked");
        }
      });
    },
  },
};
</script>

<style scoped>
.border-gold {
  border: 3px solid gold;
}
.text-gold {
  color: gold;
}
</style>