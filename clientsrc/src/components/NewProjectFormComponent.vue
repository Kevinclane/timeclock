<template>
  <div>
    <form @submit="addProject" class="row pb-4">
      <div class="col-12 my-1">
        <div class="row">
          <div class="col-4 bold d-flex flex-end">Project Name:</div>
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
          <div class="col-4 bold d-flex flex-end">Invoice Target:</div>
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
          <div class="col-4 bold d-flex flex-end">
            <i class="fas fa-exclamation-triangle mr-1 coco"
              ><span class="tooltiptext"
                >ie. If Monday, invoice will be available Sunday</span
              ></i
            >
            Pay Period:
          </div>

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
          <div class="col-4 bold d-flex flex-end">Start:</div>
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
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
            </select>
          </div>
        </div>
      </div>
      <div
        v-show="newProjectForm.PayPeriod == 'Milestone'"
        class="col-12"
      ></div>

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
export default {
  name: "NewProjectFormComponent",
  data() {
    return {
      newProjectForm: {
        Title: "",
        Payee: "",
        PayPeriod: "",
        PayType: "",
        Start: "",
        End: "",
        InvoiceDate: "",
        Rate: "",
        SalaryFrequency: "",
      },
    };
  },
  methods: {
    addProject(e) {
      e.preventDefault();
      // debugger;
      this.trimWhiteSpace();
      this.newProjectForm.Rate = parseInt(this.newProjectForm.Rate);
      let abort = false;
      let emptyFields = [];
      if (
        this.newProjectForm.PayPeriod == "Weekly" ||
        this.newProjectForm.PayPeriod == "Bi-Weekly"
      ) {
        this.momentDates();
        debugger;
      }
      if (!abort) {
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
      }
    },
    trimWhiteSpace() {
      this.newProjectForm.Title = this.newProjectForm.Title.trim();
      this.newProjectForm.Payee = this.newProjectForm.Payee.trim();
      this.newProjectForm.Rate = this.newProjectForm.Rate.trim();
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