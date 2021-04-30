<template>
  <div v-if="loading">
    <div class="spinner-border text-primary mt-5" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  <div v-else class="container card mt-3 text-light border-primary">
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

    <!--CLOCKOUT MODAL-->
    <div v-if="showClockOutForm" class="backdrop">
      <clock-in-modal
        class="modal-content container"
        @closeModal="toggleClockOutForm"
        @clockOut="clockOut"
        :timeClock="activeTimeClock"
      />
    </div>
    <!--END CLOCKOUT MODAL-->

    <div v-if="editProject" class="container modal-content">
      <edit-project-form-modal @closeModal="toggleProjectEditor" />
    </div>

    <div class="row">
      <div class="col-12 bg-secondary pt5-sm">
        <h1>{{ activeProject.Payee }}</h1>
      </div>
    </div>
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-lg-8 col-12 my-2 order-2 order-lg-1">
          <div class="row bg-primary rounded-top text-white">
            <div
              class="col-12 d-flex justify-content-center"
              v-if="activeProject.PayPeriod != 'Milestone'"
            >
              <select
                @change="setPPSelection"
                v-model="payPeriodSelection"
                class="p-1 my-2"
              >
                <pay-period-component
                  v-for="PayPeriod in activeProject.InvoiceGroups"
                  :key="PayPeriod.id"
                  :payPeriod="PayPeriod"
                />
              </select>
            </div>
            <div class="col-12 d-flex justify-content-center" v-else>
              {{ milestoneStart }}
              -
              {{ milestoneEnd }}
            </div>
            <div
              class="col-12 bg-light rounded-bottom"
              v-if="activeProject.PayPeriod != 'Milestone'"
            >
              <time-clock-group-component
                v-for="(timeClockGroup, index) in payPeriodDisplay"
                :key="`timeClockGroup-${index}`"
                :timeClocks="payPeriodDisplay[index]"
              />
              <add-time-component
                v-if="showAddTimeComp"
                @closeModal="toggleShowAddTimeComp"
              />
              <button
                v-if="!showAddTimeComp"
                class="btn btn-green m-2"
                @click="toggleShowAddTimeComp"
              >
                Add Time
              </button>
            </div>
            <div class="col-12 bg-light rounded-bottom" v-else>
              <time-clock-group-component
                v-for="(timeClockGroup, index) in timeClockGroups"
                :key="`timeClockGroup-${index}`"
                :timeClocks="timeClockGroups[index]"
              />
              <add-time-component
                v-if="showAddTimeComp"
                :project="activeProject"
                @addTimeClock="addTimeClock"
              />
              <button
                v-if="!showAddTimeComp"
                class="btn btn-green m-2"
                @click="toggleShowAddTimeComp"
              >
                Add Time
              </button>
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
                    <h5 class="col-12 my-2">
                      <span>{{ totalTimes }} Hours</span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div class="container my-2">
              <div class="row bg-primary text-white rounded-top">
                <div v-if="activeProject.PayType == 'Hourly'" class="col-6">
                  <input v-model="OTEnabled" type="checkbox" />
                  Overtime
                </div>
                <div v-if="activeProject.PayType == 'Hourly'" class="col-6">
                  Estimated Pay
                </div>
                <div v-else class="col-12">Estimated Pay</div>
                <div class="col-12 bg-light rounded-bottom">
                  <hourly-component
                    v-if="activeProject.PayType == 'Hourly'"
                    :project="activeProject"
                    :times="totalTimes"
                    :OTEnabled="OTEnabled"
                  />
                  <salary-component
                    v-else-if="activeProject.PayType == 'Salary'"
                    :project="activeProject"
                    :times="totalTimes"
                  />
                  <milestone-component
                    v-else-if="activeProject.PayPeriod == 'Milestone'"
                    :project="activeProject"
                    :times="totalTimes"
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
      <button
        v-if="!clockedIn && !clicked"
        @click="clockIn"
        class="btn btn-green m-2"
      >
        Clock-In
      </button>
      <button v-else @click="toggleClockOutForm" class="btn btn-danger m-2">
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
import EditProjectFormModal from "../components/modals/EditProjectFormModal.vue";
import PayPeriodComponent from "../components/PayPeriodComponent.vue";
import ClockInModal from "../components/modals/TimeClockCommentModal.vue";
import AddTimeComponent from "../components/AddTimeComponent.vue";
import swal from "sweetalert";
import moment from "moment";
export default {
  name: "ProjectDetails",
  data() {
    return {
      showSettingsBox: false,
      showClockOutForm: false,
      editProject: false,
      showAddTimeComp: false,
      payPeriodSelection: "",
      // payPeriodDisplay: [],
      loading: true,
      OTEnabled: true,
      clicked: false,
    };
  },
  async mounted() {
    await this.$store.dispatch(
      "getActiveProject",
      this.$route.params.projectId
    );
    if (this.activeProject != {}) {
      this.setPPSelection();
    }
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.dispatch("clearActiveProject");
  },
  methods: {
    async clockIn() {
      this.clicked = true;
      setTimeout((this.clicked = false), 1000);
      let timeObj = {
        ProjectId: this.$route.params.projectId,
        StartTime: moment(),
      };
      await this.$store.dispatch("clockIn", timeObj);
    },
    clockOut() {
      this.toggleClockOutForm();
    },
    toggleSettingsBox() {
      this.showSettingsBox = !this.showSettingsBox;
    },
    toggleProjectEditor() {
      this.editProject = !this.editProject;
    },
    toggleShowAddTimeComp() {
      this.showAddTimeComp = !this.showAddTimeComp;
    },
    toggleClockOutForm() {
      this.showClockOutForm = !this.showClockOutForm;
    },
    deleteProject() {
      swal({
        title: "Are you sure?",
        text: "Once deleted, this data will be gone forever.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("This project has been deleted!", {
            icon: "success",
          });
          this.$store.dispatch("deleteProject", this.$route.params.projectId);
        }
      });
    },
    updatePPSelection() {
      this.$store.dispatch("updatePPSelection");
    },
    async setPPSelection() {
      if (this.payPeriodSelection == "") {
        this.payPeriodSelection = this.$store.state.payPeriodSelection;
      } else {
        this.$store.dispatch("changePPSelection", this.payPeriodSelection);
      }
    },
  },
  computed: {
    activeProject() {
      let proj = { ...this.$store.state.activeProject };
      if (proj.Start) {
        proj.Start = moment(proj.Start).format("MM/DD/YYYY");
        proj.End = moment(proj.End).format("MM/DD/YYYY");
      }
      return proj;
    },
    activeTimeClock() {
      let currentClock = this.activeProject.TimeClocks.find(
        (t) => t.Current == true
      );
      return currentClock;
    },
    timeClockGroups() {
      return this.$store.state.timeClockGroups;
    },
    totalTimes() {
      return this.$store.state.totalPPTimes;
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
    milestoneStart() {
      if (this.activeProject.TimeClocks.length > 0) {
        return moment(this.activeProject.TimeClocks[0].StartTime).format(
          "MM/DD/YYYY"
        );
      } else {
        return moment().format("MM/DD/YYYY");
      }
    },
    milestoneEnd() {
      if (this.activeProject.TimeClocks.length > 0) {
        return moment(
          this.activeProject.TimeClocks[
            this.activeProject.TimeClocks.length - 1
          ].StartTime
        ).format("MM/DD/YYYY");
      } else {
        return moment().format("MM/DD/YYYY");
      }
    },
    // payPeriodSelection() {
    //   return this.$store.state.payPeriodSelection;
    // },
    payPeriodDisplay() {
      return this.$store.state.payPeriodDisplay;
    },
  },
  components: {
    TimeClockGroupComponent,
    HourlyComponent,
    EditProjectFormModal,
    SalaryComponent,
    MilestoneComponent,
    AddTimeComponent,
    PayPeriodComponent,
    ClockInModal,
  },
};
</script>


<style scoped>
.pt5-sm {
  padding-top: inherit;
}
@media screen and (max-width: 768px) {
  .pt5-sm {
    padding-top: 2.5rem;
  }
}
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
.backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>