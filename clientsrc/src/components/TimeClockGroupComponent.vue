<template>
  <div class="row">
    {{ day }}
    <time-clock-component
      v-for="(timeClock, index) in TimeClocks"
      :key="`timeClock-${index}`"
      :TimeClock="TimeClocks[index]"
    />
  </div>
</template>

<script>
import TimeClockComponent from "./TimeClockComponent.vue";
import moment from "moment";
export default {
  name: "TimeClockGroupComponent",
  props: ["TimeClocks"],
  methods: {},
  computed: {
    day() {
      return moment(this.TimeClocks[0].StartTime).format("MM/DD/YYYY");
    },
  },
  components: {
    TimeClockComponent,
  },
};
</script>