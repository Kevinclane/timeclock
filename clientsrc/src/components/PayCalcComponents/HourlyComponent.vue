<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">{{ totalTimes }} Hours at ${{ project.Rate }}/hr</div>
    <div class="col-12" v-if="OTHours > 0">
      {{ OTHours }} Hours at ${{ OTRate }}/hr
    </div>
    <h3 class="col-12 my-2">${{ estimatedPay }}</h3>
  </div>
</template>

<script>
export default {
  name: "HourlyComponent",
  props: ["project", "times"],
  data() {
    return {
      estimatedPay: 0,
      OTHours: 0,
      OTRate: 0,
    };
  },
  computed: {
    totalTimes() {
      let times = this.times;
      if (times > 40) {
        this.OTHours = parseFloat((times - 40).toFixed(2));
        times = 40;
        this.OTRate = parseFloat((this.project.Rate * 1.5).toFixed(2));
        this.estimatedPay += parseFloat(
          (this.OTHours * this.OTRate).toFixed(2)
        );
        this.estimatedPay += parseFloat((40 * this.project.Rate).toFixed(2));
      } else {
        this.estimatedPay += parseFloat((times * this.project.Rate).toFixed(2));
      }
      return times;
    },
  },
};
</script>