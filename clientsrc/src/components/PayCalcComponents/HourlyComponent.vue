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
      let times = this.$store.state.totalProjectTimes;
      if (times) {
        let total = times.hour;
        total += times.minute / 60;
        total = total.toFixed(2);
        if (total > 40) {
          this.estimatedPay = (40 * this.project.Rate).toFixed(2);
          this.estimatedPay += (
            (total - 40) *
            (this.project.Rate * 1.5)
          ).toFixed(2);
        } else {
          this.estimatedPay = (total * this.project.Rate).toFixed(2);
        }
        return total;
      } else return 0;
    },
  },
};
</script>