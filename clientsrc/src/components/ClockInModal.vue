<template>
  <div>
    <div class="row text-black">
      <div class="col-12">
        <h3>What services will you be providing?</h3>
      </div>
      <div v-if="services.length > 0" class="col-12 mt-3">
        <h5>Previous Services</h5>
        <select name="service" id="service" v-model="choice">
          <time-clock-service-options
            v-for="(Service, index) in services"
            :key="`Service-${index}`"
            :service="Service"
          />
        </select>
      </div>
      <div class="col-12 mt-3">
        <h5>New Service</h5>
        <input
          type="text"
          name="newChoice"
          id="newChoice"
          v-model="newChoice"
        />
      </div>
      <div class="col-12 mt-2">
        <button class="btn btn-green" @click="addService">Add</button>
      </div>
      <div class="col-12 mt-5 d-flex justify-content-around">
        <button class="btn btn-danger" @click="close">Close</button>
        <button class="btn btn-green" @click="clockIn" :disabled="choice == ''">
          Clock In
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TimeClockServiceOptions from "./TimeClockServiceOptions.vue";
import moment from "moment";
export default {
  components: { TimeClockServiceOptions },
  name: "ClockInModal",
  props: ["services"],
  data() {
    return {
      choice: "",
      newChoice: "",
    };
  },
  methods: {
    async clockIn() {
      let timeObj = {
        ProjectId: this.$route.params.projectId,
        StartTime: moment(),
        Service: this.choice,
      };
      await this.$store.dispatch("clockIn", timeObj);
      this.$emit("clockIn");
    },
    close() {
      this.$emit("closeModal");
    },
    addService() {
      this.services.push(this.newChoice);
      this.choice = this.newChoice;
      this.newChoice = "";
    },
  },
};
</script>

<style scoped>
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