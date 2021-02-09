<template>
  <div class="container">
    <div class="row my-3">
      <div class="col">
        <button
          v-if="!showProjectForm"
          class="btn btn-primary"
          @click="toggleProjectForm"
        >
          Add Project
        </button>
        <button
          v-if="showProjectForm"
          class="btn btn-danger"
          @click="toggleProjectForm"
        >
          Cancel
        </button>

        <!--PROJECT MODAL-->
        <div v-if="showProjectForm" class="modal-content container">
          <form @submit="addProject" class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-6 my-1 bold">Project Name:</div>
                <div class="col-6 d-flex">
                  <input
                    v-model="newProjectForm.title"
                    type="text"
                    name="title"
                    id="title"
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col-6 my-1 bold">Invoice Target:</div>
                <div class="col-6 d-flex">
                  <input
                    v-model="newProjectForm.payee"
                    type="text"
                    name="payee"
                    id="payee"
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="row my-1">
                <div class="col-6 bold">Pay Period:</div>
                <div class="col-6 d-flex flex-column justify-content-left">
                  <div class="d-flex justify-content-left align-items-center">
                    <input
                      v-model="newProjectForm.payPeriod"
                      type="radio"
                      name="payperiod"
                      value="daily"
                    />
                    <span> Daily</span>
                  </div>
                  <div class="d-flex justify-content-left align-items-center">
                    <input
                      v-model="newProjectForm.payPeriod"
                      type="radio"
                      name="payperiod"
                      value="weekly"
                    />
                    <span> Weekly</span>
                  </div>
                  <div class="d-flex justify-content-left align-items-center">
                    <input
                      v-model="newProjectForm.payPeriod"
                      type="radio"
                      name="payperiod"
                      value="biweekly"
                    />
                    <span> Bi-Weekly</span>
                  </div>
                  <div class="d-flex justify-content-left align-items-center">
                    <input
                      v-model="newProjectForm.payPeriod"
                      type="radio"
                      name="payperiod"
                      value="firstandfive"
                    />
                    <span> 1st and 15th</span>
                  </div>
                  <div class="d-flex justify-content-left align-items-center">
                    <input
                      v-model="newProjectForm.payPeriod"
                      type="radio"
                      name="payperiod"
                      value="monthly"
                    />
                    <span> Monthly</span>
                  </div>
                </div>
              </div>
            </div>
            <!--PAY PERIOD OPTIONS-->
            <div class="col-12">
              <div v-show="newProjectForm.payPeriod == 'weekly'">
                <span>Start:</span>
                <select name="start" id="start" required>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
                <span>End: </span>
                <select name="end" id="end">
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              <div v-show="newProjectForm.payPeriod == 'biweekly'">
                bi-weekly
              </div>
              <div v-show="newProjectForm.payPeriod == 'firstandfive'">
                1st and 15th
              </div>
              <div v-show="newProjectForm.payPeriod == 'monthly'">monthly</div>
            </div>
            <!--END PAY PERIOD OPTIONS-->

            <button type="submit" class="btn btn-success btnSubmit">Add</button>
          </form>
        </div>
        <!--END PROJECT MODAL-->
      </div>
    </div>
    <div class="row"></div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      showProjectForm: false,
      newProjectForm: {
        title: "",
        payee: "",
        payPeriod: "",
      },
    };
  },
  methods: {
    toggleProjectForm() {
      this.showProjectForm = !this.showProjectForm;
    },
    addProject(e) {
      e.preventDefault();
      debugger;
    },
  },
};
</script>
<style scoped>
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
.btnSubmit {
  position: absolute;
  bottom: 2vh;
  right: 2vw;
}
.bold {
  font-weight: bold;
}
</style>