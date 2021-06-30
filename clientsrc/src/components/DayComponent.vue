<template>
  <div class="row border-times bg-secondary text-white m-2">
    <div class="col-12 center-center bg-midnight">
      {{ day }}
    </div>
    <div class="col-lg-10 col-12">
      <time-clock-component
        v-for="(timeClock, index) in timeClocks"
        :key="`timeClock-${index}`"
        :timeClock="timeClocks[index]"
      />
    </div>
    <div
      class="
        col-lg-2 col-12
        d-flex
        justify-content-center
        flex-column
        border-left-green
      "
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
  methods: {
    roundTime(time, roundTo) {
      // debugger;
      time = time.toString();
      let hours;
      let minutes;
      if (time.includes(".")) {
        let split = time.split(".");
        hours = parseInt(split[0]);
        if (split[1].length == 1) {
          split[1] = parseInt(split[1] + "0");
        }
        minutes = parseInt(split[1]);
      } else {
        hours = parseInt(time);
        minutes = 0;
      }
      minutes = minutes * 0.6;
      let i = 0;
      while (minutes > roundTo) {
        i++;
        minutes = minutes - roundTo;
      }
      if (minutes < roundTo / 2) {
        minutes = i * roundTo;
      } else {
        minutes = (i + 1) * roundTo;
      }
      if (minutes >= 60) {
        minutes = 0;
        hours += 1;
      }
      // debugger
      hours = hours.toString();
      minutes = (minutes / 60).toString();
      if (minutes.includes(".")) {
        minutes = parseFloat(minutes).toFixed(2).toString();
        let minSplit = minutes.split(".");
        minutes = minSplit[1];
      }
      if (minutes.length == 1) {
        minutes = minutes + "0";
      }
      time = parseFloat(hours + "." + minutes);
      return time;
    },
  },
  computed: {
    day() {
      return moment(this.timeClocks[0].StartTime).format("MM/DD/YYYY");
    },
    dayTotalHours() {
      let ps = this.$store.state.activeProject.ProjectSettings;
      let times = this.timeClocks;
      let i = 0;
      let total = 0;
      while (i < times.length && times[i].EndTime) {
        // let timeDiff = moment.duration(
        //   moment(times[i].EndTime).diff(moment(times[i].StartTime))
        // );
        let timeDiff = times[i].TCTotalHours;
        if (ps.RoundTime && ps.RoundFrequency == "TC") {
          // timeDiff = parseFloat(timeDiff.asHours().toFixed(2));
          timeDiff = this.roundTime(timeDiff, ps.RoundTo);
          total += timeDiff;
        } else {
          // total += parseFloat(timeDiff.asHours());
          total += timeDiff;
        }
        // total += parseFloat(timeDiff.asHours());
        i++;
      }
      if (ps.RoundTime && ps.RoundFrequency == "Day") {
        // debugger;
        total = parseFloat(total.toFixed(2));
        total = this.roundTime(total, ps.RoundTo);
        return total;
      } else {
        return total.toFixed(2);
      }
    },
  },
  components: {
    TimeClockComponent,
  },
};
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .border-left-green {
    border-left: hidden;
    border-top: black solid 1px;
  }
}
</style>