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
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-lg-8 col-12">
          <div class="row bg-primary rounded-top text-white">
            <div class="col-12 d-flex justify-content-between">
              <span> Sorting Filter </span>
              <span>
                Showing: {{ activeProject.Start }} - {{ activeProject.End }}
              </span>
            </div>

            <div class="col-12 bg-light rounded-bottom">
              <time-clock-group-component
                v-for="(timeClockGroup, index) in timeClockGroups"
                :key="`timeClockGroup-${index}`"
                :timeClocks="timeClockGroups[index]"
              />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="container">
            <div class="row bg-primary text-white rounded-top">
              <div class="col-12">Total Time</div>
              <div class="col-12 bg-light rounded-bottom">
                <div class="row bg-secondary text-white border-times m-2">
                  <div class="col-12">
                    <span>{{ totalTimes.hour }} Hours</span>
                    <span>{{ totalTimes.minute }} Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container my-2">
            <div class="row bg-primary text-white rounded-top">
              <div class="col-12">Estimated Pay</div>
              <div class="col-12 bg-light rounded-bottom">
                <hourly-component :project="activeProject" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import TimeClockGroupComponent from "../components/TimeClockGroupComponent.vue";
import HourlyComponent from "../components/PayCalcComponents/HourlyComponent.vue";
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
      proj.Start = moment(proj.Start).format("MM/DD/YYYY");
      proj.End = moment(proj.End).subtract(1, "days").format("MM/DD/YYYY");
      return proj;
    },
    timeClockGroups() {
      return this.$store.state.timeClockGroup;
    },
    totalTimes() {
      return this.$store.state.totalProjectTimes;
    },
  },
  components: {
    WeeklyProjectDetails,
    MonthlyProjectDetails,
    MilestoneProjectDetails,
    FirstAndFiveProjectDetails,
    TimeClockGroupComponent,
    HourlyComponent,
  },
};
</script>
<style scoped>
.hide-mobile {
  visibility: visible;
}
@media screen and (max-width: 768px) {
  .hide-mobile {
    visibility: hidden;
    height: 0;
  }
}
.text-center-mobile {
  text-align: left;
}
@media screen and (max-width: 768px) {
  .text-center-mobile {
    text-align: center;
  }
}
</style>