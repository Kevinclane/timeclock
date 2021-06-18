<template>
  <div class="row">
    <div class="col-12">
      <time-clock-group-component
        v-for="(timeClockGroup, index) in week.timeClocks"
        :key="`timeClockGroup-${index}`"
        :timeClocks="week.timeClocks[index]"
      />
    </div>
    <div class="col-12 text-black py-2">
      <div class="row m-2">
        <div class="col-12 border-bottom-black">
          <!-- <div>Week of {{ week.readable }}</div> -->
          <div>Hours this week: {{ week.totalTimes }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeClockGroupComponent from "../components/TimeClockGroupComponent.vue";
export default {
  name: "Weeks",
  props: ["week"],
  components: { TimeClockGroupComponent },
};
</script>