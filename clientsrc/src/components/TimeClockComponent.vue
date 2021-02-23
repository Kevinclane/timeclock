<template>
  <div class="col-12">
    {{ Start }} - <span v-if="TimeClock.EndTime">{{ End }}</span>
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
  },
};
</script>