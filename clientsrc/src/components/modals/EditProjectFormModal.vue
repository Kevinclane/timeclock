<template>
  <div class="text-black">
    <form @submit="editProject" class="row pb-4">
      <div class="col-12 my-1">
        <div class="row">
          <div class="col-4 bold d-flex flex-end">
            <i class="fas fa-exclamation-triangle mr-1 coco"
              ><span class="tooltiptext"
                >Special characters allowed: {{ charsAllowed.chars }}</span
              ></i
            >
            Invoice Target:
          </div>
          <div class="col-6 d-flex">
            <input
              v-model="project.Payee"
              type="text"
              name="Payee"
              id="Payee"
              maxlength="50"
              required
            />
          </div>
        </div>
      </div>

      <!--PAY TYPES-->

      <div
        v-show="project.PayPeriod != '' && project.PayPeriod != 'Milestone'"
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Pay Type:</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <select v-model="project.PayType" name="PayType" id="PayType">
              <option value="" selected disabled hidden></option>
              <option value="Hourly">Hourly</option>
              <option value="Salary">Salary</option>
            </select>
          </div>
        </div>
      </div>

      <!--END PAY TYPES-->

      <!--RATE-->

      <div
        v-show="
          project.PayPeriod != '' &&
          (project.PayType != '' || project.PayPeriod == 'Milestone')
        "
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Rate:</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <input
              v-model="project.Rate"
              type="text"
              name="Rate"
              id="Rate"
              maxlength="10"
            />
          </div>
        </div>
      </div>

      <!--END RATE-->

      <!--SALARY OPTIONS-->

      <div
        v-show="project.PayType == 'Salary' && project.PayPeriod != 'Milestone'"
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Every:</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <select
              v-model="project.SalaryFrequency"
              name="SalaryFrequency"
              id="SalaryFrequency"
            >
              <option value="" selected disabled hidden></option>
              <option value="Daily">Day</option>
              <option value="Weekly">Week</option>
              <option value="Monthly">Month</option>
            </select>
          </div>
        </div>
      </div>

      <!--END SALARY OPTIONS-->

      <button
        class="btn btn-danger btn-cancel"
        type="button"
        @click="closeModal"
      >
        Cancel
      </button>
      <button type="submit" class="btn btn-green btn-submit">Update</button>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import swal from "sweetalert";
export default {
  name: "EditProjectFormComponent",
  data() {
    return {
      charsAllowed: {
        chars: "- _ ! : ' / ",
      },
    };
  },
  mounted() {
    this.project.Rate = this.project.Rate.toString();
  },
  methods: {
    editProject(e) {
      e.preventDefault();
      let emptyFields = [];
      let abort = this.characterCheck();
      this.trimWhiteSpace();
      if (
        this.project.PayPeriod == "Weekly" ||
        this.project.PayPeriod == "Bi-Weekly"
      ) {
        if (this.project.PayType == "") {
          emptyFields.push("(Pay Type) ");
          abort = true;
        }
      }
      if (this.project.PayType == "Salary") {
        if (this.project.SalaryFrequency == "") {
          emptyFields.push("(Every) ");
          abort = true;
        }
      }
      if (this.project.Rate == "") {
        emptyFields.push("(Rate) ");
        abort = true;
      }
      if (!abort) {
        this.$store.dispatch("editProject", { ...this.project });
        this.$emit("closeModal");
      } else {
        let i = 0;
        let missing = ``;
        while (i < emptyFields.length) {
          missing += emptyFields[i];
          i++;
        }
        if (missing == ``) {
          missing = "Rate must be a number";
        }
        swal({
          title: "Missing fields:",
          text: missing,
          button: "close",
        });
      }
    },
    closeModal() {
      this.$emit("closeModal");
    },
    trimWhiteSpace() {
      this.project.Payee = this.project.Payee.trim();
      if (typeof this.project.Rate == "number") {
        this.project.Rate = this.project.Rate.toString();
      }
      this.project.Rate = this.project.Rate.trim();
    },
    characterCheck() {
      let res = false;
      this.project.Payee = this.project.Payee.replace(
        /[&\/\\#,+()$~%.":*?<>{}]/g,
        ""
      );
      let rate = this.project.Rate;
      if (rate.includes(".")) {
        let split = rate.split(".");
        let isnum0 = /^\d+$/.test(split[0]);
        let isnum1 = /^\d+$/.test(split[1]);
        if (!isnum0 || !isnum1) {
          res = true;
        }
      } else {
        let isnum = /^\d+$/.test(rate);
        if (!isnum) {
          res = true;
        }
      }
      return res;
    },
  },
  computed: {
    project() {
      return this.$store.state.activeProject;
    },
  },
};
</script>

<style scoped>
input {
  height: 1.5rem;
  width: 100%;
}
select {
  height: 1.5rem;
  width: 100%;
}
.coco {
  color: chocolate;
  margin-top: 0.25rem;
  position: relative;
}
.coco .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: rgb(214, 219, 207);
  color: black;
  text-align: center;
  border-radius: 6px;
  border: 2px solid black;
  padding: 5px 5px;
  position: absolute;
  z-index: 1000;
}
.coco:hover .tooltiptext {
  visibility: visible;
}
</style>