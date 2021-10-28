<template>
  <div v-if="loading">
    <div class="spinner-border text-primary mt-5" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  <div v-else class="container-fluid bg-darker text-light">
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

    <!--DOC PREVIEW MODAL-->
    <div v-if="showDocPreview" class="backdrop">
      <doc-preview-modal
        class="xxl-modal"
        :project="activeProject"
        @closeModal="toggleDocPreview"
      />
    </div>
    <!--END DOC PREVIEW MODAL-->

    <!-- PROJECT SETUP MODAL -->
    <div v-if="!activeProject.ProjectSettings.Completed" class="backdrop">
      <project-setup-modal class="modal-content" />
    </div>

    <!-- END PROJECT SETUP MODAL -->

    <div v-if="editProject" class="backdrop">
      <div class="container modal-content">
        <edit-project-form-modal @closeModal="toggleProjectEditor" />
      </div>
    </div>

    <div class="row bg-secondary py-2">
      <!--REGION COG DROPDOWN BUTTON-->
      <div class="col-12">
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
        <div class="dynamic-header">{{ activeProject.Payee }}</div>
      </div>
      <!--END REGION COG DROPDOWN-->
    </div>
    <div class="container-fluid mt-5">
      <div class="row d-flex justify-content-around">
        <!-- TIME CLOCK DISPLAY BOX -->
        <div class="col-lg-7 col-12 my-2 order-2 order-lg-1">
          <div class="row bg-primary rounded-top text-white box-shadow-245">
            <div
              class="col-12 d-flex justify-content-center"
              v-if="activeProject.PayPeriod != 'Milestone'"
            >
              <select
                @change="getActivePayPeriod"
                v-model="activePP.id"
                class="p-1 my-2"
              >
                <pay-period-component
                  v-for="PP in payPeriodDisplay"
                  :key="PP.id"
                  :payPeriod="PP"
                />
              </select>
            </div>
            <div class="col-12 d-flex justify-content-center" v-else>
              {{ milestoneStart }}
              -
              {{ milestoneEnd }}
            </div>

            <pay-period-breakdown />
            <div class="col-12 bg-light text-right">
              <add-time-component
                v-if="showAddTimeComp"
                @closeModal="toggleShowAddTimeComp"
                :project="activeProject"
              />
            </div>

            <div
              class="
                col-12
                bg-light
                rounded-bottom
                d-flex
                justify-content-between
              "
            >
              <button
                v-if="!showAddTimeComp"
                class="btn btn-green m-2"
                @click="toggleShowAddTimeComp"
              >
                Add Time
              </button>
              <button
                v-if="!activeTimeClock && !clicked"
                @click="clockIn"
                class="btn btn-green m-2"
              >
                Clock-In
              </button>
              <button
                v-else
                @click="toggleClockOutForm"
                class="btn btn-danger m-2"
              >
                Clock-Out
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-3 mx-2 col-12 order-1 order-lg-2">
          <div class="row">
            <!--REGION TOTAL TIME-->
            <div class="container my-2 box-shadow-245">
              <div class="row bg-primary text-white rounded-top">
                <div class="col-12">Total Time</div>
                <div class="col-12 bg-light rounded-bottom">
                  <div class="row bg-secondary text-white border-times m-2">
                    <h5 class="col-12 my-2">
                      <span>{{ activePP.totalTime }} Hours</span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <!--END REGION TOTAL TIME-->

            <!--REGION ESTIMATED PAY-->
            <div class="container my-2 box-shadow-245">
              <div class="row bg-primary text-white rounded-top">
                <div class="col-12">Estimated Pay</div>
                <div class="col-12 bg-light rounded-bottom">
                  <hourly-component v-if="activeProject.PayType == 'Hourly'" />
                  <salary-component
                    v-else-if="activeProject.PayType == 'Salary'"
                  />
                  <milestone-component
                    v-else-if="activeProject.PayPeriod == 'Milestone'"
                  />
                </div>
              </div>
            </div>
            <!--END REGION ESTIMATED PAY-->

            <!-- REGION INVOICE BUTTON -->
            <div class="container my-2 box-shadow-245">
              <div
                v-if="invoiceReady"
                class="row bg-primary text-white rounded-top"
              >
                <div class="col-12">Invoice Status: Ready</div>
                <div class="col-12 bg-light rounded-bottom">
                  <div class="row py-3">
                    <div class="col-12 d-flex justify-content-around">
                      <button @click="toggleDocPreview()" class="btn btn-info">
                        Word Doc
                      </button>
                      <!-- <button class="btn btn-danger">PDF</button> -->
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="row bg-primary text-white rounded-top">
                <div class="col-12">Invoice Status: In Progress</div>
                <div class="col-12 bg-light rounded-bottom">
                  <div class="row py-3">
                    <div v-if="!forceShowInvoice" class="col-12">
                      <button @click="setInvoiceReady()" class="btn btn-danger">
                        Force Load
                      </button>
                    </div>
                    <div v-else class="col-12 d-flex justify-content-around">
                      <button @click="toggleDocPreview()" class="btn btn-info">
                        Word Doc
                      </button>
                      <!-- <button class="btn btn-danger">PDF</button> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END REGION INVOICE BUTTON -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PayPeriodBreakdown from "../components/PayPeriodBreakdown.vue";
import HourlyComponent from "../components/PayCalcComponents/HourlyComponent.vue";
import SalaryComponent from "../components/PayCalcComponents/SalaryComponent.vue";
import MilestoneComponent from "../components/PayCalcComponents/MilestoneComponent.vue";
import EditProjectFormModal from "../components/modals/EditProjectFormModal.vue";
import ProjectSetupModal from "../components/modals/ProjectSetupModal.vue";
import PayPeriodComponent from "../components/PayPeriodComponent.vue";
import AddTimeComponent from "../components/AddTimeComponent.vue";
import ClockInModal from "../components/modals/TimeClockCommentModal.vue";
import DocPreviewModal from "../components/modals/DocPreviewModal.vue";
import swal from "sweetalert";
import moment from "moment";
export default {
  name: "ProjectDetails",
  data() {
    return {
      showSettingsBox: false,
      showClockOutForm: false,
      editProject: false,
      forceShowInvoice: false,
      showDocPreview: false,
      showAddTimeComp: false,
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
    await this.activeCheck();
    this.loading = false;
  },
  beforeDestroy() {
    this.$store.dispatch("clearActiveProject");
  },
  methods: {
    async clockIn() {
      this.clicked = true;
      setTimeout((this.clicked = false), 1000);
      if (this.activeProject.Active) {
        let timeObj = {
          ProjectId: this.$route.params.projectId,
          StartTime: moment(),
        };
        await this.$store.dispatch("clockIn", timeObj);
      } else {
        this.$router.push({ name: "dashboard" });
      }
    },
    clockOut() {
      if (this.activeProject.Active) {
        this.toggleClockOutForm();
      } else {
        this.$router.push({ name: "dashboard" });
      }
    },
    toggleSettingsBox() {
      this.showSettingsBox = !this.showSettingsBox;
    },
    toggleProjectEditor() {
      this.editProject = !this.editProject;
      if (this.editProject) {
        this.toggleSettingsBox();
      }
    },
    toggleShowAddTimeComp() {
      if (this.activeProject.Active) {
        this.showAddTimeComp = !this.showAddTimeComp;
      } else {
        this.$router.push({ name: "dashboard" });
      }
    },
    toggleClockOutForm() {
      this.showClockOutForm = !this.showClockOutForm;
    },
    setInvoiceReady() {
      this.forceShowInvoice = true;
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
    async getActivePayPeriod() {
      this.$store.dispatch("getActivePayPeriod", this.activePP.id);
    },
    toggleDocPreview() {
      this.showDocPreview = !this.showDocPreview;
    },
    activeCheck() {
      if (!this.activeProject.Active) {
        this.$router.push({ name: "dashboard" });
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
      let i = 0;
      let activeTC;
      while (i < this.activePP.weeks.length) {
        let week = this.activePP.weeks[i];
        let x = 0;
        while (x < week.days.length) {
          if (week.days[x].activeTC) {
            activeTC = week.days[x].activeTC;
          }
          x++;
        }
        i++;
      }
      return activeTC;
    },
    activePP() {
      return this.$store.state.activePP;
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
    payPeriodDisplay() {
      return this.$store.state.payPeriodDisplay;
    },
    invoiceReady() {
      if (this.activeProject.PayPeriod == "Milestone") {
        return true;
      } else {
        let today = moment();
        return moment(this.activePP.endDay).isSameOrBefore(today);
      }
    },
  },
  components: {
    PayPeriodBreakdown,
    HourlyComponent,
    EditProjectFormModal,
    SalaryComponent,
    MilestoneComponent,
    PayPeriodComponent,
    AddTimeComponent,
    ClockInModal,
    DocPreviewModal,
    ProjectSetupModal,
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
  top: 0px;
  right: 1%;
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
  top: 10vh;
  left: 10vw;
  right: 10vw;
  z-index: 100;
  border-radius: 20px;
  background-color: rgba(171, 180, 187, 0.95);
  max-height: 90vh;
  max-width: 80vw;
  /* overflow-y: scroll; */
  overflow-y: auto;
  box-shadow: 6px 6px 5px black;
}

@media screen and (min-width: 992px) {
  .modal-content {
    width: 30%;
  }
}

.xxl-modal {
  position: fixed;
  padding: 2rem;
  top: 2vh;
  left: 2vw;
  right: 2vw;
  bottom: 2vh;
  z-index: 100;
  background-color: whitesmoke;
  height: 90vh;
  width: 90vw;
  overflow-y: auto;
  overflow-x: hidden;
}
.backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>