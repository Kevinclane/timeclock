<template>
  <div>
    <form @submit="addProject" class="row pb-4">
      <div class="col-12 my-1">
        <div class="row">
          <div class="col-4 bold d-flex flex-end">
            <i class="fas fa-exclamation-triangle mr-1 coco"
              ><span class="tooltiptext"
                >Special character allowed: {{ charsAllowed.chars }}</span
              ></i
            >
            Project Name:
          </div>
          <div class="col-6 d-flex">
            <input
              v-model="newProjectForm.Title"
              type="text"
              name="Title"
              id="Title"
              required
            />
          </div>
        </div>
      </div>
      <div class="col-12 my-1">
        <div class="row">
          <div class="col-4 bold d-flex flex-end">
            <i class="fas fa-exclamation-triangle mr-1 coco"
              ><span class="tooltiptext"
                >Special character allowed: {{ charsAllowed.chars }}</span
              ></i
            >
            Invoice Target:
          </div>
          <div class="col-6 d-flex">
            <input
              v-model="newProjectForm.Payee"
              type="text"
              name="Payee"
              id="Payee"
              required
            />
          </div>
        </div>
      </div>

      <!--PAY PERIOD-->

      <div class="col-12 my-1">
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Pay Period:</div>

          <div class="col-6 d-flex flex-column justify-content-left">
            <select
              v-model="newProjectForm.PayPeriod"
              name="PayPeriod"
              id="PayPeriod"
              required
            >
              <option value="" selected disabled hidden></option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="FirstAndFive">1st and 15th</option>
              <option value="Monthly">Monthly</option>
              <option value="Milestone">Milestone</option>
            </select>
          </div>
        </div>
      </div>

      <!--END PAY PERIOD-->

      <!-- DATE SELECT-->

      <div
        v-show="
          newProjectForm.PayPeriod == 'Weekly' ||
          newProjectForm.PayPeriod == 'Bi-Weekly'
        "
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">
            <i class="fas fa-exclamation-triangle mr-1 coco"
              ><span class="tooltiptext"
                >ie. If Monday, invoice will be available Sunday</span
              ></i
            >Start:
          </div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <input
              v-model="newProjectForm.Start"
              type="date"
              name="Start"
              id="Start"
            />
          </div>
        </div>
      </div>
      <div v-show="newProjectForm.PayPeriod == 'Monthly'" class="col-12">
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Invoice Day</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <select
              v-model="newProjectForm.InvoiceDay"
              name="InvoiceDay"
              id="InvoiceDay"
            >
              <option value="" selected hidden disabled></option>
              <option value="Last">Last day of the month</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
              <option value="4">4th</option>
              <option value="5">5th</option>
              <option value="6">6th</option>
              <option value="7">7th</option>
              <option value="8">8th</option>
              <option value="9">9th</option>
              <option value="10">10th</option>
              <option value="11">11th</option>
              <option value="12">12th</option>
              <option value="13">13th</option>
              <option value="14">14th</option>
              <option value="15">15th</option>
              <option value="16">16th</option>
              <option value="17">17th</option>
              <option value="18">18th</option>
              <option value="19">19th</option>
              <option value="20">20th</option>
              <option value="21">21th</option>
              <option value="22">22th</option>
              <option value="23">23th</option>
              <option value="24">24th</option>
              <option value="25">25th</option>
              <option value="26">26th</option>
              <option value="27">27th</option>
              <option value="28">28th</option>
            </select>
          </div>
        </div>
      </div>

      <!--END  DATE SELECT-->

      <!--PAY TYPES-->

      <div
        v-show="
          newProjectForm.PayPeriod != '' &&
          newProjectForm.PayPeriod != 'Milestone'
        "
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Pay Type:</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <select
              v-model="newProjectForm.PayType"
              name="PayType"
              id="PayType"
            >
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
          newProjectForm.PayPeriod != '' &&
          (newProjectForm.PayType != '' ||
            newProjectForm.PayPeriod == 'Milestone')
        "
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Rate:</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <input
              v-model="newProjectForm.Rate"
              type="text"
              name="Rate"
              id="Rate"
            />
          </div>
        </div>
      </div>

      <!--END RATE-->

      <!--SALARY OPTIONS-->

      <div
        v-show="
          newProjectForm.PayType == 'Salary' &&
          newProjectForm.PayPeriod != 'Milestone'
        "
        class="col-12 my-1"
      >
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Every:</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <select
              v-model="newProjectForm.SalaryFrequency"
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

      <button type="submit" class="btn btn-success btnSubmit">Add</button>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import swal from "sweetalert";
export default {
  name: "NewProjectFormComponent",
  data() {
    return {
      newProjectForm: {
        Title: "", //req
        Payee: "", //req
        PayPeriod: "", //req
        PayType: "",
        Start: "",
        End: "",
        InvoiceDay: "",
        Rate: "", //req
        SalaryFrequency: "",
      },
      charsAllowed: {
        chars: "- _ ! : ' / ",
      },
    };
  },
  methods: {
    addProject(e) {
      e.preventDefault();
      // debugger;

      let abort = false;
      let emptyFields = [];
      if (
        this.newProjectForm.PayPeriod == "Weekly" ||
        this.newProjectForm.PayPeriod == "Bi-Weekly"
      ) {
        if (this.newProjectForm.Start == "") {
          emptyFields.push("(Start) ");
          abort = true;
        } else {
          this.momentDates();
        }
        if (this.newProjectForm.PayType == "") {
          emptyFields.push("(Pay Type) ");
          abort = true;
        }
      } else if (this.newProjectForm.PayPeriod == "FirstAndFive") {
        if (this.newProjectForm.PayType == "") {
          emptyFields.push("(Pay Type) ");
          abort = true;
        }
      } else if (this.newProjectForm.PayPeriod == "Monthly") {
        if (this.newProjectForm.InvoiceDay == "") {
          emptyFields.push("(Invoice Day) ");
          abort = true;
        }
        if (this.newProjectForm.PayType == "") {
          emptyFields.push("(Pay Type) ");
          abort = true;
        }
      }
      if (this.newProjectForm.PayType == "Salary") {
        if (this.newProjectForm.PayPeriod == "") {
          emptyFields.push("(Every) ");
          abort = true;
        }
      }
      if (this.newProjectForm.Rate == "") {
        emptyFields.push("(Rate) ");
        abort = true;
      }
      if (!abort) {
        this.trimWhiteSpace();
        this.characterCheck();
        this.newProjectForm.Rate = parseInt(this.newProjectForm.Rate);
        this.$store.dispatch("createProject", { ...this.newProjectForm });
        this.newProjectForm = {
          Title: "",
          Payee: "",
          PayPeriod: "",
          PayType: "",
          Start: "",
          End: "",
          InvoiceDay: "",
          Rate: "",
          SalaryFrequency: "",
        };
      } else {
        let i = 0;
        let missing = ``;
        while (i < emptyFields.length) {
          missing += emptyFields[i];
          i++;
        }
        swal({
          title: "Missing fields:",
          text: missing,
          button: "close",
        });
      }
    },
    trimWhiteSpace() {
      this.newProjectForm.Title = this.newProjectForm.Title.trim();
      this.newProjectForm.Payee = this.newProjectForm.Payee.trim();
      this.newProjectForm.Rate = this.newProjectForm.Rate.trim();
    },
    characterCheck() {
      this.newProjectForm.Title = this.newProjectForm.Title.replace(
        /[&\/\\#,+()$~%.":*?<>{}]/g,
        ""
      );
      this.newProjectForm.Payee = this.newProjectForm.Payee.replace(
        /[&\/\\#,+()$~%.":*?<>{}]/g,
        ""
      );
      this.newProjectForm.Rate = this.newProjectForm.Rate.replace(
        /[&\/\\#,+()$~%.'":*?<>{}]/g,
        ""
      );
      debugger;
    },
    momentDates() {
      let startDate = moment(this.newProjectForm.Start);
      this.newProjectForm.Start = moment(this.newProjectForm.Start).format(
        "YYYY-MM-DD"
      );
      if (this.newProjectForm.PayPeriod == "Weekly") {
        let endDate = moment(startDate, "YYYY-MM-DD").add(7, "days");
        this.newProjectForm.End = moment(endDate).local().format("YYYY-MM-DD");
      } else if (this.newProjectForm.PayPeriod == "Bi-Weekly") {
        let endDate = moment(startDate, "YYYY-MM-DD").add(14, "days");
        this.newProjectForm.End = moment(endDate).local().format("YYYY-MM-DD");
      }
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