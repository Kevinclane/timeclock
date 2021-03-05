<template>
  <div class="container card mt-3 text-light border-primary">
    <i
      class="fas fa-cog settings-icon"
      type="button"
      @click="toggleSettingsBox"
    ></i>
    <div
      v-if="showSettingsBox"
      class="settings-box p-3 text-dark d-flex flex-column"
    >
      <button class="btn btn-green my-1" @click="toggleProjectEditor">
        Edit Project
      </button>
      <button class="btn btn-danger my-1" @click="deleteProject">
        Delete Project
      </button>
    </div>

    <div v-if="editProject" class="container modal-content">
      <edit-project-component @closeModal="toggleProjectEditor" />
    </div>

    <div class="row">
      <div class="col-12 bg-secondary">
        <h1 class="">{{ activeProject.Title }}</h1>
      </div>
      <div class="col-12">
        <h2>{{ activeProject.Payee }}</h2>
      </div>
    </div>
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-lg-8 col-12 my-2 order-2 order-lg-1">
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
        <div class="col-lg-3 mx-2 col-12 order-1 order-lg-2">
          <div class="row">
            <div class="container my-2">
              <div class="row bg-primary text-white rounded-top">
                <div class="col-12">Total Time</div>
                <div class="col-12 bg-light rounded-bottom">
                  <div class="row bg-secondary text-white border-times m-2">
                    <div class="col-12">
                      <span>{{ totalTimes }} Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container my-2">
              <div class="row bg-primary text-white rounded-top">
                <div class="col-12">Estimated Pay</div>
                <div class="col-12 bg-light rounded-bottom">
                  <hourly-component
                    v-if="activeProject.PayType == 'Hourly'"
                    :project="activeProject"
                  />
                  <salary-component
                    v-else-if="activeProject.PayType == 'Salary'"
                    :project="activeProject"
                  />
                  <milestone-component
                    v-else-if="activeProject.PayPeriod == 'Milestone'"
                    :project="activeProject"
                  />
                </div>
              </div>
            </div>
            <div class="container my-2">
              <div class="row bg-primary text-white rounded-top">
                <div class="col-12">Invoice Status:</div>
                <div class="col-12 bg-light rounded-bottom">
                  <div class="row d-flex justify-content-center">
                    <button class="btn btn-green m-2">Generate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 d-flex flex-end">
      <button v-if="!clockedIn" @click="clockIn" class="btn btn-success m-2">
        Clock-In
      </button>
      <button v-else @click="clockOut" class="btn btn-danger m-2">
        Clock-Out
      </button>
    </div>
  </div>
</template>

<script>
import TimeClockGroupComponent from "../components/TimeClockGroupComponent.vue";
import HourlyComponent from "../components/PayCalcComponents/HourlyComponent.vue";
import SalaryComponent from "../components/PayCalcComponents/SalaryComponent.vue";
import MilestoneComponent from "../components/PayCalcComponents/MilestoneComponent.vue";
import EditProjectComponent from "../components/EditProjectFormComponent.vue";
import moment from "moment";
export default {
  name: "ProjectDetails",
  data() {
    return {
      showSettingsBox: false,
      editProject: false,
    };
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
        StartTime: Date(),
      };
      this.$store.dispatch("clockIn", timeObj);
    },
    clockOut() {
      let currentClock = this.activeProject.TimeClocks.find(
        (t) => t.Current == true
      );
      currentClock.EndTime = Date();
      this.$store.dispatch("clockOut", currentClock);
    },
    toggleSettingsBox() {
      this.showSettingsBox = !this.showSettingsBox;
    },
    toggleProjectEditor() {
      this.editProject = !this.editProject;
    },
    deleteProject() {
      this.$store.dispatch("deleteProject", this.$route.params.projectId);
    },
  },
  computed: {
    activeProject() {
      let proj = { ...this.$store.state.activeProject };
      if (proj.Start) {
        proj.Start = moment(proj.Start).format("MM/DD/YYYY");
        proj.End = moment(proj.End).subtract(1, "days").format("MM/DD/YYYY");
      }
      return proj;
    },
    timeClockGroups() {
      return this.$store.state.timeClockGroup;
    },
    totalTimes() {
      return this.$store.state.totalProjectTimes;
    },
    clockedIn() {
      if (this.activeProject.TimeClocks) {
        let currentClock = this.activeProject.TimeClocks.find(
          (t) => t.Current == true
        );
        if (currentClock) {
          return true;
        } else return false;
      } else return null;
    },
  },
  components: {
    TimeClockGroupComponent,
    HourlyComponent,
    EditProjectComponent,
    SalaryComponent,
    MilestoneComponent,
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
  .text-center-mobile {
    text-align: center;
  }
}
.text-center-mobile {
  text-align: left;
}
.btn-green {
  background-color: green;
  /* border: green solid 2px; */
}
.settings-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 102;
  font-size: 1.5rem;
}
.settings-box {
  position: absolute;
  background-color: #adb5bd;
  top: 40px;
  right: 10px;
  z-index: 100;
  width: fit-content;
  border: black solid 2px;
  border-radius: 5px;
}
.edit-option {
  background-color: #444;
  border: green solid 1px;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 2px;
}
li {
  list-style-type: none;
}
.modal-content {
  position: fixed;
  padding: 2rem;
  top: 20vh;
  left: 10vw;
  right: 10vw;
  z-index: 100;
  border-radius: 20px;
  background-color: rgba(171, 180, 187, 0.95);
  max-height: 80vh;
  max-width: 80vw;
}
@media screen and (min-width: 992px) {
  .modal-content {
    max-width: 40vw;
  }
}
</style>