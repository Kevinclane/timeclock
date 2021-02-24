<template>
  <div class="row border-times bg-darker m-2">
    <div class="col-3 d-flex justify-content-center align-items-center">
      {{ day }}
    </div>
    <div class="col-9">
      <time-clock-component
        v-for="(timeClock, index) in TimeClocks"
        :key="`timeClock-${index}`"
        :TimeClock="TimeClocks[index]"
      />
    </div>
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