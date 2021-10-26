<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">Total Hours: {{ times }}</div>
    <div class="col-12">
      <i class="fas fa-exclamation-triangle mr-1 coco"
        ><span class="tooltiptext">
          <div>
            Salary is calculated as 261 working days per year. Leap year will
            add an additional day's pay per year.
          </div>
        </span>
      </i>
      ${{ activePP.totalPay }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SalaryComponent",
  computed: {
    activePP() {
      return this.$store.state.activePP;
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