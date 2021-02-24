<template>
  <div class="row">
    <div class="col-6">
      {{ Start }} - <span v-if="TimeClock.EndTime">{{ End }}</span>
    </div>
    <div class="col-6">
      <div class="row">
        <div class="col-4">
          <span v-show="Total.hour">{{ Total.hour }}h</span>
        </div>
        <div class="col-4">
          <span v-show="Total.minute">{{ Total.minute }}m</span>
        </div>
        <div class="col-4">
          <span v-show="Total.second">{{ Total.second }}s</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "TimeClockComponent",
  props: ["TimeClock"],
  computed: {
    Start() {
      return moment(this.TimeClock.StartTime).format("h:mm A");
    },
    End() {
      return moment(this.TimeClock.EndTime).format("h:mm A");
    },
    Total() {
      if (this.TimeClock.EndTime) {
        let start = {
          hour: parseInt(moment(this.TimeClock.StartTime).format("hh")),
          minute: parseInt(moment(this.TimeClock.StartTime).format("mm")),
          second: parseInt(moment(this.TimeClock.StartTime).format("ss")),
        };
        let end = {
          hour: parseInt(moment(this.TimeClock.EndTime).format("hh")),
          minute: parseInt(moment(this.TimeClock.EndTime).format("mm")),
          second: parseInt(moment(this.TimeClock.EndTime).format("ss")),
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
        return diff;
      } else return {};
    },
  },
};
</script>