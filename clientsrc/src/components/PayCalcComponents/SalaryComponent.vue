<template>
  <div class="row bg-secondary text-white border-times m-2">
    <div class="col-12">Total Hours: {{ times }}</div>
    <div class="col-12">
      <i class="fas fa-exclamation-triangle mr-1 coco"
        ><span class="tooltiptext">
          <div>Day salary requires 8hrs/day</div>
          <div>Week salary requires 40hrs/week</div>
          <div>Month salary requires 120hrs/month</div>
        </span></i
      >
      ${{ estimatedPay }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SalaryComponent",
  props: ["project", "times", "weeks"],
  computed: {
    estimatedPay() {
      let pay = 0;
      let i = 0;
      if (this.project.SalaryFrequency == "Daily") {
        let i = 0;
        while (i < this.weeks.length) {
          let weekPay = 0;
          let x = 0;
          let currentWeek = this.weeks[i];
          while (x < currentWeek.timeClocks.length) {
            let y = 0;
            let dayHours = 0;
            let currentDay = currentWeek.timeClocks[x];
            while (y < currentDay.length) {
              let timeDiff = moment.duration(
                moment(currentDay[y].EndTime).diff(
                  moment(currentDay[y].StartTime)
                )
              );
              dayHours += timeDiff.asHours();
              y++;
            }
            if (dayHours >= 8) {
              weekPay += this.project.Rate;
            }
            x++;
          }
          i++;
          pay += weekPay;
        }
      } else if (this.project.SalaryFrequency == "Weekly") {
        while (i < this.weeks.length) {
          if (this.weeks[i].totalTimes >= 40) {
            pay += this.project.Rate;
          }
          i++;
        }
      } else if (this.project.SalaryFrequency == "Monthly") {
        if (this.times >= 120) {
          pay = this.project.Rate;
        }
      }
      return pay;
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