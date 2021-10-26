<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div v-if="!showDetails" class="col-12 text-left">
      <i
        class="fa fa-plus"
        type="button"
        @click="toggleShowDetails"
        aria-hidden="true"
      ></i>
    </div>
    <div v-else class="col-12 text-left">
      <i
        class="fa fa-minus"
        type="button"
        @click="toggleShowDetails"
        aria-hidden="true"
      ></i>
      <div
        v-for="(week, index) in activePP.weeks"
        :key="`week-${index}`"
        class="row text-center"
      >
        <div v-if="week.OTTime == 0" class="col-8">
          {{ week.totalTime }} x ${{ project.Rate }}/hr
        </div>
        <div v-if="week.OTTime == 0" class="col-4 border-left-green">
          ${{ week.totalPay }}
        </div>

        <div v-if="week.OTTime > 0" class="col-8">
          {{ week.regHours }} x ${{ project.Rate }}/hr
        </div>
        <div v-if="week.OTTime > 0" class="col-4 border-left-green">
          ${{ week.regPay }}
        </div>
        <div v-if="week.OTTime > 0" class="col-8">
          {{ week.OTTime }} x ${{ week.OTRate }}/hr
        </div>
        <div v-if="week.OTTime > 0" class="col-4 border-left-green">
          ${{ week.OTPay }}
        </div>
      </div>
    </div>
    <h4 class="col-12 py-2">${{ activePP.totalPay }}</h4>
  </div>
</template>

<script>
export default {
  name: "HourlyComponent",
  data() {
    return {
      showDetails: false,
    };
  },
  mounted() {},
  computed: {
    activePP() {
      return this.$store.state.activePP;
    },
    project() {
      return this.$store.state.activeProject;
    },
  },
  methods: {
    toggleShowDetails() {
      this.showDetails = !this.showDetails;
    },
  },
};
</script>

<style scoped>
.bb {
  border-bottom: 2px solid black;
}
</style>