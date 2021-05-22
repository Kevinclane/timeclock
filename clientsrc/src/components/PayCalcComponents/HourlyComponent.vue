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
        v-for="(week, index) in weeks"
        :key="`week-${index}`"
        class="row text-center"
      >
        <div v-if="!week.OTHours" class="col-8">
          {{ week.totalTimes }} x ${{ project.Rate }}/hr
        </div>
        <div v-if="!week.OTHours" class="col-4 border-left-green">
          ${{ week.pay }}
        </div>

        <div v-if="week.OTHours" class="col-8">
          {{ week.regHours }} x ${{ project.Rate }}/hr
        </div>
        <div v-if="week.OTHours" class="col-4 border-left-green">
          ${{ week.regPay }}
        </div>
        <div v-if="week.OTHours" class="col-8">
          {{ week.OTHours }} x ${{ week.OTRate }}/hr
        </div>
        <div v-if="week.OTHours" class="col-4 border-left-green">
          ${{ week.OTPay }}
        </div>
      </div>
    </div>
    <h4 class="col-12 py-2">${{ totalPay }}</h4>
  </div>
</template>

<script>
export default {
  name: "HourlyComponent",
  props: ["project", "weeks", "OTEnabled"],
  data() {
    return {
      estimatedPay: 0,
      OTHours: 0,
      OTRate: 0,
      showDetails: false,
    };
  },
  mounted() {},
  computed: {
    totalPay() {
      let i = 0;
      let total = 0;
      while (i < this.weeks.length) {
        total += this.weeks[i].pay;
        i++;
      }
      return total;
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