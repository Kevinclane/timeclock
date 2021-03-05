<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">{{ totalTimes }} Hours at {{ project.Rate }}/hr</div>
    <div class="col-12">${{ estimatedPay }}</div>
  </div>
</template>

<script>
export default {
  name: "HourlyComponent",
  props: ["project"],
  data() {
    return {
      estimatedPay: 0,
    };
  },
  computed: {
    totalTimes() {
      debugger;
      let times = this.$store.state.totalProjectTimes;
      this.estimatedPay = (times * this.project.Rate).toFixed(2);
      return times;
    },
  },
};
</script>