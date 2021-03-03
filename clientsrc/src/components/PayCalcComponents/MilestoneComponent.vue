<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">Total Hours: {{ totalTimes }}</div>
    <div class="col-12">${{ project.Rate }}</div>
  </div>
</template>

<script>
export default {
  name: "MilestoneComponent",
  props: ["project"],
  computed: {
    totalTimes() {
      let times = this.$store.state.totalProjectTimes;
      if (times) {
        let total = times.hour;
        total += times.minute / 60;
        total = total.toFixed(2);
        this.estimatedPay = Math.floor(total / 8);
        return total;
      } else return 0;
    },
  },
};
</script>