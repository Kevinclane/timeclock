<template>
  <div>
    <form @submit="updateTimeClock">
      <div class="row">
        <div class="col-12">
          <input
            class="mx-w-50"
            type="text"
            name="startHour"
            id="startHour"
            placeholder="hour"
            v-model="editedTime.startHour"
            maxlength="2"
            required
          />
          :
          <input
            class="mx-w-50"
            type="text"
            name="startMinute"
            id="startMinute"
            placeholder="minute"
            v-model="editedTime.startMinute"
            minlength="2"
            maxlength="2"
            required
          />
          <select
            name="startAMPM"
            id="startAMPM"
            required
            v-model="editedTime.startAMPM"
          >
            <option value="AM" selected>AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div class="col-12">
          <input
            class="mx-w-50"
            type="text"
            name="endHour"
            id="endHour"
            placeholder="hour"
            v-model="editedTime.endHour"
            maxlength="2"
          />
          :
          <input
            class="mx-w-50"
            type="text"
            name="endMinute"
            id="endMinute"
            placeholder="minute"
            v-model="editedTime.endMinute"
            minlength="2"
            maxlength="2"
          />
          <select
            name="endAMPM"
            id="endAMPM"
            required
            v-model="editedTime.endAMPM"
          >
            <option value="AM" selected>AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div class="col-12 d-flex justify-content-between">
          <button
            class="btn btn-sm btn-danger"
            type="button"
            @click="closeModal"
          >
            Cancel
          </button>
          <button class="btn btn-sm btn-success" type="submit">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "EditTimeClockFormComponent",
  props: ["timeClock"],
  data() {
    return {
      editedTime: {
        startHour: "",
        startMinute: "",
        startAMPM: "",
        endHour: "",
        endMinute: "",
        endAMPM: "",
      },
    };
  },
  methods: {
    updateTimeClock(e) {
      e.preventDefault();
      debugger;
      let date = moment(this.timeClock.StartTime).format("MM-DD-YYYY");
      let startTimeString =
        this.editedTime.startHour +
        ":" +
        this.editedTime.startMinute +
        " " +
        this.editedTime.startAMPM;
      let endTimeString =
        this.editedTime.endHour +
        ":" +
        this.editedTime.endMinute +
        " " +
        this.editedTime.endAMPM;
      let newTimeClock = { ...this.timeClock };
      newTimeClock.StartTime = moment(date + " " + startTimeString);
      newTimeClock.EndTime = moment(date + " " + endTimeString);
      this.$store.dispatch("updateTimeClock", newTimeClock);
      this.$emit("closeModal");
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.mx-w-50 {
  max-width: 50%;
  width: 5rem;
}
</style>