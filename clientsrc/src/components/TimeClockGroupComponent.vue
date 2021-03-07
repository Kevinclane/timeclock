<template>
  <div class="row border-times bg-secondary text-white m-2">
    <div
      class="col-12 d-flex justify-content-center align-items-center bg-cstm-blue"
    >
      {{ day }}
    </div>
    <div class="col-lg-8 col-12">
      <time-clock-component
        v-for="(timeClock, index) in timeClocks"
        :key="`timeClock-${index}`"
        :timeClock="timeClocks[index]"
      />
    </div>
    <div
      class="col-lg-4 col-12 d-flex justify-content-center flex-column border-left-green"
    >
      <div>{{ dayTotalHours }} Hours</div>
    </div>
  </div>
</template>

<script>
import TimeClockComponent from "./TimeClockComponent.vue";
import moment from "moment";
export default {
  name: "TimeClockGroupComponent",
  props: ["timeClocks"],
  methods: {},
  computed: {
    day() {
      return moment(this.timeClocks[0].StartTime).format("MM/DD/YYYY");
    },
    dayTotalHours() {
      // debugger;
      let times = this.timeClocks;
      let i = 0;
      let total = 0;
      while (i < times.length && times[i].EndTime) {
        let timeDiff = moment.duration(
          moment(times[i].EndTime).diff(moment(times[i].StartTime))
        );
        total += parseFloat(timeDiff.asHours());
        i++;
      }
      return total.toFixed(2);
    },
  },
  components: {
    TimeClockComponent,
  },
};
</script>

<style scoped>
.border-left-green {
  border-left: green solid 1px;
}
.bg-cstm-blue {
  background-color: midnightblue;
}
@media screen and (max-width: 768px) {
  .border-left-green {
    border-left: hidden;
    border-top: black solid 1px;
  }
}
</style>