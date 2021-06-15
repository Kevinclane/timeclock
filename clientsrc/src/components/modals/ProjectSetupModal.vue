<template>
  <div class="container-fluid text-black">
    <div v-if="loading" class="spinnerbg">
      <div class="spinner-border text-primary m-40" role="status"></div>
    </div>
    <div class="row">
      <h4 class="col-12">Just a few things before we get the project setup</h4>
    </div>
    <div class="row my-3 pb-2 d-flex justify-content-center border-bottom">
      <div class="col-12">
        What name do you want to show up in the "from" field on the invoices?
      </div>
      <select class="col-10" v-model="settings.NameOnInvoice">
        <option value="Personal">
          Personal Name: {{ profile.FirstName }} {{ profile.LastName }}
        </option>
        <option v-if="profile.BusinessName" value="Business">
          Business Name: {{ profile.BusinessName }}
        </option>
      </select>
    </div>
    <div class="row my-3 pb-2 d-flex justify-content-center border-bottom">
      <div class="col-12">Do you earn overtime on this project?</div>
      <select class="col-10" v-model="settings.OT">
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <div v-if="settings.OT == 'Yes'" class="col-10">Overtime Multiplier</div>
      <span v-if="settings.OT == 'Yes'">
        <i class="fas fa-exclamation-triangle mr-1 coco"
          ><span class="tooltiptext">ie: 1.5 for time and a half</span></i
        >
        <input v-model="settings.OTRate" type="text" />
      </span>
    </div>
    <div class="row mt-3 d-flex justify-content-center">
      <div class="col-12">Do you want to round your hours?</div>
      <select class="col-10" v-model="settings.RoundTime">
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <div class="col-10">
        <div class="row" v-if="settings.RoundTime == 'Yes'">
          <div class="col-12">Round to:</div>
          <select class="col-12" v-model="settings.RoundTo">
            <option value="5">Nearest 5min</option>
            <option value="10">Nearest 10min</option>
            <option value="15">Nearest 15min</option>
            <option value="30">Nearest 30min</option>
            <option value="60">Nearest hour</option>
          </select>
          <div class="col-12">When?</div>
          <select class="col-12" v-model="settings.RoundFrequency">
            <option value="TC">Every time I clock out</option>
            <option value="Day">End of every day</option>
            <option value="Week">End of every week</option>
            <option value="Total">End of the pay period</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row mt-3 d-flex justify-content-between">
      <button class="btn btn-danger" @click="cancel()">Cancel</button>
      <button v-if="canSubmit" class="btn btn-green" @click="save()">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import router from "../../router/index";
export default {
  name: "ProjectSetupModal",
  data() {
    return {
      settings: {
        NameOnInvoice: null,
        OtherName: null,
        OT: null,
        OTRate: 1.5,
        NameOnInvoice: null,
        RoundTime: null,
        RoundTo: null,
        RoundFrequency: null,
      },
      loading: false,
    };
  },
  computed: {
    profile() {
      return this.$store.state.user;
    },
    canSubmit() {
      // debugger;
      let res = true;
      if (
        this.settings.NameOnInvoice &&
        this.settings.OT &&
        this.settings.RoundTime
      ) {
        if (
          this.settings.NameOnInvoice === "Other" &&
          (this.settings.OtherName === "" || !this.settings.OtherName)
        ) {
          res = false;
        }
        if (this.settings.OT === "Yes" && this.settings.OTRate === "") {
          res = false;
        }
        // debugger;
        if (
          this.settings.RoundTime === "Yes" &&
          (this.settings.RoundTo === "" ||
            !this.settings.RoundTo ||
            this.settings.RoundFrequency === "" ||
            !this.settings.RoundFrequency)
        ) {
          res = false;
        }
      } else res = false;
      return res;
    },
  },
  methods: {
    save() {
      this.loading = true;
      let settingsObj = {
        ProjectId: this.$route.params.projectId,
      };

      if (this.settings.NameOnInvoice == "Personal") {
        settingsObj.NameOnInvoice =
          this.profile.FirstName + " " + this.profile.LastName;
      } else if (this.settings.NameOnInvoice == "Business") {
        settingsObj.NameOnInvoice = this.profile.BusinessName;
      } else if (this.settings.NameOnInvoice == "Other") {
        settingsObj.NameOnInvoice = this.settings.OtherName;
      }

      if (this.settings.OT == "Yes") {
        settingsObj.OT = true;
        settingsObj.OTRate = parseFloat(this.settings.OTRate);
      } else {
        settingsObj.OT = false;
      }

      if (this.settings.RoundTime == "Yes") {
        settingsObj.RoundTime = true;
        settingsObj.RoundTo = parseInt(this.settings.RoundTo);
        settingsObj.RoundFrequency = this.settings.RoundFrequency;
      }
      this.$store.dispatch("saveProjectSettings", settingsObj);
    },
    cancel() {
      router.push({ name: "dashboard" });
    },
  },
};
</script>

<style scoped>
.coco {
  color: chocolate;
  /* margin-top: 0.25rem;
  position: relative; */
}
.coco .tooltiptext {
  visibility: hidden;
  max-width: 200px;
  background-color: rgb(214, 219, 207);
  color: black;
  text-align: center;
  border-radius: 6px;
  border: 2px solid black;
  padding: 5px 5px;
  position: absolute;
  right: 75%;
  z-index: 1000;
}
.coco:hover .tooltiptext {
  visibility: visible;
}
.spinnerbg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
  background-color: rgb(128, 128, 128, 0.8);
}
.m-40 {
  margin: 40%;
}
</style>