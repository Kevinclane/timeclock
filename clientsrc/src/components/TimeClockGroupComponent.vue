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
      let times = this.timeClocks;
      let i = 0;
      let total = {
        hour: 0,
        minute: 0,
        second: 0,
      };
      while (i < times.length && times[i].EndTime) {
        let start = {
          hour: parseInt(moment(times[i].StartTime).format("HH")),
          minute: parseInt(moment(times[i].StartTime).format("mm")),
          second: parseInt(moment(times[i].StartTime).format("ss")),
        };
        let end = {
          hour: parseInt(moment(times[i].EndTime).format("HH")),
          minute: parseInt(moment(times[i].EndTime).format("mm")),
          second: parseInt(moment(times[i].EndTime).format("ss")),
        };
        let diff = {
          hour: end.hour - start.hour,
          minute: end.minute - start.minute,
          second: end.second - start.second,
        };
        if (diff.second < 0) {
          diff.second += 60;
          diff.minute -= 1;
        }
        if (diff.minute < 0) {
          diff.minute += 60;
          diff.hour -= 1;
        }
        total.hour += diff.hour;
        total.minute += diff.minute;
        total.second += diff.second;
        i++;
      }
      i = 0;
      while (total.second > 59) {
        total.second -= 60;
        i++;
      }
      total.minute += i;
      i = 0;
      while (total.minute > 59) {
        total.minute -= 60;
        i++;
      }
      total.hour += i;
      let res = total.hour;
      res += total.minute / 60;
      res = res.toFixed(2);
      return res;
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