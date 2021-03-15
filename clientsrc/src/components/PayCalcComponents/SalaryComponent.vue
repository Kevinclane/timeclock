<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">Total Hours: {{ totalTimes }}</div>
    <div class="col-12">
      <i class="fas fa-exclamation-triangle mr-1 coco"
        ><span class="tooltiptext"
          >Salary pay is based on every 8 hours worked</span
        ></i
      >
      ${{ estimatedPay }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SalaryComponent",
  props: ["project", "times"],
  data() {
    return {
      estimatedPay: 0,
    };
  },
  computed: {
    totalTimes() {
      let times = this.times;
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

<style scoped>
.coco {
  color: chocolate;
  margin-top: 0.25rem;
  position: relative;
}
.coco .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: rgb(214, 219, 207);
  color: black;
  text-align: center;
  border-radius: 6px;
  border: 2px solid black;
  padding: 5px 5px;
  position: absolute;
  z-index: 1000;
}
.coco:hover .tooltiptext {
  visibility: visible;
}
</style>