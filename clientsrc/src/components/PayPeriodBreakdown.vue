<template>
  <div class="col-12 bg-light text-right">
    <week-component
      v-for="(week, index) in activePP.weeks"
      :key="`week-${index}`"
      :week="activePP.weeks[index]"
    />
  </div>
</template> 

<script>
import WeekComponent from "./WeekComponent.vue";

export default {
  name: "PayPeriodBreakdown",
  data() {
    return {};
  },
  computed: {
    activePP() {
      return this.$store.state.activePP;
    },
  },
  components: {
    WeekComponent,
  },
};
</script>