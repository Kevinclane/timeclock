<template>
  <div class="container card mt-3 text-light border-primary">
    <weekly-project-details
      v-if="
        activeProject.PayPeriod == 'Weekly' ||
        activeProject.PayPeriod == 'Bi-Weekly'
      "
      :project="activeProject"
    />
    <monthly-project-details
      v-else-if="activeProject.PayPeriod == 'Monthly'"
      :project="activeProject"
    />
    <milestone-project-details
      v-else-if="activeProject.PayPeriod == 'Milestone'"
    />
    <first-and-five-project-details
      v-else-if="activeProject.PayPeriod == 'FirstAndFive'"
    />
    <!-- <time-clock-component
      v-for="timeClock in activeProject.TimeClocks"
      :key="timeClock.id"
      :TimeClock="timeClock"
    /> -->
    <div>TIME CLOCK GROUPS</div>
    <time-clock-group-component
      v-for="(timeClockGroup, index) in timeClockGroups"
      :key="`timeClockGroup-${index}`"
      :TimeClocks="timeClockGroups[index]"
    />
    <div class="col-12 d-flex flex-end">
      <button @click="clockIn" class="btn btn-success m-2">Clock-In</button>
      <button @click="clockOut" class="btn btn-danger m-2">Clock-Out</button>
    </div>
  </div>
</template>

<script>
import WeeklyProjectDetails from "../components/DetailViewComponents/WeeklyProjectDetails.vue";
import MonthlyProjectDetails from "../components/DetailViewComponents/MonthlyProjectDetails.vue";
import MilestoneProjectDetails from "../components/DetailViewComponents/MilestoneProjectDetails.vue";
import FirstAndFiveProjectDetails from "../components/DetailViewComponents/FirstAndFiveProjectDetails.vue";
import TimeClockComponent from "../components/TimeClockComponent.vue";
import TimeClockGroupComponent from "../components/TimeClockGroupComponent.vue";
import moment from "moment";
export default {
  name: "ProjectDetails",
  data() {
    return {};
  },
  async mounted() {
    await this.$store.dispatch(
      "getActiveProject",
      this.$route.params.projectId
    );
  },
  beforeDestroy() {
    this.$store.dispatch("clearActiveProject");
  },
  methods: {
    clockIn() {
      let timeObj = {
        ProjectId: this.$route.params.projectId,
        StartTime: moment(new Date()),
      };
      this.$store.dispatch("clockIn", timeObj);
    },
    clockOut() {
      let currentClock = this.activeProject.TimeClocks.find(
        (t) => t.Current == true
      );
      currentClock.EndTime = moment(new Date());
      this.$store.dispatch("clockOut", currentClock);
    },
  },
  computed: {
    activeProject() {
      let proj = this.$store.state.activeProject;
      proj.Start = moment(proj.Start).format("dddd, MMMM Do YYYY");
      proj.End = moment(proj.End)
        .subtract(1, "days")
        .format("dddd, MMMM Do YYYY");
      return proj;
    },
    timeClockGroups() {
      let timeClocks = [...this.$store.state.activeProject.TimeClocks];
      let finishedArr = [];
      while (timeClocks.length > 0) {
        let tempArr = [];
        let i = 0;
        tempArr.push(timeClocks[0]);
        timeClocks.splice(0, 1);
        while (i < timeClocks.length) {
          if (
            moment(tempArr[0].StartTime).isSame(timeClocks[i].StartTime, "day")
          ) {
            tempArr.push(timeClocks[i]);
            timeClocks.splice(i, 1);
          } else i++;
        }
        finishedArr.push(tempArr);
      }
      return finishedArr;
    },
  },
  components: {
    WeeklyProjectDetails,
    MonthlyProjectDetails,
    MilestoneProjectDetails,
    FirstAndFiveProjectDetails,
    TimeClockComponent,
    TimeClockGroupComponent,
  },
};
</script>
<style scoped>
</style>