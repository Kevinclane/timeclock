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

    <!--CLOCKIN MODAL-->
    <div v-if="showClockInForm" class="backdrop">
      <clock-in-modal
        class="modal-content container"
        @closeModal="toggleClockInForm"
        @clockIn="clockIn"
        :services="services"
      />
    </div>
    <!--END CLOCKIN MODAL-->

    <div v-if="editProject" class="container modal-content">
      <edit-project-component @closeModal="toggleProjectEditor" />
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
                @change="updatePPSelection"
                v-model="payPeriodSelection"
                class="p-1 my-2"
              >
                <!-- {{
                  payPeriodSorting
                }} -->
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
              <add-time-modal
                v-if="addTimeModal"
                :project="activeProject"
                @closeModal="toggleAddTimeModal"
                @updateView="updatePPSelection"
              />
              <button
                v-if="!addTimeModal"
                class="btn btn-green m-2"
                @click="toggleAddTimeModal"
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
              <add-time-modal
                v-if="addTimeModal"
                :project="activeProject"
                @closeModal="toggleAddTimeModal"
              />
              <button
                v-if="!addTimeModal"
                class="btn btn-green m-2"
                @click="toggleAddTimeModal"
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
        v-if="!clockedIn"
        @click="toggleClockInForm"
        class="btn btn-green m-2"
      >
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
import PayPeriodComponent from "../components/PayPeriodComponent.vue";
import AddTimeModal from "../components/AddTimeModal.vue";
import ClockInModal from "../components/ClockInModal.vue";
import swal from "sweetalert";
import moment from "moment";
export default {
  name: "ProjectDetails",
  data() {
    return {
      showSettingsBox: false,
      showClockInForm: false,
      editProject: false,
      addTimeModal: false,
      payPeriodSelection: "",
      payPeriodDisplay: [],
      loading: true,
      OTEnabled: true,
    };
  },
  async mounted() {
    await this.$store.dispatch(
      "getActiveProject",
      this.$route.params.projectId
    );
    if (this.activeProject.InvoiceGroups) {
      this.updatePPSelection();
    }
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.dispatch("clearActiveProject");
  },
  methods: {
    async clockIn() {
      this.showClockInForm = false;
      this.updatePPSelection();
    },
    clockOut() {
      let currentClock = this.activeProject.TimeClocks.find(
        (t) => t.Current == true
      );
      currentClock.EndTime = moment();
      this.$store.dispatch("clockOut", currentClock);
    },
    toggleSettingsBox() {
      this.showSettingsBox = !this.showSettingsBox;
    },
    toggleProjectEditor() {
      this.editProject = !this.editProject;
    },
    toggleAddTimeModal() {
      this.addTimeModal = !this.addTimeModal;
    },
    toggleClockInForm() {
      this.showClockInForm = !this.showClockInForm;
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
            icon: "green",
          });
          this.$store.dispatch("deleteProject", this.$route.params.projectId);
          this.$emit("closeModal");
        }
      });
    },
    updatePPSelection() {
      if (this.payPeriodSelection == "") {
        let inital = this.activeProject.InvoiceGroups.find((x) => x.Current);
        let start = moment(inital.StartDay).format("MM/DD/YYYY");
        let end = moment(inital.EndDay).format("MM/DD/YYYY");
        this.payPeriodSelection = `${start} - ${end}`;
      }
      let split = this.payPeriodSelection.split("-");
      let start = moment(split[0]);
      let end = moment(split[1]);
      let i = 0;
      //loops over every payPeriod object in InvoiceGroups
      while (i < this.activeProject.InvoiceGroups.length) {
        //current payPeriod object being checked
        let IG = this.activeProject.InvoiceGroups[i];
        let boolS = moment(IG.StartDay).isSameOrAfter(start);
        let boolE = moment(IG.EndDay).isSameOrBefore(end);
        if (boolS && boolE) {
          //should set correct timeClockGroups within query dates
          this.payPeriodDisplay = this.timeClockGroups.filter(
            (tcg) =>
              moment(tcg[0].StartTime).isSameOrAfter(moment(IG.StartDay)) &&
              moment(tcg[0].EndTime).isBefore(moment(IG.EndDay).add(1, "day"))
          );
          i = this.activeProject.InvoiceGroups.length;
        } else i++;
      }
      // this.payPeriodDisplay = this.timeClockGroups.filter(
      //   (tcg) =>
      //     moment(tcg[0].StartTime).isSameOrAfter(start) &&
      //     moment(tcg[0].EndTime).isSameOrBefore(end)
      // );
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
    timeClockGroups() {
      return this.$store.state.timeClockGroup;
    },
    totalTimes() {
      let groups = [...this.payPeriodDisplay];
      let times = [];
      groups.forEach((group) => {
        let i = 0;
        while (i < group.length) {
          times.push(group[i]);
          i++;
        }
      });
      let i = 0;
      let total = 0;
      while (i < times.length && times[i].EndTime) {
        let timeDiff = moment.duration(
          moment(times[i].EndTime).diff(moment(times[i].StartTime))
        );
        total += parseFloat(timeDiff.asHours());
        i++;
      }
      return total.toFixed(2);
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
    // payPeriodSorting() {
    //   let res = ``;
    //   let proj = { ...this.activeProject };
    //   if (proj.InvoiceGroups) {
    //     let i = 0;
    //     while (i < proj.InvoiceGroups.length) {
    //       let start = moment(proj.InvoiceGroups[i].StartDay).format(
    //         "MM/DD/YYYY"
    //       );
    //       let end = moment(proj.InvoiceGroups[i].EndDay).format("MM/DD/YYYY");
    //       if (proj.InvoiceGroups[i].Current) {
    //         res += `<option selected>${start} - ${end}</option>`;
    //       } else res += `<option>${start} - ${end}</option>`;
    //       i++;
    //     }
    //   }
    //   return res;
    // },
    services() {
      let timeClocks = [...this.activeProject.TimeClocks];
      if (timeClocks.length > 0) {
        let services = [];
        services.push(timeClocks[0].Service);
        timeClocks.splice(0, 1);
        let i = 0;
        while (i < timeClocks.length) {
          let douplicateCheck = services.find(
            (tc) => tc.Service == timeClocks[i].Service
          );
          if (!douplicateCheck) {
            services.push(timeClocks[i].Service);
          }
          i++;
        }
        return services;
      } else return [];
    },
  },
  components: {
    TimeClockGroupComponent,
    HourlyComponent,
    EditProjectComponent,
    SalaryComponent,
    MilestoneComponent,
    AddTimeModal,
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