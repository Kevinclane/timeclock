<template>
  <div
    v-if="day.tcs.length > 0"
    class="row border-times bg-secondary text-white m-2"
  >
    <div class="col-12 center-center bg-midnight">
      {{ day.readableDate }}
    </div>
    <div class="col-lg-10 col-12">
      <time-clock-component
        v-for="(timeClock, index) in day.tcs"
        :key="`timeClock-${index}`"
        :timeClock="day.tcs[index]"
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
      <div>{{ day.totalTime }} Hours</div>
    </div>
  </div>
</template>

<script>
import TimeClockComponent from "./TimeClockComponent.vue";
export default {
  name: "DayComponent",
  props: ["day"],
  methods: {},
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