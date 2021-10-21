<template>
  <div class="col-12 bg-light text-right">
    <week-component
      v-for="(week, index) in activePP.weeks"
      :key="`week-${index}`"
      :week="activePP.weeks[index]"
    />
    <add-time-component
      v-if="showAddTimeComp"
      @closeModal="toggleShowAddTimeComp"
      :project="activeProject"
    />
  </div>
</template> 

<script>
import WeekComponent from "./WeekComponent.vue";
import AddTimeComponent from "../components/AddTimeComponent.vue";
export default {
  name: "PayPeriodDisplay",
  data() {
    return {
      showAddTimecomp = false
    };
  },
  computed: {
    activePP() {
      return this.$store.state.activePP;
    },
  },
  components: {
    WeekComponent,
    AddTimeComponent,
  },
};
</script>