<template>
  <div class="row">
    <div class="col-12">
      <day-component
        v-for="(day, index) in week.days"
        :key="`day-${index}`"
        :day="week.days[index]"
      />
    </div>
    <div v-if="week.totalTime > 0" class="col-12 text-black py-2">
      <div class="row m-2">
        <div class="col-12 border-bottom-black">
          <div>Hours this week: {{ week.totalTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DayComponent from "./DayComponent.vue";
export default {
  name: "Weeks",
  props: ["week"],
  components: { DayComponent },
};
</script>

