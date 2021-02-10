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
          <div class="col-4 bold d-flex flex-end">Invoice Date</div>
          <div class="col-6 d-flex justify-content-left align-items-center">
            <input
              v-model="newProjectForm.end"
              type="date"
              name="End"
              id="End"
            />
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
        Rate: "",
        SalaryFrequency: "",
      },
    };
  },
  methods: {
    addProject(e) {
      e.preventDefault();
      debugger;
    },
  },
};
</script>

<style scoped>
input {
  height: 1.5rem;
  max-width: 100%;
}
select {
  height: 1.5rem;
  max-width: 100%;
}
</style>