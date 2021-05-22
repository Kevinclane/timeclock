<template>
  <div class="row border-times bg-secondary text-white m-2">
    <div class="col-12 center-center bg-cstm-blue">New Time</div>
    <form @submit="addTimeClock">
      <div class="row my-2">
        <div class="col-lg-4 col-12 text-center dynamic-time-title">
          <h5>Start:</h5>
        </div>
        <div
          class="col-lg-8 col-10 offset-1 offset-lg-0 d-flex dynamic-time-form"
        >
          <input
            class="w-5rem"
            type="number"
            name="startHour"
            id="startHour"
            value="startHour"
            placeholder="hour"
            v-model="newTime.startHour"
            minlength="2"
            maxlength="2"
            min="1"
            max="12"
            required
          />
          :
          <input
            class="w-5rem"
            type="number"
            name="startMinute"
            id="startMinute"
            placeholder="minute"
            v-model="newTime.startMinute"
            minlength="2"
            maxlength="2"
            min="0"
            max="59"
            required
          />
          <select
            name="startAMPM"
            id="startAMPM"
            required
            v-model="newTime.startAMPM"
            class="h-100 ml-1"
          >
            <option value="AM" selected>AM</option>
            <option value="PM">PM</option>
          </select>
          <input
            type="date"
            name="startDate"
            id="startDate"
            class="w-5rem ml-1 wide-date"
            v-model="newTime.startDate"
            required
          />
        </div>
        <div class="col-lg-4 col-12 text-center dynamic-time-title">
          <h5>End:</h5>
        </div>
        <div
          class="col-lg-8 col-10 offset-1 offset-lg-0 d-flex dynamic-time-form"
        >
          <input
            class="w-5rem"
            type="number"
            name="endHour"
            id="endHour"
            placeholder="hour"
            v-model="newTime.endHour"
            minlength="2"
            maxlength="2"
            min="1"
            max="12"
            required
          />
          :
          <input
            class="w-5rem"
            type="number"
            name="endMinute"
            id="endMinute"
            placeholder="minute"
            v-model="newTime.endMinute"
            minlength="2"
            maxlength="2"
            min="0"
            max="59"
            required
          />
          <select
            name="endAMPM"
            id="endAMPM"
            required
            v-model="newTime.endAMPM"
            class="h-100 ml-1"
          >
            <option value="AM" selected>AM</option>
            <option value="PM">PM</option>
          </select>
          <input
            type="date"
            name="endDate"
            id="endDate"
            class="w-5rem ml-1 wide-date"
            v-model="newTime.endDate"
            required
          />
        </div>
        <div class="col-12 d-flex justify-content-center">
          <textarea
            name="comments"
            cols="50"
            rows="10"
            v-model="newTime.comment"
            placeholder="Comments"
            required
          ></textarea>
        </div>
        <div class="col-12 d-flex justify-content-around mt-3">
          <button class="btn btn-danger" type="button" @click="closeModal">
            Cancel
          </button>
          <button class="btn btn-green" type="submit">Add</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "AddTimeModal",
  props: ["project"],
  data() {
    return {
      newTime: {
        startHour: "",
        startMinute: "",
        startAMPM: "",
        startDate: "",
        endHour: "",
        endMinute: "",
        endAMPM: "",
        endDate: "",
        comment: "",
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
      this.$emit("updateView");
    },
    addTimeClock(e) {
      e.preventDefault();
      if (this.newTime.startAMPM == "PM") {
        this.newTime.startHour = (
          parseInt(this.newTime.startHour) + 12
        ).toString();
      }
      if (this.newTime.startHour == "12" && this.newTime.startAMPM == "AM") {
        this.newTime.startHour = "00";
      }
      if (this.newTime.startHour.length == 1) {
        this.newTime.startHour = "0" + this.newTime.startHour;
      }
      if (this.newTime.startMinute.length == 1) {
        this.newTime.startMinute = "0" + this.newTime.startMinute;
      }
      if (this.newTime.endAMPM == "PM") {
        this.newTime.endHour = (parseInt(this.newTime.endHour) + 12).toString();
      }
      if (this.newTime.endHour.length == 1) {
        this.newTime.endHour = "0" + this.newTime.endHour;
      }
      if (this.newTime.endMinute.length == 1) {
        this.newTime.endMinute = "0" + this.newTime.endMinute;
      }
      let startString =
        this.newTime.startDate +
        "T" +
        this.newTime.startHour +
        ":" +
        this.newTime.startMinute +
        ":00";
      let endString =
        this.newTime.endDate +
        "T" +
        this.newTime.endHour +
        ":" +
        this.newTime.endMinute +
        ":00";
      let timeClock = {
        ProjectId: this.$route.params.projectId,
        StartTime: moment(startString),
        EndTime: moment(endString),
        Current: false,
        Comment: this.newTime.comment,
      };

      this.$store.dispatch("createTimeClock", timeClock);
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.bg-cstm-blue {
  background-color: midnightblue;
}
.w-5rem {
  width: 5rem;
  height: 100%;
}
.dynamic-time-form {
  justify-content: flex-start;
  align-items: center;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
.dynamic-time-title {
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
@media screen and (max-width: 768px) {
  .dynamic-time-form {
    justify-content: center;
  }
}
@media screen and (min-width: 769px) {
  .wide-date {
    width: 10rem;
  }
}
</style>